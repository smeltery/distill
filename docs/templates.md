# Templates

Templates determine the shape of the compacted context. All templates are plain Markdown prompts.

## Choose a format

| Template     | Output shape                                         | Best suited to                        |
| ------------ | ---------------------------------------------------- | ------------------------------------- |
| `rules`      | Numbered imperative rules, grouped by section        | Framework guidance and conventions    |
| `principles` | Core principles with chapter context                 | Technical theory and design decisions |
| `patterns`   | Named patterns with problem, solution, and rationale | Reusable approaches                   |
| `raw`        | Light compaction preserving source structure         | Already concise reference material    |

```sh
distill templates
distill add markdown ./guide.md --name guide --template patterns
```

## Write a custom template

Create `templates/team-rules.md` with instructions describing the output you want. Set the directory in `distill.yaml`:

```yaml
output:
  custom_templates_dir: ./templates
```

Register a source with `--template team-rules`. Custom templates are checked before the embedded templates, so a matching filename overrides a built-in template.

## Set the token budget

```sh
distill guide --token-budget 2000
```

The budget is included in the prompt for each chunk. It is an approximate target; providers also have their own response limits. A directory with several chunks can produce an assembled result larger than that per-chunk budget. The `validate` command does not yet enforce output length.
