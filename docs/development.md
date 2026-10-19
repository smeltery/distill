# Development

Use Flox to get the same Go, Bun, Node, lint, release, and hook tools locally and in CI.

## Set up

```sh
git clone https://github.com/smeltery/distill.git
cd distill
flox activate
make setup
```

Flox locks the base packages for macOS and Linux. `GOTOOLCHAIN=go1.26.9` pins the security-patched Go toolchain; Go downloads and verifies it on first use because the catalog currently ships an older bootstrap version.

`make setup` installs frozen Bun dependencies, Chromium for documentation and browser checks, and pre-commit hooks. Flox activation does not modify your Git hooks or install JavaScript dependencies automatically.

## Daily commands

```sh
make build
make test
make check
make website
```

`make website` generates the documentation diagrams and starts the website at `http://localhost:3006`. Alternatively, start the managed preview with `flox services start website`. For a production preview use `bun run build:web` followed by `bun run --cwd website start`.

## Documentation and website

Edit the topic files in `docs/`. The website renders these same Markdown files; there is no second copy to maintain. Add pages to `website/src/lib/catalog.ts`. Mermaid diagrams are parsed and rendered to SVG during `bun run check:docs`, so visitors do not download Mermaid's JavaScript.

Keep the original Distill slate, purple, and cream palette in the shared CSS tokens. Logo and social image sources live in `website/public/`. The social image is exported to PNG for preview compatibility.

## Checks and hooks

CI and pre-commit both call the Makefile targets for Go formatting, vet, lint, race tests, the existing 80% coverage floor, Markdown lint, formatting, link/diagram validation, source budgets, TypeScript, and a production build. Browser journeys, accessibility checks, mobile overflow, and link crawling run against that production build.

Release automation tests use temporary local repositories to check version increments, dispatch retries, and refusal to release stale CI revisions.

The default limit is 350 lines per source/documentation file and 25 direct files per directory. `scripts/budgets.json` records reviewed exceptions for historical design documents. Generated files, lockfiles, and assets are excluded. Split cohesive responsibilities instead of compressing code to fit.

## Releases

After successful CI on the default branch, the auto-release workflow tags the verified commit with the next patch version and explicitly dispatches the release workflow. Release jobs run the same checks before GoReleaser publishes macOS and Linux archives with checksums. Pull requests never cut releases.

A manual release accepts an existing version tag. The workflow verifies the tag format, and GoReleaser requires a clean tagged checkout. GitHub's workflow token supplies repository release permissions; no personal token is required.
