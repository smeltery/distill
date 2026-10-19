# Configuration

Distill stores source definitions, agents, and output settings in YAML.

## Configuration lookup

Distill uses `./distill.yaml` when present, then `~/.config/distill/config.yaml`, then built-in defaults. Project and global files are not merged together. A selected file overlays built-in defaults.

```sh
distill config init
```

This writes a project config. It refuses to overwrite an existing file unless you pass `--force`.

## A minimal project

```yaml
default_agent: claude-cli
output:
  dir: ./output
  token_budget: 4000
sources:
  guide:
    type: markdown
    path: ./guide.md
    template: rules
    output_dir: guide
    output_file: guide-minified.md
```

## Output and state

`output.dir` sets the root output directory. A source's `output_dir` nests underneath it; `output_file` names the generated file. Existing output files are overwritten on successful compaction.

`.distill-state.yaml` records the source hash, template hash, agent name, timestamp, and output paths in the current working directory. Keep it out of shared context repositories. State recording does not currently skip unchanged inputs.

## Reserved settings

`generate_indexes`, `precedence`, `publish.repo`, `output_pattern`, `split_by`, and `chapter_pattern` describe intended behavior that is not fully connected to the current pipeline. Do not depend on automatic index generation or chapter output splitting. Create context indexes manually and review them with your generated documents.

## Configure a project and provider together

This example adds a named API agent and two sources with different output styles. Replace `your-model-id` with a model available to your provider account and set `ANTHROPIC_API_KEY` in your environment before running a compaction.

```yaml
default_agent: team-api
agents:
  team-api:
    provider: anthropic
    model: your-model-id
    api_key_env: ANTHROPIC_API_KEY
    max_tokens: 8192
output:
  dir: ./context
  token_budget: 2000
  custom_templates_dir: ./templates
sources:
  handbook:
    type: markdown
    path: ./references/handbook.md
    template: rules
    output_dir: team
    output_file: handbook.md
  architecture:
    type: markdown
    path: ./references/architecture
    template: principles
    output_dir: engineering
    output_file: architecture.md
```

Running `distill handbook` writes `context/team/handbook.md`. Running `distill architecture` reads the immediate Markdown files in the source directory and writes their assembled responses to `context/engineering/architecture.md`.

The `token_budget` value asks the model to compact each chunk toward 2,000 tokens. `max_tokens` limits the provider response; these settings serve different purposes. Leave enough response space for the requested output.

## Change settings for one run

Use command-line overrides to experiment without editing the project’s defaults:

```sh
distill handbook --agent codex-cli --token-budget 1000
distill architecture --dry-run
```

The agent flag takes a **configuration name**, such as `team-api` or `codex-cli`, rather than a provider type. Relative source and output paths are resolved from the working directory, so run commands from your project root.

## Keep configuration reviewable

Commit `distill.yaml`, custom templates, and reviewed output when they belong in your project. Keep API keys in environment variables and ignore local state if it is not useful to your team. A configuration change is easier to review when the source path, template, and output destination are explicit.

Before changing a source path or replacing output, run `distill <name> --dry-run`. If configuration cannot be read, fix the YAML error first; Distill reports an error rather than falling back silently to a different configuration file.
