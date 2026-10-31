# SHAREGRID — Make Every Resource Count

SHAREGRID is an institutional resource-sharing application for discovering and requesting access to campus equipment and spaces. It preserves the existing editorial interface and uses Indian institutional sample data with prices in INR.

## Technology

- React 19, TypeScript, Vite 6
- Tailwind CSS 3 and Lucide icons
- Supabase JavaScript client scaffold (`@supabase/supabase-js`)

## Run locally

```bash
npm install
npm run dev
```

Vite serves the app at `http://localhost:3000`. To check the production build:

```bash
npm run build
npm run preview
```

The production files are written to `dist/`.

## Demo mode and persistence

The current application runs in **browser-local demo mode**. Sample borrowers, owners, administrators, resources, and booking history are supplied for demonstration. The UI provides borrower, owner, and administrator role previews. Workflow changes are saved in that browser's `localStorage` under `sharegrid_demo_state_v1`, so they usually survive refreshes in the same browser profile.

Demo data is not sent to Supabase or shared with other users. Demo sign-in does not verify passwords or email addresses; demo registration creates only a local profile. Browser storage can be cleared or unavailable, and it is not suitable for sensitive or production records. The interface displays a demo-mode notice and warns if storage writes fail.

Some dashboard metrics and demand/utilisation outputs are explicitly estimates calculated from the sample bookings. They are not trained AI predictions, payment records, cryptographic audit records, or evidence of real institutional certification.

## Supabase configuration status

`src/lib/supabase.ts` can initialize a browser client when given an HTTPS project URL and a publishable key (or legacy anon JWT). It rejects secret/service-role keys. Use `.env.example` as a template:

```dotenv
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-supabase-publishable-key
```

Copy it to `.env` and replace the placeholders locally. Never put a Supabase `service_role` or `sb_secret` key in a `VITE_*` variable: Vite exposes those variables to browser bundles.

**Important:** supplying configuration does not activate database workflows. Authentication and the current booking/resource workflows still use the local demo state; a successful REST connectivity check alone would not make these workflows cloud-backed. Do not treat the demo role switcher or client-side guards as production authorization. Before using Supabase, implement and test the database integration and server-enforced RLS policies. `supabase/sharegrid_setup.sql` has not been executed or validated against a live database; review and test it separately before any deployment.

## Public deployment preparation

1. Run `npm run build` and inspect the generated `dist/` output.
2. Deploy `dist/` to a static host such as Vercel, Netlify, or Cloudflare Pages; configure the build command as `npm run build` and output directory as `dist`.
3. Keep the application in demo mode unless the Supabase authentication, schema, RLS policies, and every workflow have been integrated and tested.
4. If browser-safe Supabase configuration is eventually needed, set only the project URL and publishable/anon key as deployment environment variables. Do not add secrets to the frontend.
5. Configure a custom domain and HTTPS, then test responsive layouts and all intended workflows in the deployed environment.

No Supabase SQL has been run and no live database has been modified as part of this project work.
