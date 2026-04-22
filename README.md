# Observatorio Tecnológico CETEC

Blog técnico y catálogo de soluciones del **Centro Tecnológico del Calzado y el Plástico** (CETEC). Reúne noticias, normativa, formación, ayudas, eventos, documentos técnicos, un glosario y un marketplace de soluciones tecnológicas (MarketTech) para los sectores del plástico y el calzado.

## Stack

- **Next.js 14** (App Router) + TypeScript
- **Tailwind CSS 3** — estilos
- **Sanity v3** — CMS headless (contenido + imágenes + studio embebido en `/studio`)
- **TipTap** — editor rich-text del admin custom
- **Google reCAPTCHA v2** — anti-bot en formularios públicos
- **Sesiones admin firmadas con HMAC-SHA256**

## Arquitectura

Tres grupos de rutas:

| Grupo | Propósito |
|---|---|
| `app/(site)/` | Páginas públicas (Header + Footer compartidos) |
| `app/admin/` | Panel de administración custom (gateado por contraseña, UI propia) |
| `app/studio/[[...index]]/` | Sanity Studio embebido en `/studio` |

### Taxonomía de contenido

Los posts se organizan por tres ejes independientes:

- **Sección** (obligatoria): `noticias`, `normativa`, `formacion`, `ayudas`, `agenda`
- **Temática**: `materiales`, `procesos`, `digitalizacion`, `reciclado`, `ecodiseno`
- **Sector**: `plastico`, `calzado`, `agroalimentario`

Las **soluciones MarketTech** usan su propia taxonomía (`tecnologia`, `sector`, `reto`, `material`).

## Setup local

1. **Clonar e instalar dependencias**

   ```bash
   npm install
   ```

