# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

"Observatorio Tecnológico CETEC" — a Spanish-language scientific/technology blog built with **Next.js 14 (App Router)** and **Sanity v3** as the headless CMS. The site covers news, regulations, training, grants, events, technical documents, a glossary, and a technology marketplace ("MarketTech") for the plastics and footwear sectors.

## Commands

```bash
npm run dev      # Start dev server (localhost:3000)
npm run build    # Production build
npm run start    # Serve production build
npm run lint     # ESLint (next/core-web-vitals + next/typescript)
```

No test framework is configured. Use `npm run lint` for code quality checks.

## Environment

Copy `.env.local.example` to `.env.local` and fill in:
- `NEXT_PUBLIC_SANITY_PROJECT_ID`
- `NEXT_PUBLIC_SANITY_DATASET` (default: `production`)
- `NEXT_PUBLIC_SANITY_API_VERSION` (default: `2024-01-01`)
- `SANITY_API_WRITE_TOKEN` — required for admin panel write operations
- `ADMIN_PASSWORD` — credential for `/admin/login`
- `SESSION_SECRET` — HMAC key that signs admin session cookies (generate with `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`). Rotating this invalidates all active admin sessions.
- `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` / `RECAPTCHA_SECRET_KEY` — reCAPTCHA v2 credentials for public forms
- `RECAPTCHA_DISABLED=1` — dev-only escape hatch; ignored in production builds

## Architecture

### Three route groups

1. **`app/(site)/`** — Public pages with shared Header + Footer layout.
   - Section listing pages: `noticias/`, `normativa/`, `formacion/`, `ayudas/`, `agenda/`, `documentos/`, `glosario/`, `markettech/`, `markettech/soluciones/` (filtered listing), `contacto/`, `busqueda/` (global search with alert modal), `privacidad/`
   - `[category]/[slug]/page.tsx` — Dynamic article detail (uses `generateStaticParams` + ISR at 60s, `dynamicParams = true`)
   - `markettech/[slug]/page.tsx` — MarketTech solution detail
2. **`app/admin/`** — Custom admin panel (separate layout with `components/AdminNav.tsx`, no site Header/Footer). Sub-sections: `entradas` (posts), `documentos`, `agenda`, `soluciones` (MarketTech), `glosario`, `suscripciones` (read-only list + CSV export), plus `login`. Each content type has its own API backend under `app/api/admin/`.
3. **`app/studio/[[...index]]/`** — Sanity Studio embedded as a client-side SPA at `/studio` with its own layout.

### Two Sanity clients

- **`lib/sanity.ts`** — Read-only client (uses CDN in production). Contains all TypeScript interfaces (`Post`, `Category`, `AgendaEvent`, `Document`, `GlossaryTerm`), the `urlFor()` image helper, and all GROQ query functions. Every public page fetches data through this file.
- **`lib/sanity-admin.ts`** — Write client with `SANITY_API_WRITE_TOKEN`. Used only by API routes under `app/api/admin/`. Also exports content taxonomy constants (`SECCIONES`, `TEMATICAS`, `SECTORES`, `TIPOS_DOCUMENTO`) and helpers for Portable Text conversion.

### API routes

Admin (`app/api/admin/`) — all gated by `checkAuth` (signed session cookie), use the write client:
- `auth/` — `POST` login / `DELETE` logout / `GET` session check (uses `ADMIN_PASSWORD` + `SESSION_SECRET`)
- `posts/` + `posts/[id]/` — CRUD for posts
- `documents/`, `events/`, `glossary/`, `soluciones/`, `subscriptions/` — CRUD / listing for their respective content types
- `upload/` — Image upload to Sanity

Public (`app/api/`):
- `soluciones/` (GET) — MarketTech solutions, consumed by the client-side filtering UI
- `contact/` (POST) — Writes a `contactMessage` doc; enforces reCAPTCHA + field-length limits
- `subscriptions/` (POST) — Writes a `subscription` doc (newsletter or search alert); reCAPTCHA + dedupe by `email + tipo`

