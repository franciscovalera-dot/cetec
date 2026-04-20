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

Copy `.env.local.example` to `.env.local` and fill in the Sanity credentials:
- `NEXT_PUBLIC_SANITY_PROJECT_ID`
- `NEXT_PUBLIC_SANITY_DATASET` (default: `production`)
- `NEXT_PUBLIC_SANITY_API_VERSION` (default: `2024-01-01`)
- `SANITY_API_WRITE_TOKEN` — required for the admin panel's write operations
- `ADMIN_PASSWORD` — used by the custom admin auth endpoint

## Architecture

### Three route groups

1. **`app/(site)/`** — Public pages with shared Header + Footer layout.
   - Section listing pages: `noticias/`, `normativa/`, `formacion/`, `ayudas/`, `agenda/`, `documentos/`, `glosario/`, `markettech/`, `contacto/`, `busqueda/`
   - `[category]/[slug]/page.tsx` — Dynamic article detail (uses `generateStaticParams` + ISR at 60s, `dynamicParams = true`)
2. **`app/admin/`** — Custom admin panel (separate layout with `components/AdminNav.tsx`, no site Header/Footer). Sub-sections: `entradas` (posts), `documentos`, `agenda`, `soluciones` (MarketTech), `glosario`, plus `login`. Each has its own API backend under `app/api/admin/`.
3. **`app/studio/[[...index]]/`** — Sanity Studio embedded as a client-side SPA at `/studio` with its own layout.

### Two Sanity clients

- **`lib/sanity.ts`** — Read-only client (uses CDN in production). Contains all TypeScript interfaces (`Post`, `Category`, `AgendaEvent`, `Document`, `GlossaryTerm`), the `urlFor()` image helper, and all GROQ query functions. Every public page fetches data through this file.
- **`lib/sanity-admin.ts`** — Write client with `SANITY_API_WRITE_TOKEN`. Used only by API routes under `app/api/admin/`. Also exports content taxonomy constants (`SECCIONES`, `TEMATICAS`, `SECTORES`, `TIPOS_DOCUMENTO`) and helpers for Portable Text conversion.

### API routes

Admin (`app/api/admin/`) — all gated behind admin auth, use the write client:
- `auth/` — Admin password login (uses `ADMIN_PASSWORD`)
- `posts/` + `posts/[id]/` — CRUD for posts
- `documents/`, `events/`, `glossary/`, `soluciones/` — CRUD for their respective content types
- `upload/` — Image upload to Sanity

Public (`app/api/`):
- `soluciones/` — Public read endpoint for MarketTech solutions (used by client-side filtering UI)

### Content taxonomy

Posts are organized by three independent axes (defined as string enums in both the Sanity schema and `sanity-admin.ts`):
- **Sección** (required): `noticias`, `normativa`, `formacion`, `ayudas`, `agenda`, `markettech` — determines which listing page displays the post
- **Temática**: `materiales`, `procesos`, `digitalizacion`, `reciclado`, `ecodiseno`
- **Sector**: `plastico`, `calzado`, `agroalimentario`

The `category` reference field on posts is marked `hidden: true` (legacy). The `seccion` string field is the primary organizer.

### Sanity schemas (`sanity/schemas/`)

Content types: `post`, `category`, `author`, `agenda`, `document`, `glossary`, `solucion`, `blockContent`. Registered in `schemas/index.ts`.

`solucion` (MarketTech tech solutions) has its own taxonomy distinct from posts: `tecnologia` (tecnologías-verdes/digitales, nanotecnología, fabricación-avanzada, materiales-avanzados), `sector` (plástico/calzado), `reto`, `material`. Detail pages live at `app/(site)/markettech/[slug]/`.

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
