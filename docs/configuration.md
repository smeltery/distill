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
