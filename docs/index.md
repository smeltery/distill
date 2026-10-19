# Overview

Distill turns local Markdown into focused context for AI coding agents. Choose an output template, run your preferred model, and keep the result as readable files you own.

## Less material, more useful context

A long reference document is not always the best thing to load into an agent's context window. Distill asks a model to extract the rules, principles, or patterns that matter, within a requested token budget. Review the result before relying on it: compaction is model-generated and can omit important details.

## How compaction works

```mermaid
flowchart LR
  Source[Local Markdown] --> Template[Compaction template]
  Template --> Agent[CLI or API agent]
  Agent --> Output[Compacted Markdown]
  Output --> Review[Human review]
  Review --> Context[Agent context repository]
```

The CLI reads your source, builds a prompt from the selected template, and calls the configured agent. It writes the result under `output/` and records content and template hashes in `.distill-state.yaml`.

## What works today

- Local Markdown files and directories of Markdown files.
- Four built-in templates and custom template files.
- Claude CLI, Codex CLI, Anthropic API, and OpenAI API providers.
- Source registration, compaction, output tracking, context scaffolding, and repository installation.

PDF, EPUB, Notion, URL, and GitHub inputs are accepted by source registration but their ingestors are not implemented. `validate` and `publish` are placeholders. Automatic index generation, chapter splitting, and skipping unchanged sources are not wired into compaction yet.

## Start with one document

Follow the [quick start](quick-start.md), choose a [template](templates.md), or browse the [command reference](commands.md). The [configuration guide](configuration.md) explains how to change output paths and providers.
