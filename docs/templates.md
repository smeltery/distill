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

## Start from the task

Use **rules** when your agent needs concrete instructions: naming conventions, error handling, or review standards. Use **principles** when preserving the reasoning matters more than a checklist. Use **patterns** for recurring problems that benefit from an explicit solution and rationale. Use **raw** when the source is already well organized and you mainly want a shorter version.

To compare formats, register the same file under two names. Each source gets its own output directory:

```sh
distill add markdown ./guide.md --name guide-rules --template rules
distill add markdown ./guide.md --name guide-patterns --template patterns
distill guide-rules
distill guide-patterns
```

Read both outputs against the original. Choose the one that helps your agent perform the intended task, rather than the one that is simply shortest.

## A custom prompt you can adapt

Save the following as `templates/team-rules.md` after configuring `custom_templates_dir`:

```markdown
# Team engineering rules

Extract actionable instructions from the source.

- Group related rules under descriptive headings.
- Preserve exceptions and constraints that change how a rule applies.
- Keep concrete examples only when they clarify an instruction.
- Do not invent requirements that are absent from the source.
- Return only the compacted Markdown.
```

```sh
distill add markdown ./handbook.md --name team --template team-rules
distill team --token-budget 2000
```

A template guides the model; it does not guarantee correctness or a particular schema. Review representative output when changing a template, and keep that template in version control alongside your source configuration.
