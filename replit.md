# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Application: Elkanawy OS Smart Home

A premium dark-mode smart home control web app with:

- **Design**: Glassmorphism + neon blue/purple accents, Tesla-grade minimalism, dark space theme
- **Mobile-first**: Max-width 430px centered phone layout on desktop
- **3D Animated House**: CSS/SVG isometric house on login screen with glowing lights and air effects
- **Voice Control**: Floating mic FAB with pulse animation, command recognition simulation
- **Authentication**: Google Sign-In flow (mock + real backend JWT)
- **Dashboard**: Real-time stats, energy chart (Recharts), device quick-toggle, room overview, scene presets
- **Rooms**: Grouped device management (Living Room, Bedroom, Kitchen, Bathroom)
- **Devices**: All device types (light, fan, AC, thermostat, lock, camera, speaker, TV) with toggle + sliders
- **Automations**: Schedule rules with enable/disable, day selector, trigger types
- **Settings**: Profile page with Google account link, sign out

### Key Libraries

- `framer-motion` - Animations and spring physics
- `recharts` - Energy usage area chart
- `lucide-react` - Icon library (no emojis)
- `date-fns` - Date formatting
- `jsonwebtoken` - JWT auth in API server

## Structure

```text
artifacts-monorepo/
├── artifacts/              # Deployable applications
│   ├── api-server/         # Express API server
│   └── elkanawy-os/        # React + Vite smart home frontend
├── lib/                    # Shared libraries
│   ├── api-spec/           # OpenAPI spec + Orval codegen config
│   ├── api-client-react/   # Generated React Query hooks
│   ├── api-zod/            # Generated Zod schemas from OpenAPI
│   └── db/                 # Drizzle ORM schema + DB connection
├── scripts/                # Utility scripts
├── pnpm-workspace.yaml
├── tsconfig.base.json
├── tsconfig.json
└── package.json
```

## Database Schema

- `users` - Google auth users (id, googleId, email, name, avatarUrl)
- `rooms` - Home rooms per user (id, name, icon, userId)
- `devices` - Smart devices per room (id, name, type, isOn, roomId, userId, value, unit, powerUsage)
- `automations` - Schedule rules (id, name, deviceId, action, triggerType, triggerTime, triggerDays, isEnabled)

## API Endpoints

- `GET /api/healthz` — Health check
- `GET /api/auth/user` — Current user (JWT Bearer)
- `POST /api/auth/google` — Google Sign-In (credential token)
- `POST /api/auth/logout` — Sign out
- `GET/POST /api/rooms` — Room CRUD
- `GET/POST /api/devices` — Device CRUD (?roomId filter)
- `POST /api/devices/:id/toggle` — Toggle device on/off
- `PATCH /api/devices/:id` — Update device value/state
- `GET/POST /api/automations` — Automation CRUD
- `PATCH/DELETE /api/automations/:id` — Update/delete automation

## TypeScript & Composite Projects

Every package extends `tsconfig.base.json` which sets `composite: true`. The root `tsconfig.json` lists all packages as project references. This means:

- **Always typecheck from the root** — run `pnpm run typecheck` (which runs `tsc --build --emitDeclarationOnly`). This builds the full dependency graph so that cross-package imports resolve correctly. Running `tsc` inside a single package will fail if its dependencies haven't been built yet.
- **`emitDeclarationOnly`** — we only emit `.d.ts` files during typecheck; actual JS bundling is handled by esbuild/tsx/vite...etc, not `tsc`.
- **Project references** — when package A depends on package B, A's `tsconfig.json` must list B in its `references` array. `tsc --build` uses this to determine build order and skip up-to-date packages.

## Root Scripts

- `pnpm run build` — runs `typecheck` first, then recursively runs `build` in all packages that define it
- `pnpm run typecheck` — runs `tsc --build --emitDeclarationOnly` using project references

## Packages

### `artifacts/api-server` (`@workspace/api-server`)

Express 5 API server. Routes live in `src/routes/` and use `@workspace/api-zod` for request and response validation and `@workspace/db` for persistence.

- Entry: `src/index.ts` — reads `PORT`, starts Express
- App setup: `src/app.ts` — mounts CORS, JSON/urlencoded parsing, routes at `/api`
- Routes: `src/routes/index.ts` mounts sub-routers
- Depends on: `@workspace/db`, `@workspace/api-zod`
- `pnpm --filter @workspace/api-server run dev` — run the dev server
- `pnpm --filter @workspace/api-server run build` — production esbuild bundle (`dist/index.cjs`)

### `artifacts/elkanawy-os` (`@workspace/elkanawy-os`)

React + Vite smart home frontend. 

- Entry: `src/main.tsx`
- App: `src/App.tsx` — Wouter routing, protected routes
- Pages: login, dashboard, rooms, room-detail, devices, automations, settings
- Components: MobileLayout, TabBar, House3D, VoiceControl, DeviceCard, RoomCard

### `lib/db` (`@workspace/db`)

Database layer using Drizzle ORM with PostgreSQL. 

- `src/schema/users.ts`, `rooms.ts`, `devices.ts`, `automations.ts`
- `drizzle.config.ts` — Drizzle Kit config

Production migrations are handled by Replit when publishing. In development, use `pnpm --filter @workspace/db run push`.

### `lib/api-spec` (`@workspace/api-spec`)

Owns the OpenAPI 3.1 spec (`openapi.yaml`) and the Orval config.

Run codegen: `pnpm --filter @workspace/api-spec run codegen`
