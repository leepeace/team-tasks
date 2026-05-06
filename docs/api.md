# API Endpoints

Base path: `/api`

| METHOD | PATH | 설명 | 인증 |
|--------|------|------|------|
| GET | `/api/auth/login` | Google OAuth 로그인 흐름을 시작하고 콜백 URL로 리디렉트한다 | 불필요 |
| GET | `/api/auth/callback` | OAuth 인증 코드를 받아 세션 쿠키를 발급한다 | 불필요 |
| POST | `/api/auth/logout` | 세션 쿠키를 만료시켜 로그아웃 처리한다 | 필요 |
| GET | `/api/tasks` | 전체 일감 목록을 반환한다. `assignee_id` 쿼리 파라미터로 필터링 가능 | 필요 |
| POST | `/api/tasks` | 새 일감(title · assignee_id)을 생성한다 | 필요 |
| PATCH | `/api/tasks/[id]` | 일감의 title · assignee_id · status를 부분 수정한다 | 필요 |
| DELETE | `/api/tasks/[id]` | 지정한 일감을 삭제한다 | 필요 |
