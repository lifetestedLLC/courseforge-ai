Suggested commit message:

fix(components): repair components, add ui stubs and smoke-check

Summary:
- Fixed syntax and TypeScript/JSX errors in `src/components/button.tsx`, `src/components/card.tsx` and `src/components/use-toast-impl.tsx`.
- Added minimal UI primitives and re-exports under `src/components/ui/` so existing imports like `@/components/ui/button` resolve.
- Added a simple smoke-check script `scripts/smoke-check.js` and `package.json` script `test:components` to validate component files exist and exports.

How to run locally:
1. npm install
2. npm run lint
3. npx tsc --noEmit
4. npm run build
5. npm run test:components

If the build and tests pass, commit and push the changes:

  git add -A
  git commit -m "fix(components): repair components, add ui stubs and smoke-check"
  git push origin main

Notes:
- I could not run lint/build/test in the environment due to an execution limitation; please run the commands above locally or in CI and report back any failures for me to fix.
