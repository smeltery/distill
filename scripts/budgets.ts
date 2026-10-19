import { execFileSync } from "node:child_process";
import { readFileSync, existsSync } from "node:fs";
import { dirname } from "node:path";

type Exception = { limit: number; reason: string };
type Budgets = {
  defaultLines: number;
  defaultFiles: number;
  files: Record<string, Exception>;
  directories: Record<string, Exception>;
};
const budgets: Budgets = JSON.parse(
  readFileSync(process.argv[2] ?? "scripts/budgets.json", "utf8"),
);
const files = [
  ...new Set(
    execFileSync(
      "git",
      ["ls-files", "-z", "--cached", "--others", "--exclude-standard"],
      { encoding: "utf8" },
    ).split("\0"),
  ),
].filter(
  (file) =>
    file &&
    existsSync(file) &&
    !/(^|\/)(node_modules|\.flox|\.website-studio|dist|\.next|public|assets)\//.test(
      file,
    ) &&
    !/(\.lock|\.sum|package-lock\.json)$/.test(file),
);
const counts = new Map<string, number>();
const errors: string[] = [];
for (const file of files) {
  const dir = dirname(file);
  counts.set(dir, (counts.get(dir) ?? 0) + 1);
  if (
    !/\.(go|tsx?|m?js|css|md|ya?ml|toml|json|sh)$/.test(file) &&
    file !== "Makefile"
  )
    continue;
  const source = readFileSync(file, "utf8");
  const lines = source.split("\n").length - Number(source.endsWith("\n"));
  const limit = budgets.files[file]?.limit ?? budgets.defaultLines;
  if (lines > limit) errors.push(`${file}: ${lines} lines > budget ${limit}`);
}
for (const [dir, count] of counts) {
  const limit = budgets.directories[dir]?.limit ?? budgets.defaultFiles;
  if (count > limit)
    errors.push(`${dir}: ${count} direct files > budget ${limit}`);
}
for (const [path, exception] of Object.entries({
  ...budgets.files,
  ...budgets.directories,
})) {
  if (!exception.reason?.trim())
    errors.push(`${path}: exception must explain its reason`);
}
if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log(
  `Source budgets pass: ${budgets.defaultLines} lines/file, ${budgets.defaultFiles} files/directory.`,
);
