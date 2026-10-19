# Command reference

Run `distill --help` or `distill <command> --help` for flags and usage.

## Working commands

| Command                       | Behavior                                              |
| ----------------------------- | ----------------------------------------------------- |
| `distill <name>`              | Compact one registered source                         |
| `distill add markdown <path>` | Register a source in project config                   |
| `distill update [name]`       | Reprocess one or all sources                          |
| `distill list`                | Show source configuration and recorded status         |
| `distill templates`           | List built-in templates                               |
| `distill agents`              | Show configured providers and availability            |
| `distill config init`         | Write a default project config                        |
| `distill init <name>`         | Scaffold a context directory with an index and README |
| `distill install <repo-url>`  | Clone or pull a shared context repository             |

## Common flags

| Flag                 | Use                                                             |
| -------------------- | --------------------------------------------------------------- |
| `--agent <name>`     | Select a configured agent                                       |
| `--token-budget <n>` | Override the per-chunk prompt budget                            |
| `--dry-run`          | Preview compaction chunks without a model call or output write  |
| `--force`            | Allow config overwrite; compaction currently always reprocesses |
| `--verbose`          | Reserved; detailed logging is not implemented                   |
| `--version`          | Print the binary version                                        |

`--dry-run` is implemented for compaction and update; it is not a universal no-write mode for other commands.

## Registration flags

Use `--name`, `--template`, and `--output-dir` with `add`. The `--split-by` value is saved but not acted on by the current Markdown pipeline.

## Placeholder commands

`distill validate [name]` and `distill publish` only print “not yet implemented” and return success. Do not use their exit codes as validation or publishing evidence.

## Batch errors

`distill update` without a name continues after an individual source fails and prints a summary. It currently returns success even if one or more sources failed. For automated use, invoke `distill <name>` separately and check each exit status.
