# Sources in. _Knowledge out._

The Distill command-line reference. Register a local Markdown source, choose how to compact it, and write focused context your agent can reuse. Every example runs from the directory containing your `distill.yaml`.

> Distill is a CLI, not an HTTP service. Markdown ingestion and compaction work today. Other input formats, automated publishing, and output validation are not implemented yet.

```sh
distill <name> [flags]
```

New here? Follow the [quick start](quick-start.md). Already configured? Jump to [compaction](#compact-a-source), [registration](#register-a-source), or the [flag reference](#common-flags).

## Your first compaction

Install and authenticate your chosen [agent](agents.md), then run these commands in a directory containing `guide.md`:

```sh
distill config init
distill add markdown ./guide.md --name guide --template rules
distill guide --dry-run
distill guide
```

The first command writes configuration. The second registers the source without calling a model. The dry run prepares the source chunks for inspection. The final command sends each chunk to your agent and writes `output/guide/guide-minified.md`.

Read the result alongside the source before adding it to an agent’s context. A smaller document is useful only if the important qualifications survive.

## Compact a source

Pass the registered source name, not its filesystem path. You can override the configured agent and requested token budget for one run:

```sh
distill guide
distill guide --agent codex-cli --token-budget 2000
distill guide --dry-run
```

A successful run writes the assembled Markdown and records state in `.distill-state.yaml`. Existing output is replaced. A missing source name, unavailable agent, or failed model call returns an error.

The token budget is a prompt instruction **per chunk**, not a hard cap on the final file. For a directory, several responses can be joined into a result larger than the requested budget. See [templates](templates.md#set-the-token-budget).

## Register a source

Use `add` to save a source definition in your project configuration. A name makes the source easy to address on later runs:

```sh
distill add markdown ./handbook.md --name handbook --template rules
distill add markdown ./notes --name architecture --template principles
distill add markdown ./patterns.md --name patterns --output-dir engineering
```

| Flag           | Default                   | Behavior                                           |
| -------------- | ------------------------- | -------------------------------------------------- |
| `--name`       | Derived from the location | Name used by compaction and update                 |
| `--template`   | `rules`                   | Built-in template or custom template name          |
| `--output-dir` | Source name               | Subdirectory beneath `output.dir`                  |
| `--split-by`   | Unset                     | Saved in config; not used by the Markdown pipeline |

Registering an existing name fails rather than replacing it. Edit that source in `distill.yaml` to change its path or template. `add` does not verify that the source can be ingested; use a dry run before a model call.

Only Markdown ingestion is implemented. A Markdown directory includes immediate `.md` files in sorted order, without descending into nested directories. Read [sources](sources.md) for the complete behavior.

## Update existing sources

Reprocess one source by name, or omit the name to process all configured sources in sorted order:

```sh
distill update guide
distill update --dry-run
distill update --agent codex-cli
```

Update currently reprocesses unchanged content too. Recorded hashes describe the previous run; they do not skip work. Use version control to compare generated files after updating.

> **Automation:** a batch update continues after individual failures and currently returns success even when a source fails. Run each source by name when your script needs reliable failure detection.

```sh
# Stop if either named compaction fails.
distill handbook && distill architecture
```

## Inspect your setup

These commands help you understand what Distill will use before you spend time on a model call:

```sh
distill list
distill templates
distill agents
distill --version
```

`list` shows registered sources and recorded status. `templates` lists the built-in output formats. `agents` reports configured providers and basic availability, such as whether a CLI executable or API key exists. Availability does not guarantee that remote authentication, a model, or your subscription will work.

## Create configuration

```sh
distill config init
```

Writes a default `distill.yaml` in the current directory. If a file already exists, the command stops. Use `distill config init --force` only when you intend to replace it with defaults.

The selected project or global configuration overlays built-in defaults. See [configuration](configuration.md) for lookup order, a complete working example, and output settings.

## Scaffold shared context

Create an index, README, and ignore file in a context directory:

```sh
distill init team-context
```

This writes `team-context/index.md`, `team-context/README.md`, and `team-context/.gitignore`. It does not initialize Git, register sources, or copy generated output. Use a new directory: the scaffold files are overwritten if they already exist.

Follow [sharing context](sharing.md) to add reviewed documents and create a repository.

## Install shared context

Clone a context repository, or pull an existing Git repository at the target. Replace the example URL with your team’s repository:

```sh
distill install https://github.com/your-team/context.git
distill install https://github.com/your-team/context.git --target ./agent-context
```

The default target is `~/.claude/docs/`. A custom target works for other agent workflows. When a Git repository already exists there, Distill runs `git pull`; it does not check that its remote matches the supplied URL. Confirm the target before updating.

## Common flags

Run `distill --help` or `distill <command> --help` for command usage. The current behavior of shared flags is:

| Flag                 | Use                                                             |
| -------------------- | --------------------------------------------------------------- |
| `--agent <name>`     | Select a configured agent for compaction                        |
| `--token-budget <n>` | Override the per-chunk prompt budget                            |
| `--dry-run`          | Preview compaction chunks without a model call or output write  |
| `--force`            | Allow config overwrite; compaction currently always reprocesses |
| `--verbose`          | Reserved; detailed logging is not implemented                   |
| `--version`          | Print the binary version                                        |

`--dry-run` is implemented for compaction and update. It is not a universal no-write mode for registration, configuration, scaffolding, or installation.

## Placeholder commands

`distill validate [name]` and `distill publish` only print “not yet implemented” and return success. Do not use their exit codes as validation or publishing evidence. Review generated Markdown yourself and use Git to share it.

## Batch errors

For an interactive batch, read the individual errors and the final update count. For automation, prefer named compactions and check each exit status. The [troubleshooting guide](troubleshooting.md) covers missing binaries, API keys, configuration, and unsupported inputs.
