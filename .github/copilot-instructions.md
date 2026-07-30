<!--
  SELF-CONTAINED BY CHOICE. Do not thin this into a pointer at AGENTS.md.

  This repository is public, so its github.com surfaces are in play for anyone
  browsing it, and github.com Chat reads this file but does NOT read AGENTS.md.
  The same holds for VS Code code review, Visual Studio Chat and code review, and
  Eclipse and Xcode Chat. On those surfaces this file is the only instruction the
  model sees, so a thin delta pointing elsewhere would leave it with nothing.
  Eclipse code review reads no custom instructions of any kind, so nothing written
  here reaches it. JetBrains is deliberately not listed among the surfaces that
  ignore AGENTS.md: the support matrix says its Chat surface takes no agent
  instructions, but GitHub's own changelog announced AGENTS.md and CLAUDE.md
  support in JetBrains IDEs as generally available, and the matrix has not caught
  up. That row does not change the decision either way.

  The cost is duplication with AGENTS.md, paid deliberately: when either file
  changes, change both. They must not contradict each other.

  Support differs per surface and changes often. Re-check before assuming:
  https://docs.github.com/en/copilot/reference/custom-instructions-support
-->

# tytoproject-org: Copilot Instructions

## This is not the Astro you know

This repo is on a recent Astro major. APIs, conventions and file structure may all differ from your
training data. Read https://docs.astro.build before writing any code, and heed deprecation notices.

The source for **tytoproject.org**, the public website for Tyto. Tyto itself is a Scala execution
client for the EVM ecosystem, and **none of that client code lives here**. This repo is an Astro
static site and nothing else.

It is one of several `tyto-project` repos. `tyto-brand` produces the identity assets, and its
token CSS is copied into `src/styles/tyto/` rather than installed.

## Stack

- **Astro 7**, `output: "static"`. No server rendering, no adapter, no containerized runtime.
- **`@astrojs/sitemap`** integration.
- **No Tailwind, no CSS framework.** Component styling is Astro scoped `<style>` blocks over the
  vendored token layer.
- **Styling is vendored, not installed.** `src/styles/tyto/` is a copy of `tyto-brand`'s token
  CSS and web reference. Do not hand-edit it; re-copy from upstream instead.
- **TypeScript 6**, `extends: astro/tsconfigs/strict`, path alias `@/*` to `src/*`.
- **ESLint 10** flat config with `eslint-plugin-astro` and `@typescript-eslint`.
  `eslint-plugin-jsx-a11y` is deliberately absent: it is an optional peer blocked by an unpatched
  advisory, kept out by `autoInstallPeers: false` in `pnpm-workspace.yaml`. Accessibility is
  reviewed by hand. Do not "fix" it by installing the plugin.
- **`@astrojs/check`**, which is what `astro check` runs.
- **Self-hosted fonts** via `@fontsource/dm-sans` and `@fontsource/jetbrains-mono`, imported in
  `src/layouts/BaseLayout.astro`.
- **pnpm**, lockfile version 9.0. Both workflows pin pnpm 10 and Node 24. `package.json` has no
  `packageManager` field.
- **No client framework runtime.** No React, Vue, Svelte, Solid or Preact is installed, and none
  should be added.

## Commands

These are every script `package.json` defines. Nothing else exists.

```bash
pnpm install --frozen-lockfile   # what both workflows run
pnpm dev                         # astro dev, Astro's default port 4321
pnpm build                       # astro check && astro build, output to dist/
pnpm preview                     # astro preview, serves the built dist/
pnpm typecheck                   # astro check
pnpm lint                        # eslint .
pnpm format                      # prettier --write .
pnpm format:check                # prettier --check ., which is what CI runs
```

**There is no `test` script and no test framework is installed.** Do not suggest `pnpm test`, do not
generate a test file expecting a runner to pick it up, and never report that tests pass.
`pnpm lint && pnpm format:check && pnpm typecheck` is the whole local gate, and it is exactly what
CI runs. `pnpm build` runs `astro check` first, so a
type error fails the build.

## Structure

The directory listing is authoritative. What follows says what each directory is **for**, not what
it currently holds, so that it stays true as pages are added.

```
src/pages/               One .astro file per route, plus llms.txt.ts which
                         generates /llms.txt at build time. 404.astro is the
                         only route that is not indexable
src/layouts/             BaseLayout.astro: head metadata, canonical URL, OG tags,
                         the JSON-LD blocks, font imports, theme-init script
src/components/sections/ Page sections, each belonging to one page or a few
src/components/ui/       Pieces reused across pages: tables, grids, heroes,
                         the fade-in wrapper, the theme toggle
src/data/site.ts         ROUTES plus URL and organization constants. The single
                         source for nav, footer, 404 and llms.txt
src/content/             JSON collections, with their schemas in
                         src/content.config.ts
src/styles/global.css    imports styles/tyto/, plus the few site-only rules
src/styles/tyto/       vendored from tyto-brand -- do not hand-edit
public/                  served at the domain root: favicons, OG image, CNAME,
                         robots.txt, logos
```

