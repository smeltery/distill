import hljs from "highlight.js/lib/core";
import bash from "highlight.js/lib/languages/bash";
import yaml from "highlight.js/lib/languages/yaml";
import json from "highlight.js/lib/languages/json";
import markdown from "highlight.js/lib/languages/markdown";

for (const [name, language] of Object.entries({ yaml, json, markdown })) {
  hljs.registerLanguage(name, language);
}
hljs.registerLanguage("bash", (api) => {
  const language = bash(api);
  return {
    ...language,
    contains: [
      { scope: "built_in", match: /\bdistill\b/ },
      { scope: "attr", match: /--[\w-]+/ },
      ...(language.contains ?? []),
    ],
  };
});
export function highlight(code: string, language: string) {
  return hljs.getLanguage(language)
    ? hljs.highlight(code, { language, ignoreIllegals: true }).value
    : code.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
