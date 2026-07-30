// @ts-check
import eslintPluginAstro from "eslint-plugin-astro";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";

// eslint-plugin-astro is ESM-only and requires flat config and ESLint >= 10.
//
// `configs.recommended` resolves to the plugin's astro/* rule set plus its prettier-compat rule. The
// plugin also exposes `flat/jsx-a11y-recommended` and `flat/jsx-a11y-strict`, which
// are NOT wired in here: they require eslint-plugin-jsx-a11y, whose minimatch chain
// carries an unpatchable advisory (see pnpm-workspace.yaml). Accessibility is
// reviewed by hand instead.
export default [
  ...eslintPluginAstro.configs.recommended,
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: tsParser,
    },
    plugins: {
      "@typescript-eslint": tseslint,
    },
    rules: {
      ...tseslint.configs.recommended.rules,
    },
  },
  {
    ignores: ["dist/", ".astro/", "node_modules/", ".local/"],
  },
];
