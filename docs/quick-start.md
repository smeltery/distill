# Quick start

Install Distill and turn a local guide into agent-readable Markdown.

## Install

Use Go 1.26.9 or newer:

```sh
go install github.com/smeltery/distill@latest
distill --version
```

Make sure your Go binary directory is on `PATH`. Prebuilt macOS and Linux binaries are available from [GitHub Releases](https://github.com/smeltery/distill/releases); choose your operating system and CPU architecture and verify the download against `checksums.txt`.

## Set up your agent

The default provider calls the locally installed `claude` command. Install and authenticate that CLI first. Alternatively, configure an API provider or use Codex; see [agents](agents.md). Compaction sends source content to your selected provider, so choose material you are allowed to share with it.

## Compact your first source

From a working directory containing `guide.md`:

```sh
distill config init
distill add markdown ./guide.md --name guide --template rules
distill guide --dry-run
distill guide
```

The dry run reads the source and prepares chunks without calling the model or writing compacted output. The default output is `output/guide/guide-minified.md`.

## Review and reuse

Read the generated file and compare it with the original. Check for missing qualifications and incorrect rules. Copy reviewed output into your agent's context directory or a shared repository. See [sharing context](sharing.md).

```sh
distill list
distill update guide --token-budget 2000
```

The token budget is a prompt instruction, not a guaranteed hard cap. `update` currently reprocesses sources even when their content has not changed.
