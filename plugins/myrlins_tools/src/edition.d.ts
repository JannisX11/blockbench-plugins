/**
 * edition.d.ts - the build flag of the Blockbench store edition (3.4.3, 2026-11-08, forge-visibility-lane, Claude Code Opus 5.5).
 *
 * `npm run build:store` bundles with --define:MYRLIN_STORE_EDITION=true --minify-syntax: every network call and the Model Browser
 * drop out of that file, because the Blockbench plugin repository asks that plugins not depend on outside services and does not
 * take plugins that use generative AI (its README, read 2026-11-08). Every other build (build:core, build:ai, the tests) never
 * defines the name, so each guard reads it as `typeof MYRLIN_STORE_EDITION !== 'undefined' && MYRLIN_STORE_EDITION === true` and those
 * builds behave exactly as before. `=== true`, not truthiness: only the store build's define switches it on (a test sandbox
 * that answers every global name made the full edition look like the store one before 2026-11-09). Test the name directly at each guard: esbuild 0.20 only removes the guarded code when the
 * test is written in place (a constant exported from another module is inlined but its branch is kept).
 */
declare const MYRLIN_STORE_EDITION: boolean;