**`/llms.txt` is generated, not a file in `public/`.** `src/pages/llms.txt.ts` builds it from the
same collections and `ROUTES` the pages render, so it cannot drift from the site. Never add a static
copy to `public/`.

**A new route goes in `ROUTES` in `src/data/site.ts`.** Nav, footer, 404 and the llms.txt route list
all derive from it, so a page without a `ROUTES` entry is unreachable from every one of them.

`dist/`, `.astro/` and `node_modules/` are generated. Never edit or commit them.

## Code style

Match what is already there. These describe the existing code, not an aspiration.

- **Styling is the vendored brand classes plus a scoped `<style>` block per component.** Zero
  inline `style` attributes, no CSS framework.

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
- **Interactivity is a small vanilla-JS `<script>` scoped to its own `.astro` component.** Only
  `HexCanvas` (canvas animation), `ThemeToggle`, `NavHeader` (mobile nav) and `QuickStartSection`
  (install tabs) carry one. `BaseLayout` additionally has an `is:inline` theme-initialization script
  and the `application/ld+json` blocks.
- **Plain `<img>` for images.** `astro:assets` and `<Image />` are not used anywhere in `src/`.
- **No live or dynamic data fetching.** Fully static: no ISR, no client-side polling, no runtime API
  calls.
- **No em dashes in generated copy or comments.** Use commas, colons, semicolons or periods.

## Deployment

GitHub Pages at the custom domain **tytoproject.org**, set by `public/CNAME`. `astro.config.mjs` sets
`site: "https://tytoproject.org"` and deploys at the domain root, so there is no `base` path.

- `.github/workflows/deploy-pages.yml` runs on push to `main` and on `workflow_dispatch`. It lints, format-checks
  and builds before deploying, so a failure fails the deploy rather than publishing a broken site.
- `.github/workflows/ci.yml` runs on `pull_request` into `main`. Lint, format check and build.

Because a push to `main` publishes, treat `main` as a release branch: put changes on a `feat/`,
`fix/` or `refactor/` topic branch and open a PR. **Pushing is a separate decision from committing.
Never push unasked.**

## Security

This repository is public. Everything not ignored is world-readable once pushed.

- `.gitignore` is the gate. Verify by effect with `git check-ignore --no-index -q <path>`, never by
  reading the patterns, and never with `-v` as the condition: it exits 0 on a negation match too.
- `.claude/` and `.local/` are ignored and never committed. `CLAUDE.md` **is** committed: it is a
  one-line `@AGENTS.md` import carrying no content of its own. Do not add it to `.gitignore`.
- A project `.npmrc` is ignored, because that is where a registry auth token lives.
- Never commit an `.env`, a key, or a credential file of any kind.
- Report a suspected vulnerability through this repository's private advisory form, not the public
  issue tracker.

## Before reporting a task complete

Run `pnpm lint && pnpm format:check && pnpm typecheck`. CI runs `format:check` and so does the deploy
workflow, so skipping it fails a deploy rather than a check. There is no test suite to run.

## Protected files

Do not modify these without an explicit instruction.

- `package.json`, `pnpm-lock.yaml`. Adding, removing or bumping **any** dependency is gated on a
  separate release-age and deprecation review and never lands as a side effect of other work.
- `src/styles/tyto/`. A copy of `tyto-brand`; edits are lost on the next sync.
- `src/styles/global.css`. The style entry point.
- `src/layouts/BaseLayout.astro`. Metadata, canonical URL, OG tags and JSON-LD are SEO-load-bearing
  on a live production domain.
- `astro.config.mjs` `site` and `output`, and `public/CNAME`. All three would break the deploy.
- `LICENSE` and `NOTICE`. This repo is Apache-2.0 and the copyright holders are named in `NOTICE`.
  Licensing is a legal decision, never a technical one.

## Never

- Reintroduce a client framework runtime, or server-rendered or containerized infrastructure
  (Docker, Vercel, Terraform). This site is static-only.
- Redeclare a design token locally to work around the design system.
- Commit an `.env`, a key, a credential file, or anything under `.claude/` or `.local/`. This
  repository is public: everything not ignored is world-readable the moment it is pushed.
- Stage with `git add .` or `git add -A`. Stage specific files.