2. **Variables de entorno**

   Copia la plantilla y rellena los valores:

   ```bash
   cp .env.local.example .env.local
   ```

   Necesitas obtener/definir:

   - `NEXT_PUBLIC_SANITY_PROJECT_ID` — ID del proyecto en [sanity.io/manage](https://www.sanity.io/manage)
   - `SANITY_API_WRITE_TOKEN` — crea un token con permisos de *Editor* en el mismo panel
   - `ADMIN_PASSWORD` — contraseña que usarás para acceder a `/admin`
   - `SESSION_SECRET` — genera uno aleatorio:

     ```bash
     node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
     ```
   - `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` / `RECAPTCHA_SECRET_KEY` — obtenlas en [reCAPTCHA admin](https://www.google.com/recaptcha/admin) (tipo v2 *"no soy un robot"*)

   > Para desarrollo sin reCAPTCHA usa `RECAPTCHA_DISABLED=1`. En producción esta variable se ignora.

3. **Levantar dev server**

   ```bash
   npm run dev
   ```

   Abre [http://localhost:3000](http://localhost:3000).

4. **(Opcional) Cargar datos de prueba**

   ```bash
   node scripts/seed.mjs
   ```

   Crea 75 posts, 12 eventos, 12 documentos y 20 términos de glosario. Requiere que las variables de Sanity estén configuradas.

## Comandos

| Comando | Descripción |
|---|---|
| `npm run dev` | Dev server en `localhost:3000` |
| `npm run build` | Build de producción |
| `npm run start` | Sirve el build |
| `npm run lint` | ESLint (`next/core-web-vitals` + `next/typescript`) |

No hay suite de tests — verifica calidad con `npm run lint` + `npm run build`.

## Acceso al admin

- **Admin custom**: `/admin/login` → usa la contraseña de `ADMIN_PASSWORD`. Expira en 24h.
- **Sanity Studio**: `/studio` — útil para ver/editar contenido directamente desde el esquema Sanity.

Los endpoints bajo `/api/admin/*` exigen sesión válida (cookie firmada HMAC-SHA256).

## Formularios públicos

| Ruta | Componente | Endpoint | Destino |
|---|---|---|---|
| Home → "Suscríbete" | `SubscriptionForm` | `POST /api/subscriptions` | Sanity `subscription` (newsletter general) |
| `/busqueda` → "Crear alerta" | `AlertModal` | `POST /api/subscriptions` | Sanity `subscription` (alerta filtrada) |
| `/contacto` | `ContactForm` | `POST /api/contact` | Sanity `contactMessage` |

Los tres verifican reCAPTCHA server-side y limitan longitudes de campos.

## Árbol de archivos

```
cetec/
├── app/
│   ├── (site)/                         # Páginas públicas (grupo con layout Header+Footer)
│   │   ├── layout.tsx
│   │   ├── page.tsx                    # Home
│   │   ├── agenda/page.tsx
│   │   ├── ayudas/page.tsx
│   │   ├── busqueda/page.tsx           # Buscador global con filtros + modal alerta
│   │   ├── contacto/page.tsx
│   │   ├── documentos/page.tsx
│   │   ├── formacion/page.tsx
│   │   ├── glosario/page.tsx
│   │   ├── noticias/page.tsx
│   │   ├── normativa/page.tsx
│   │   ├── privacidad/page.tsx
│   │   ├── [category]/[slug]/page.tsx  # Detalle de post (dinámico con ISR)
│   │   └── markettech/
│   │       ├── page.tsx
│   │       ├── soluciones/page.tsx     # Listado + filtros
│   │       └── [slug]/page.tsx         # Detalle de solución
│   ├── admin/                          # Panel admin custom (fuera del layout público)
│   │   ├── layout.tsx
│   │   ├── page.tsx                    # Dashboard (listado de posts)
│   │   ├── login/page.tsx
│   │   ├── entradas/{[id],nueva}/page.tsx
│   │   ├── agenda/{[id],nuevo}/page.tsx
│   │   ├── documentos/{[id],nuevo}/page.tsx
│   │   ├── glosario/{[id],nuevo}/page.tsx
│   │   ├── soluciones/{[id],nuevo}/page.tsx
│   │   └── suscripciones/page.tsx      # Listado + exportar CSV
│   ├── api/
│   │   ├── admin/                      # Endpoints protegidos por checkAuth
│   │   │   ├── auth/route.ts           # POST login / DELETE logout / GET session
│   │   │   ├── posts/
│   │   │   ├── events/
│   │   │   ├── documents/
│   │   │   ├── glossary/
│   │   │   ├── soluciones/
│   │   │   ├── subscriptions/
│   │   │   └── upload/route.ts         # Subida de imágenes a Sanity
│   │   ├── contact/route.ts            # POST público (reCAPTCHA + límites)
│   │   ├── subscriptions/route.ts      # POST público (reCAPTCHA + dedupe)
│   │   └── soluciones/route.ts         # GET público (MarketTech filtrado)
│   ├── studio/[[...index]]/            # Sanity Studio SPA embebido
│   └── layout.tsx                      # Root layout (fuente + metadatos)
├── components/
│   ├── Header.tsx                      # Nav principal + dropdown Contenido
│   ├── Footer.tsx                      # Footer oscuro con 3 columnas
│   ├── AdminNav.tsx                    # Pestañas del admin
│   ├── CategorySlider.tsx              # Slider de categorías (home)
│   ├── CategoryBadge.tsx
│   ├── PageHero.tsx
│   ├── PostCard.tsx
│   ├── Pagination.tsx
│   ├── SectionSearch.tsx               # Buscador dentro de cada sección
│   ├── PortableTextRenderer.tsx        # Render de contenido Sanity
│   ├── RichTextEditor.tsx              # TipTap (admin)
│   ├── SubscriptionForm.tsx            # Form suscripción (home)
│   ├── AlertModal.tsx                  # Modal "Crear alerta" (buscador)
│   ├── ContactForm.tsx                 # Form contacto
│   ├── FiltersDrawer.tsx               # Drawer de filtros móvil (buscador)
│   └── RecaptchaWidget.tsx             # Wrapper reCAPTCHA v2
├── lib/
│   ├── sanity.ts                       # Cliente lectura + queries GROQ públicas
│   ├── sanity-admin.ts                 # Cliente escritura (SANITY_API_WRITE_TOKEN)
│   ├── admin-auth.ts                   # Sesión admin (HMAC-SHA256)
│   ├── recaptcha.ts                    # Verificación reCAPTCHA server-side
│   └── portable-text-html.ts           # HTML ↔ Portable Text (TipTap ↔ Sanity)
├── sanity/
│   ├── env.ts
│   └── schemas/
│       ├── index.ts
│       ├── post.ts
│       ├── category.ts
│       ├── author.ts
│       ├── agenda.ts
│       ├── document.ts
│       ├── glossary.ts
│       ├── solucion.ts
│       ├── subscription.ts             # Newsletter + alertas de búsqueda
│       ├── contactMessage.ts           # Mensajes del form /contacto
│       └── blockContent.ts
├── scripts/
│   ├── seed.mjs                        # Datos de prueba (75 posts, 12 eventos...)
│   ├── seed-en.mjs
│   └── patch-glossary.mjs
├── public/                             # Imágenes del diseño (logo, cards, gradientes)
├── sanity.config.ts
├── next.config.mjs
├── tailwind.config.ts
├── tsconfig.json
└── CLAUDE.md                           # Guía del proyecto para asistencia con IA
```

## Seguridad

- **Cookies de sesión admin**: firmadas con HMAC-SHA256 usando `SESSION_SECRET`. No contienen la contraseña ni datos reversibles.
- **Verificación reCAPTCHA**: fail-closed por defecto. Sin secret configurado, los endpoints rechazan.
- **Endpoints públicos**: validan email con regex estricto, limitan longitudes (email 254, mensaje 5000, etc.), deduplican suscripciones por email+tipo.
- **DELETE admin**: consulta type-gated para evitar borrado cruzado de documentos.
- **Comparaciones de contraseña**: en tiempo constante (`timingSafeEqual`).

Para rotar sesiones activas (ej. si sospechas que una cookie se ha filtrado), cambia `SESSION_SECRET` y reinicia — todas las cookies emitidas antes quedan invalidadas al instante.

## Licencia

Proyecto privado de CETEC. Todos los derechos reservados.
