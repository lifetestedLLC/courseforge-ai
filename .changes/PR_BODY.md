Title: fix(components): repair components, add shadcn-style UI primitives, and add unit tests

Summary:
- Fixed syntax and TypeScript/JSX errors in `src/components/button.tsx`, `src/components/card.tsx`, and `src/components/use-toast-impl.tsx`.
- Replaced minimal UI stubs with shadcn-style components under `src/components/ui/` (Button, Input, Label, Checkbox, Slider, Select, Progress, Badge) and added `cn` utility.
- Added unit testing infra (Vitest) and unit tests for `Button`, `Card`, `Select`, `Checkbox`, and `useToast` (UI + hook).
- Added CI workflow step to run unit tests and a smoke-check script for components.

Notes for reviewers:
- Tests are lightweight smoke/unit tests to prevent regressions; please run `npm ci` and `npm run test:ci` locally or let CI run on the branch.
- I could not run `npm ci` or `npm test` in this environment; please run the test suite and share failures if any.