### Admin auth

`lib/admin-auth.ts` owns the session layer:
- `POST /api/admin/auth` compares `ADMIN_PASSWORD` in constant time (`timingSafeEqual`) and sets an HMAC-SHA256-signed cookie (24h expiry). The cookie payload contains only an expiry timestamp — never the password.
- `checkAuth()` is imported by every admin API route to verify the cookie before touching the write client.
- Rotating `SESSION_SECRET` invalidates every active session instantly.

### reCAPTCHA

`lib/recaptcha.ts` provides a server-side `verifyRecaptcha()` used by `/api/contact` and `/api/subscriptions`. It is **fail-closed**: a missing/invalid `RECAPTCHA_SECRET_KEY` causes the endpoints to reject the request. In dev, `RECAPTCHA_DISABLED=1` bypasses verification (ignored when `NODE_ENV=production`). The `components/RecaptchaWidget.tsx` wrapper renders the v2 "I'm not a robot" widget on the client.

### Content taxonomy

Posts are organized by three independent axes (defined as string enums in both the Sanity schema and `sanity-admin.ts`):
- **Sección** (required): `noticias`, `normativa`, `formacion`, `ayudas`, `agenda`, `markettech` — determines which listing page displays the post
- **Temática**: `materiales`, `procesos`, `digitalizacion`, `reciclado`, `ecodiseno`
- **Sector**: `plastico`, `calzado`, `agroalimentario`

The `category` reference field on posts is marked `hidden: true` (legacy). The `seccion` string field is the primary organizer.

### Sanity schemas (`sanity/schemas/`)

Content types: `post`, `category`, `author`, `agenda`, `document`, `glossary`, `solucion`, `subscription`, `contactMessage`, `blockContent`. Registered in `schemas/index.ts`.

`solucion` (MarketTech tech solutions) has its own taxonomy distinct from posts: `tecnologia` (tecnologías-verdes/digitales, nanotecnología, fabricación-avanzada, materiales-avanzados), `sector` (plástico/calzado), `reto`, `material`. Detail pages live at `app/(site)/markettech/[slug]/`; filtered listing at `app/(site)/markettech/soluciones/`.

`subscription` stores both newsletter signups (from the homepage form) and filtered search alerts (from `AlertModal` on `/busqueda`). `contactMessage` stores submissions from `/contacto`. Both are created only via the public POST endpoints and read-only in the admin UI (`/admin/suscripciones` offers CSV export).

### Key patterns

- **ISR everywhere**: All data-fetching functions pass `{ next: { revalidate: 60 } }` to `client.fetch()`, and pages export `revalidate = 60`.
- **Demo fallback**: The homepage falls back to hardcoded demo data if Sanity is not configured.
- **Portable Text rendering**: Rich content is rendered on public pages via `components/PortableTextRenderer.tsx` (`@portabletext/react`).
- **Rich text authoring**: The admin panel uses `components/RichTextEditor.tsx` (TipTap) which emits HTML. `lib/portable-text-html.ts` converts HTML ↔ Portable Text so admin API routes can persist TipTap output to Sanity's `blockContent` and reload it into the editor. Supports p, h2–h4, strong/em, links, ul/ol, blockquote.
- **Path alias**: `@/*` maps to the project root (tsconfig paths).
- **All UI text is in Spanish.** Comments in code are also predominantly Spanish.

### Styling

- **Tailwind CSS 3** for utility classes
- **Google Fonts**: Stack Sans Text loaded via `<link>` in the site layout
- Accent color palette: orange → purple → blue gradients throughout the UI

### Seed scripts (`scripts/`)

`seed.mjs` and `seed-en.mjs` populate Sanity with sample data. `patch-glossary.mjs` patches glossary entries. These use the Sanity client directly with a write token.
