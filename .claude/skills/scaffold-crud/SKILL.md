---
name: scaffold-crud
description: |
  단일 테이블 CRUD를 한 번에 만든다.
  Next.js Route Handler + Supabase + RLS 패턴을 따른다.
  *use proactively when 학습자가 'CRUD 만들어 주십시오' 또는
  '단일 테이블 추가해 주십시오'라고 말할 때.*
allowed-tools:
  - Read
  - Write
  - Edit
  - mcp__supabase__apply_migration
  - mcp__supabase__generate_typescript_types
---

# scaffold-crud

본 Skill은 단일 테이블 CRUD를 한 번에 스캐폴딩합니다.

## 절차
1. docs/db.md 형식으로 테이블 정의 받기
2. apply_migration으로 마이그레이션 적용
3. generate_typescript_types로 타입 동기화
4. app/api/<resource>/route.ts (GET·POST)
5. app/api/<resource>/[id]/route.ts (GET·PATCH·DELETE)
6. app/<resource>/page.tsx (단순 UI)
