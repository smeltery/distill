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

## Try a self-contained example

If you do not have a source ready, create a small Markdown file in a new working directory. The example below uses the default Claude CLI agent; authenticate it before the final command.

```sh
mkdir distill-example
cd distill-example
cat > guide.md <<'MARKDOWN'
# Engineering conventions

Keep each function focused on one responsibility. Return errors with enough
context to explain the operation that failed, and preserve the original cause.
Write tests for observable behavior rather than implementation details.
MARKDOWN

distill config init
distill add markdown ./guide.md --name guide --template rules
distill guide --dry-run
distill guide
```

You should now have these files. The exact generated prose depends on the selected model:

```text
distill-example/
  guide.md                         # Original source
  distill.yaml                     # Source and agent configuration
  .distill-state.yaml               # Recorded run metadata
  output/guide/guide-minified.md    # Generated Markdown to review
```

## Check the result

Open `output/guide/guide-minified.md` in your editor. Ask three questions before reusing it:

1. **Is it accurate?** Compare each instruction with the original. Keep exceptions that affect how a rule should be applied.
2. **Is it useful for the task?** Rules suit conventions; principles or patterns may be better for reasoning and design work.
3. **Is it small enough?** The budget is a requested target, so inspect the actual output rather than assuming a fixed size.

To try another template, edit the source’s `template` in `distill.yaml`, then rerun `distill guide`. Save a copy or commit the current result first if you want to compare versions.

## Choose your next step

- Add a folder of references with the [source guide](sources.md).
- Change the output shape with [built-in or custom templates](templates.md).
- Switch from the default agent using [agent configuration](agents.md).
- Share reviewed files through a [context repository](sharing.md).
