# Sources

Register a local file or a directory and give it a stable name.

## A single Markdown file

```sh
distill add markdown ./guides/react.md --name react --template rules
distill react
```

If you omit `--name`, Distill derives it from the filename. Spaces become hyphens, the extension is removed, and the name is lowercased. Duplicate names return an error; edit `distill.yaml` to update an existing source.

## A directory of files

```sh
distill add markdown ./handbook --name handbook --template principles
```

Directory ingestion reads immediate `.md` files in sorted filename order. It does not recurse into subdirectories. Each nonempty file becomes a chunk. Compaction processes chunks sequentially and joins the results into one output file. Prefix filenames with numbers to control ordering.

## Paths and output

`~/` expands to your home directory. Relative paths resolve from the working directory where you run Distill. Use `--output-dir` to choose the subdirectory beneath the configured output root. The default output filename is `<name>-minified.md`.

## Current limits

An empty file, missing path, directory without `.md` files, or directory containing only empty Markdown produces an error. Other file formats must be converted to Markdown outside Distill first.

PDF, EPUB, Notion, URL, and GitHub ingestion are planned. Registering them does not make them usable. `--split-by chapter` and chapter patterns are stored in config but not applied by the Markdown ingestor.

## Organize a reference folder

Keep the files you want to compact at one level, in the order you want the final document to follow:

```text
handbook/
  01-conventions.md
  02-error-handling.md
  03-testing.md
  archive/
    old-conventions.md    # Not included: ingestion is not recursive
```

```sh
distill add markdown ./handbook --name handbook --template rules
distill handbook --dry-run
```

The dry run lets you inspect the prepared chunks without calling a provider. Empty Markdown files are skipped. If every file is empty, compaction fails rather than producing an empty result.

Keep related guidance together, but avoid combining unrelated references just to save a command. Separate sources let you choose different templates and update only the material you need.

## Change an existing source

There is no separate source-edit command. Open `distill.yaml` and change the registered entry:

```yaml
sources:
  handbook:
    type: markdown
    path: ./handbook
    template: rules
    output_dir: team
    output_file: handbook.md
```

Then run `distill handbook --dry-run` to verify the new location, followed by `distill handbook` to write the result. Changing the output destination does not remove files from the previous location; review and clean those up separately.
