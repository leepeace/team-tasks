# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev      # Start dev server (Turbopack) at http://localhost:3000
npm run build    # Production build
npm run start    # Serve production build
```

No lint or test scripts are configured.

## Architecture

**Stack**: Next.js 16.2.4 · React 19 · TypeScript · Tailwind CSS v4 · shadcn/ui

**Persistence**: Flat JSON file at `data/tasks.json` — read/written synchronously via `src/lib/storage.ts`. There is no database or API layer yet; the architecture docs plan a future migration to Supabase.

**Data flow**:
1. `src/app/page.tsx` (Server Component) calls `readTasks()` and passes the result as `initialTasks` to `<TaskBoard>`.
2. `TaskBoard` (`'use client'`) holds all filter/search state in memory and derives `tasksByStatus` via `useMemo`. It does **not** refetch — it works entirely off the `initialTasks` prop.
3. Mutations (`createTask`, `updateTask`, `deleteTask`) are Next.js Server Actions in `src/lib/actions.ts`. Each action calls `revalidatePath('/')` to trigger a server re-render and push fresh data down.

**Type contract**: `src/types/index.ts` defines `Task`, `TaskStatus`, `TaskPriority`, and the constants `STATUS_LABELS`, `PRIORITY_LABELS`, `COLUMNS` used across components.

**UI components**: `src/components/ui/` contains shadcn/ui primitives. Task-specific components are `TaskBoard` (filtering + layout), `TaskColumn` (per-status list), `TaskCard` (single card), `TaskDialog` (create/edit form).
