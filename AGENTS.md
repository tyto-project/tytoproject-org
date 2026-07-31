<!-- BEGIN:astro-agent-rules -->

# This is NOT the Astro you know

This version has breaking changes: APIs, conventions, and file structure may all differ from your training data. Read https://docs.astro.build before writing any code. Heed deprecation notices.
<!-- END:astro-agent-rules -->

<!--
  The block above is machine-generated. Keep project content BELOW it and leave the
  block itself byte-for-byte alone.

  Nothing this repo runs rewrites it. No `astro` package version checked contains a
  reference to `AGENTS.md`, and nothing under node_modules contains the string
  `astro-agent-rules`, so `astro dev`, `astro build`, `astro check`, `astro sync`
  and `astro add` all leave this file alone.

  The only Astro-org tool that ever writes AGENTS.md is the project scaffolder. It
  runs at project creation, is gated behind its AI flag, and writes the WHOLE file
  in one `writeFileSync` rather than patching between the markers. So the markers
  are not a merge protocol that anything honors: if the scaffolder is ever re-run
  in this directory, everything here goes, markers included. Copy this file out
  first. The scaffolder does not emit these markers.
-->

# tytoproject-org

The source for **tytoproject.org**, the public website for Tyto. Tyto itself is a Scala execution
client for the EVM ecosystem, and **none of that client code lives here**. This repo is an Astro
static site and nothing else.

**`tyto-brand` is upstream for both the design language and the identity assets.** Its token CSS
and web reference are COPIED into `src/styles/tyto/`, not installed: each Tyto surface uses a
different styling mechanism, so only token values and design intent travel between them. Brand
assets in `public/` are likewise copies.

## Stack

Read from `package.json`, `pnpm-lock.yaml`, `pnpm-workspace.yaml`, `astro.config.mjs`,
`tsconfig.json` and `eslint.config.mjs`. Major series only, because patch numbers here go stale
within days.

| Layer           | What                                                                            | Where it is declared                       |
| --------------- | ------------------------------------------------------------------------------- | ------------------------------------------ |
| Framework       | Astro 7, `output: "static"`                                                     | `astro.config.mjs`                         |
| Integration     | `@astrojs/sitemap`                                                              | `astro.config.mjs` `integrations`          |
| Format          | Prettier with `prettier-plugin-astro` (the official Astro plugin)               | `.prettierrc.json`                         |
| Styling         | Vendored from `tyto-brand` into `src/styles/tyto/`, not a dependency        | imported by `src/styles/global.css`        |
| Language        | TypeScript 6, `extends: astro/tsconfigs/strict`, path alias `@/*` to `src/*`    | `tsconfig.json`                            |
| Type check      | `@astrojs/check`, which is what `astro check` runs                              | `package.json` devDependencies             |
| Lint            | ESLint 10 flat config, `eslint-plugin-astro` plus `@typescript-eslint`          | `eslint.config.mjs`                        |
| pnpm settings   | `autoInstallPeers: false`, which is a security decision, not a preference       | `pnpm-workspace.yaml`                      |
| Fonts           | `@fontsource/dm-sans` and `@fontsource/jetbrains-mono`, self-hosted             | imported in `src/layouts/BaseLayout.astro` |
| Package manager | pnpm, lockfile `lockfileVersion: '9.0'`; both workflows pin pnpm 10 and Node 24 | `.github/workflows/*.yml`                  |

**There is no client framework runtime.** No React, Vue, Svelte, Solid or Preact appears anywhere
in the manifest, and none should be added.

`package.json` has **no `packageManager` field**. Do not add one without asking; the pnpm major is
fixed by the workflows, not by the manifest.

## Commands

Copied verbatim from `package.json` `scripts`. Nothing else is defined.

```bash
pnpm install --frozen-lockfile   # what both workflows run
pnpm dev                         # astro dev, serves on Astro's default port 4321
pnpm build                       # astro check && astro build, output to dist/
pnpm preview                     # astro preview, serves the built dist/
pnpm typecheck                   # astro check
pnpm lint                        # eslint .
pnpm format                      # prettier --write .
pnpm format:check                # prettier --check ., which is what CI runs
```

**There is no `test` script, and no test framework is installed.** Do not invent a call to one, and
do not report "tests pass". `pnpm lint && pnpm format:check && pnpm typecheck` is the whole gate
available locally, and it is
exactly what CI runs. `pnpm build` runs `astro check` before it builds, so a type error fails the
build.

## Structure

The directory listing is authoritative. What follows says what each directory is **for**, not what
it holds at any given
moment, so that it stays true as pages are added.

```
src/
  pages/               One .astro file per route, plus llms.txt.ts which
                       generates /llms.txt at build time. 404.astro is the
                       only route that is not indexable
  layouts/             BaseLayout.astro: head metadata, canonical URL, OG tags,
                       the JSON-LD blocks, font imports, theme-init script
  components/
    sections/          Page sections, each belonging to one page or a few
    ui/                Pieces reused across pages: tables, grids, heroes,
                       the fade-in wrapper, the theme toggle
  data/site.ts         ROUTES plus the URL and organization constants. The
                       single source for nav, footer, 404 and llms.txt
  content/             JSON collections, with their schemas in
                       src/content.config.ts
  styles/global.css    imports styles/tyto/, plus the few site-only rules
  styles/tyto/       vendored from tyto-brand, do not hand-edit
public/                served at the domain root: favicons, OG image, CNAME,
                       robots.txt, logos
```

**`/llms.txt` is generated, not a file in `public/`.** It is built by `src/pages/llms.txt.ts` from
the same collections and `ROUTES` the pages render, so chain IDs, node requirements and the route
list cannot drift from the site. Edit the prose there; never add a static copy to `public/`.

