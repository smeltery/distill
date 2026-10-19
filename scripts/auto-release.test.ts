import { afterEach, expect, test } from "bun:test";
import { execFileSync } from "node:child_process";
import {
  mkdtempSync,
  mkdirSync,
  writeFileSync,
  readFileSync,
  rmSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

const script = resolve("scripts/auto-release.sh");
const roots: string[] = [];
afterEach(() => {
  for (const root of roots.splice(0))
    rmSync(root, { recursive: true, force: true });
});
function fixture() {
  const root = mkdtempSync(join(tmpdir(), "distill-release-"));
  roots.push(root);
  const origin = join(root, "origin.git");
  const repo = join(root, "repo");
  const bin = join(root, "bin");
  mkdirSync(repo);
  mkdirSync(bin);
  const git = (...args: string[]) =>
    execFileSync("git", args, {
      cwd: repo,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    }).trim();
  git("init", "--bare", origin);
  git("init", "-b", "master");
  git("config", "user.name", "Release test");
  git("config", "tag.gpgsign", "false");
  git("config", "commit.gpgsign", "false");
  git("config", "user.email", "release@example.invalid");
  git("commit", "--allow-empty", "-m", "Initial");
  git("remote", "add", "origin", origin);
  git("push", "-u", "origin", "master");
  const log = join(root, "dispatch.log");
  writeFileSync(
    join(bin, "gh"),
    '#!/bin/bash\nif [[ "$1" == release ]]; then exit 1; fi\nprintf "%s\\n" "$*" >> "$DISPATCH_LOG"\n',
    { mode: 0o755 },
  );
  const run = (sha = git("rev-parse", "HEAD")) =>
    execFileSync("/bin/bash", [script], {
      cwd: repo,
      env: {
        ...process.env,
        BASH_ENV: "/dev/null",
        ENV: "/dev/null",
        PATH: `${bin}:${process.env.PATH}`,
        VERIFIED_SHA: sha,
        DEFAULT_BRANCH: "master",
        DISPATCH_LOG: log,
      },
      stdio: ["ignore", "pipe", "pipe"],
    });
  return { git, run, log };
}

test("tag the verified commit and dispatch exactly once per invocation", () => {
  const { git, run, log } = fixture();
  run();
  expect(git("tag", "--points-at", "HEAD")).toBe("v0.1.0");
  expect(readFileSync(log, "utf8")).toBe(
    "workflow run release.yml --ref master -f tag=v0.1.0\n",
  );
  run();
  expect(git("tag", "--list")).toBe("v0.1.0");
  expect(readFileSync(log, "utf8").split("\n").filter(Boolean)).toHaveLength(2);
});

test("ignore prerelease tags and increment the newest stable patch", () => {
  const { git, run, log } = fixture();
  git("tag", "v2.4.9");
  git("tag", "v99.0.0-preview");
  git("push", "--tags");
  git("commit", "--allow-empty", "-m", "Next");
  git("push");
  run();
  expect(git("tag", "--points-at", "HEAD")).toBe("v2.4.10");
  expect(readFileSync(log, "utf8")).toContain("-f tag=v2.4.10");
});

test("do not release a stale or mismatched CI revision", () => {
  const { git, run } = fixture();
  const verified = git("rev-parse", "HEAD");
  git("commit", "--allow-empty", "-m", "Unverified");
  git("push");
  run(verified);
  expect(git("tag", "--list")).toBe("");
  git("checkout", verified);
  run(verified);
  expect(git("tag", "--list")).toBe("");
});
