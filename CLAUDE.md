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

## Environment

Copy `.env.local.example` to `.env.local` and fill in the Sanity credentials:
- `NEXT_PUBLIC_SANITY_PROJECT_ID`
- `NEXT_PUBLIC_SANITY_DATASET` (default: `production`)
- `NEXT_PUBLIC_SANITY_API_VERSION` (default: `2024-01-01`)

## Architecture

### Routing (App Router with route groups)

- `app/(site)/` — Public-facing pages with shared layout (Header + Footer). Each section is a folder:
  - `page.tsx` — Homepage (hero, section cards, latest reports, MarketTech promo, category slider, newsletter)
  - `noticias/`, `normativa/`, `formacion/`, `ayudas/`, `agenda/`, `documentos/`, `glosario/`, `markettech/`, `contacto/`, `busqueda/` — Section listing pages
  - `[category]/[slug]/page.tsx` — Dynamic article detail page (uses `generateStaticParams` + ISR at 60s)
- `app/studio/[[...index]]/` — Sanity Studio embedded as a client-side SPA at `/studio` with its own layout (no Header/Footer)

### CMS Layer (Sanity)

- `sanity.config.ts` — Studio config (basePath `/studio`, structureTool + visionTool)
- `sanity/schemas/` — Content type definitions: `post`, `category`, `author`, `agenda`, `document`, `glossary`, `blockContent`
- `lib/sanity.ts` — **Central data access module**. Contains the Sanity client, `urlFor()` image helper, all TypeScript interfaces (`Post`, `Category`, `AgendaEvent`, `Document`, `GlossaryTerm`), and all GROQ queries. Every page fetches data through exported functions from this file.

### Key patterns

- **ISR everywhere**: All data-fetching functions pass `{ next: { revalidate: 60 } }` to `client.fetch()`, and pages export `revalidate = 60`.
- **Demo fallback**: The homepage falls back to hardcoded demo data if Sanity is not configured.
- **Portable Text**: Rich content is rendered via `components/PortableTextRenderer.tsx` using `@portabletext/react`.
- **Path alias**: `@/*` maps to the project root (tsconfig paths).

### Styling

- **Tailwind CSS 3** for utility classes
- **Google Fonts**: Stack Sans Text loaded via `<link>` in the site layout
- Accent color palette: orange → purple → blue gradients throughout the UI