**A new route goes in `ROUTES` in `src/data/site.ts`.** The nav, the footer, the 404 and the
`llms.txt` route list all derive from it. Adding a page without a `ROUTES` entry leaves it
unreachable from every one of them.

`dist/` and `.astro/` are build output. Never edit them and never commit them.

## Code style

Match what is there. These are descriptions of the existing code, not aspirations.

- **Styling is the vendored brand classes plus a scoped `<style>` block per component.** There are
  zero
  inline `style` attributes and no CSS framework; reach for a token, not a literal value.

  ```astro
  <style>
    /* correct: role tokens */
    .card {
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: var(--radius-md);
    }

    /* wrong: hardcoded literals */
    .card {
      background: #1a1f16;
      border-radius: 8px;
    }
  </style>
  ```

- **Never hardcode a hex color.** Every color, radius and spacing value is a CSS custom property.
  The palette and role tokens live in `src/styles/tyto/tokens/`, vendored from `tyto-brand`.
  Never redeclare one locally to work around it.
- **Interactivity is a small vanilla-JS `<script>` scoped to its own `.astro` component.** The only
  components carrying one are `HexCanvas` (canvas animation), `ThemeToggle`, `NavHeader` (mobile
  nav) and `QuickStartSection` (install tabs). `BaseLayout` additionally carries an `is:inline`
  theme-initialization script and the `application/ld+json` blocks.
- **Plain `<img>` for images.** `astro:assets` and `<Image />` are not used anywhere in `src/`.
- **No live or dynamic data fetching.** The site is fully static; there is no ISR, no client-side
  polling and no runtime API call.
- **No em dashes anywhere in this repo**, with one exception: `LICENSE` and `NOTICE` are legal
  text and are never edited for style. Use commas, colons, semicolons or periods. En dashes in
  the copyright year ranges are correct and stay. This holds for
  site copy, comments, `README.md` and the generated `/llms.txt` alike.

## Deployment

GitHub Pages, custom domain **tytoproject.org**, set by `public/CNAME`. `astro.config.mjs` sets
`site: "https://tytoproject.org"` and deploys at the domain root, so there is no `base` path.

- `.github/workflows/deploy-pages.yml`: on push to `main` and on `workflow_dispatch`. Lints and
  format-checks and builds first, then uploads and deploys. A failure fails the deploy rather than
  publishing a broken site.
- `.github/workflows/ci.yml`: on `pull_request` into `main`. Lint, format check and build.

## Branching

Work lands **directly on `main`**, matching the sibling `tyto-project` repos. Use a topic branch
(`feat/`, `fix/` or `refactor/` plus a kebab-case description) when a change wants isolation or
review, but a fast-forward onto `main` is the normal path and no PR is required.

**Know what that costs.** `ci.yml` runs only on `pull_request`, so a commit pushed straight to
`main` never passes it. What does gate a direct push is `deploy-pages.yml`, which runs lint,
format-check and build before publishing, so a failure fails the deploy rather than shipping a
broken site. That is the whole of the check on this path: there is no test suite, and nothing
reviews the copy.

**Pushing is a separate decision from committing. Never push unasked**, on any branch.

## Security

This repository is **public**. Everything not ignored is world-readable the moment it is pushed.

- `.gitignore` is the gate. Verify it by effect with `git check-ignore --no-index -q <path>`, never
  by reading the patterns, and never with `-v` as the condition (it exits 0 on a negation match).
- `.claude/` is **tracked**, so repo-local agents, skills and rules travel with the repo. Only
  machine-local and agent-written state is held back, named line by line in `.gitignore`. `.local/`
  is ignored and never committed. `CLAUDE.md` **is** committed: it is a one-line `@AGENTS.md` import
  carrying no content of its own.
- A project `.npmrc` is ignored, because that is where a registry auth token lives.
- Never commit an `.env`, a key, or a credential file of any kind.

## Boundaries

**Always**

- Run `pnpm lint && pnpm format:check && pnpm typecheck` before reporting a task complete. CI runs
  `format:check`, and the deploy workflow does too, so skipping it fails a deploy rather than a
  check. There is no test suite to run.
- Stage specific files. Never `git add .` or `git add -A`.

**Ask first**

- Installing `eslint-plugin-jsx-a11y`. It is an optional peer blocked by an unpatched advisory
  and is kept out by `autoInstallPeers: false` in `pnpm-workspace.yaml`. Accessibility is
  reviewed by hand. Do not "fix" its absence.
- Adding, removing or bumping **any** dependency, including a transitive bump. Dependency changes
  are gated on a release-age and deprecation review and never land as a side effect of other work.
  Do not edit `package.json` or `pnpm-lock.yaml` in passing.
- Changing anything under `src/styles/tyto/`. It is a copy of `tyto-brand`; edits there are lost
  on the next sync. Change it upstream and re-copy.
- Changing `src/styles/global.css`, the style entry point.
- Changing `astro.config.mjs` `site` or `output`, which would break the GitHub Pages deploy.
- Changing `public/CNAME`, which is the live custom domain.
- Changing `src/layouts/BaseLayout.astro` metadata, canonical URL, OG tags or JSON-LD. These are
  SEO-load-bearing on a production domain.

**Never**

- Reintroduce a client framework runtime, or server-rendered or containerized infrastructure
  for **this site** (Docker, Vercel, Terraform). It is static-only and deploys as static files.
  Docker instructions for running the Tyto client are site copy and are expected.
- Edit or commit `dist/`, `.astro/` or `node_modules/`.
- Add, change or remove `LICENSE` or `NOTICE`. This repo is Apache-2.0 and the copyright holders
  are named in `NOTICE`. Licensing is a legal decision, never a technical one.
- Redeclare a design token locally to work around the design system.
