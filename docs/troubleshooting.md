# Troubleshooting

Start with `distill agents`, `distill list`, and a dry run of one source.

## Source not found

Run from the directory containing `distill.yaml`. Check the registered name with `distill list`. Relative source paths resolve from your current working directory.

## Ingestor not yet implemented

Use a local Markdown file or directory. PDF, EPUB, Notion, URL, and GitHub ingestion are not implemented. Convert or export your source to Markdown first.

## Agent cannot run

Confirm the configured CLI is on PATH and authenticated, or set the API key variable named in the agent configuration. Check the model identifier with your provider. A successful availability check does not guarantee an API request will succeed.

## Output is too large or incomplete

Use a smaller source, a more specific template, or a different `--token-budget`. The budget is advisory and applies per chunk. Review the source against the result. Compaction is lossy and no automatic correctness check is implemented.

## Repeated or partial updates

Unchanged inputs are still processed. For batch operations, check every logged error: `update` continues after a source failure. Re-run individual sources to obtain meaningful failure exit codes.

## Sharing fails

Check repository access with Git. If a target directory already contains a repository, inspect its remote and local changes before running `install` again. Commit or resolve conflicts yourself; Distill does not discard local work.

## Report an issue

Include the Distill version, operating system, command, and a minimal sanitized config in a [GitHub issue](https://github.com/smeltery/distill/issues). Remove API keys, private documents, and provider output that should not be public.
