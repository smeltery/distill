export const repository = "https://github.com/smeltery/distill";
export const pages = [
  {
    slug: "",
    file: "index",
    title: "Overview",
    group: "Start here",
    description:
      "Focused knowledge for AI agents. Understand the pipeline and current capabilities.",
  },
  {
    slug: "quick-start",
    file: "quick-start",
    title: "Quick start",
    group: "Start here",
    description: "Install Distill and compact your first Markdown document.",
  },
  {
    slug: "sources",
    file: "sources",
    title: "Sources",
    group: "Guides",
    description:
      "Register Markdown files and directories. Understand input limits.",
  },
  {
    slug: "templates",
    file: "templates",
    title: "Templates",
    group: "Guides",
    description:
      "Choose rules, principles, patterns, or raw. Write custom prompts.",
  },
  {
    slug: "agents",
    file: "agents",
    title: "Agents",
    group: "Guides",
    description: "Configure Claude, Codex, Anthropic, or OpenAI providers.",
  },
  {
    slug: "sharing",
    file: "sharing",
    title: "Sharing context",
    group: "Guides",
    description: "Review output and install shared context repositories.",
  },
  {
    slug: "configuration",
    file: "configuration",
    title: "Configuration",
    group: "Reference",
    description: "YAML settings, output paths, state, and defaults.",
  },
  {
    slug: "commands",
    file: "commands",
    title: "Command reference",
    group: "Reference",
    description: "CLI commands, flags, dry runs, and implemented behavior.",
  },
  {
    slug: "troubleshooting",
    file: "troubleshooting",
    title: "Troubleshooting",
    group: "Resources",
    description:
      "Resolve source, authentication, compaction, and sharing errors.",
  },
  {
    slug: "development",
    file: "development",
    title: "Development",
    group: "Resources",
    description: "Flox, Bun, CI, pre-commit hooks, and releases.",
  },
];
export const docHref = (slug: string) => (slug ? `/docs/${slug}` : "/docs");
export const headingId = (title: string) =>
  title
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
