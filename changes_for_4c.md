### A4c migration notes (frontend)

- The backend migrated logic from `backend/concepts/*` services into `backend/src/concepts/*` classes to align with the Requesting + syncs architecture.
- Frontend API routes remain the same; no changes required here unless backend endpoints change or passthrough exclusions are updated.

Completed changes:
- No frontend code changes yet.

Latest updates:
- Auth UI:
  - Added `src/views/Login.vue`, persisted session in `src/stores/session.ts`, and added Sign in/Sign out in `src/components/TopNav.vue`.
- Search:
  - Top search resolves titles via backend `/api/PaperIndex/searchArxiv` and navigates to the arXiv id; paper page also resolves non-id queries and shows a helpful banner on no-match.
- Removed Explore:
  - Deleted `src/views/Explore.vue` and its route/link.
- Discussion UX:
  - `DiscussionPanel.vue`: changed “Body” to “Topic”, added inline “Reply” link per thread, removed optimistic inserts (reloads from backend to avoid duplicates).
- “My Papers” per-user:
  - Library stored under `localStorage` key `library:<userId>`; switching accounts switches saved papers. Updated `PaperPage.vue` and `MyPapers.vue`.

Next steps:
- Re-run app (`deno task import` in backend, then `deno task start`) and click through flows to ensure endpoints still work.
- If any routes move behind Requesting-only (not passthrough), adjust API calls accordingly.


