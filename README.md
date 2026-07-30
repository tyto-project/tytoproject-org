<div align="center">
  <img src="./public/tyto-hex-logo.png" alt="Tyto" width="240" />
  <h1>tytoproject-org</h1>
  <strong>The website for Tyto, published at <a href="https://tytoproject.org">tytoproject.org</a></strong>
</div>

---

## What this is

An Astro static site, and nothing else.

Tyto itself is a Scala execution client for the EVM ecosystem: the native client for Ethereum
Classic, a full node on Ethereum, running several networks from one JVM binary. **None of that
client code lives in this repository.** It is at
[tyto-cli](https://github.com/tyto-project/tyto-cli).

This repo is one of several under the [Tyto project](https://github.com/tyto-project).

## Quick start

Requires Node 24 and pnpm 10, which are what both workflows pin.

```bash
pnpm install --frozen-lockfile
pnpm dev
```

The dev server listens on Astro's default port, 4321.

## Commands

Every script defined in `package.json`. There is no test script and no test framework installed.

| Command             | What it does                                                      |
| ------------------- | ----------------------------------------------------------------- |
| `pnpm dev`          | Dev server with hot reload                                        |
| `pnpm build`        | Type-checks, then builds to `dist/`. A type error fails the build |
| `pnpm preview`      | Serves the built `dist/`                                          |
| `pnpm typecheck`    | `astro check` on its own                                          |
| `pnpm lint`         | ESLint over the repo                                              |
| `pnpm format`       | Prettier, writing in place                                        |
| `pnpm format:check` | Prettier in check mode, which is what CI runs                     |

`pnpm lint && pnpm format:check && pnpm typecheck` is the whole gate available locally, and it is
exactly what CI runs.

## Structure

```
src/
  pages/        Routes. One file per page, plus a generated llms.txt
  layouts/      BaseLayout: head metadata, canonical URL, OG tags, JSON-LD
  components/
    sections/   Page sections
    ui/         Reusable pieces
  data/site.ts  Routes, URLs and org facts. The single source for nav,
                footer, 404 and llms.txt
  content/      JSON collections: networks, stack, hardware
  styles/       global.css, plus tyto/ vendored from tyto-brand
public/         Served at the domain root: favicons, OG image, CNAME,
                robots.txt, logos
```

`dist/` and `.astro/` are build output. Never edit or commit them.

## Deployment

GitHub Pages, on the custom domain set by `public/CNAME`.

- **`deploy-pages.yml`** runs on push to `main` and on manual dispatch. It lints, format-checks and builds before it
  publishes, so a lint or type failure fails the deploy rather than shipping a broken site.
- **`ci.yml`** runs on pull requests into `main`: lint, format check and build.

Because publishing happens on merge, treat `main` as a release branch. Put changes on a topic
branch and open a pull request.

## Brand assets

[tyto-brand](https://github.com/tyto-project/tyto-brand) is upstream for the design language
and the identity assets. Its token CSS is **copied** into `src/styles/tyto/` rather than installed
as a dependency, and the logos and OG image in `public/` are likewise copies.

Do not hand-edit anything under `src/styles/tyto/`. Change it upstream and re-copy, or the next
sync will overwrite the edit.

## Contributing

Fork, branch, and open a pull request against `main`. Small fixes are as welcome as large ones.

Dependency changes are reviewed on their own terms rather than as part of whatever needed them, so
raise them separately and do not edit `package.json` or `pnpm-lock.yaml` in passing.

Agent-facing context lives in [AGENTS.md](AGENTS.md), which is the authority on conventions,
boundaries and code style for this repo.

## Security

This repository is public. Report a suspected vulnerability through
[this repository's private advisory form](https://github.com/tyto-project/tytoproject-org/security/advisories/new),
not the public issue tracker, and hold the details until there is a fix to publish.
Vulnerabilities in the Tyto client itself go to
[tyto-cli](https://github.com/tyto-project/tyto-cli/security/advisories/new).

## License

Apache 2.0. See [LICENSE](LICENSE), with the copyright holders named in [NOTICE](NOTICE).
