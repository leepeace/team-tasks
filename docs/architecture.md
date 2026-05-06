# Architecture

```
[Browser] ──request──▶ [Vercel] ──hosts──▶ [Next.js  App + API Routes]
                                                      │
                                          ┌───────────┴───────────┐
                                    [Supabase Postgres+Auth] [Google OAuth]
```
