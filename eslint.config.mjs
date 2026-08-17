import next from "eslint-config-next/core-web-vitals";

const config = [
  ...next,
  {
    ignores: [".next/**", "node_modules/**", "docs/**", "design/**", "screenshots/**"],
  },
  {
    // Vendored shadcn/ui and its hooks — upstream code we do not edit. Next 16's
    // react-hooks rules flag patterns that ship in the library itself, so they
    // are scoped off here rather than being patched into a fork we have to
    // maintain. Restyle these through tokens in app/globals.css, not by editing.
    files: ["components/ui/**/*.tsx", "hooks/**/*.ts"],
    rules: {
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/purity": "off",
    },
  },
  {
    // THE MIGRATION RULE.
    //
    // Everything database-specific stays behind lib/data/. Supabase is Postgres,
    // so schema and queries port to SQL Server — but Supabase Auth, RLS, Storage
    // and the supabase-js client do not. Keeping them in one folder is the
    // difference between rewriting a layer and rewriting the app.
    //
    // See docs/06-migration-plan.md §6.
    files: [
      "app/**/*.{ts,tsx}",
      "components/**/*.{ts,tsx}",
      "lib/domain/**/*.ts",
      "lib/i18n/**/*.ts",
      "lib/mock/**/*.ts",
    ],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@supabase/*", "@/lib/mock", "@/lib/mock/*"],
              message:
                "Database clients and mock data belong in lib/data/ only. Import a lib/data/ function instead.",
            },
          ],
        },
      ],
    },
  },
  {
    // THE DRIFT RULE.
    //
    // The design system only holds if it is cheaper to use than to bypass. It
    // was not: `Button` was used 13 times and hand-rolled 27, badges existed as
    // ten copies of the same class string, and seven tables repeated the same
    // <thead> markup. Duplicated Tailwind is also what makes NFU-002/NFU-004 —
    // "another supplier can take this over" — ring hollow to a technical
    // evaluator reading the handed-over source.
    //
    // So a screen may not build its own. Import from components/miis/.
    files: ["app/**/*.tsx"],
    rules: {
      "no-restricted-syntax": [
        "error",
        {
          selector: "JSXOpeningElement[name.name='button']",
          message:
            "Use <Button> from components/miis/primitives. Variants: primary, secondary, ghost, danger.",
        },
        {
          selector: "JSXOpeningElement[name.name='table']",
          message:
            "Use <DataTable> from components/miis/DataTable — it carries the sticky header, sorting and the overflow guard.",
        },
      ],
    },
  },
  {
    // lib/domain/ is pure: types and rules, no I/O, no framework.
    files: ["lib/domain/**/*.ts"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["next/*", "react", "@/lib/data/*", "@/lib/i18n", "@/lib/i18n/*", "@/lib/mock/*", "@supabase/*"],
              message:
                "lib/domain/ must stay pure — types and rules only, no framework, no I/O and no interface copy.",
            },
          ],
        },
      ],
    },
  },
  {
    // lib/i18n/ is interface copy and nothing else. It may name a domain type
    // (Lang, DocumentType) so the dictionary stays in step with the model, but
    // it must not reach a framework or the data layer — otherwise a translation
    // becomes a place where behaviour can hide.
    files: ["lib/i18n/**/*.ts"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["next/*", "react", "@/lib/data/*", "@/lib/mock/*", "@supabase/*"],
              message: "lib/i18n/ holds interface copy only — no framework and no I/O.",
            },
          ],
        },
      ],
    },
  },
];

export default config;
