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
    files: ["app/**/*.{ts,tsx}", "components/**/*.{ts,tsx}", "lib/domain/**/*.ts", "lib/mock/**/*.ts"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@supabase/*", "**/lib/mock/*"],
              message:
                "Database clients and mock data belong in lib/data/ only. Import a lib/data/ function instead.",
            },
          ],
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
              group: ["next/*", "react", "@/lib/data/*", "@/lib/mock/*", "@supabase/*"],
              message:
                "lib/domain/ must stay pure — types and rules only, no framework and no I/O.",
            },
          ],
        },
      ],
    },
  },
];

export default config;
