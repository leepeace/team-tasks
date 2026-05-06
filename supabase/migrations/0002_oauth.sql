-- 1. FK 삭제 행동 재설정
--    assignee_id: SET NULL (담당자 계정 삭제 시 미배정 처리)
--    created_by : CASCADE (생성자 계정 삭제 시 일감도 삭제)
ALTER TABLE public.tasks
  DROP CONSTRAINT IF EXISTS tasks_assignee_id_fkey,
  DROP CONSTRAINT IF EXISTS tasks_created_by_fkey;

ALTER TABLE public.tasks
  ADD CONSTRAINT tasks_assignee_id_fkey
    FOREIGN KEY (assignee_id) REFERENCES auth.users(id) ON DELETE SET NULL,
  ADD CONSTRAINT tasks_created_by_fkey
    FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE CASCADE;

-- 2. 인증 없이 생성된 기존 row 정리 후 NOT NULL 강화
DELETE FROM public.tasks WHERE created_by IS NULL;

ALTER TABLE public.tasks ALTER COLUMN created_by SET NOT NULL;

-- 3. 임시 전체 허용 정책 제거
DROP POLICY IF EXISTS temp_all_access ON public.tasks;

-- 4. 정식 RLS 정책 4종
--    select: 내가 만들었거나 나에게 배정된 일감
CREATE POLICY tasks_select ON public.tasks
  FOR SELECT USING (
    auth.uid() = created_by
    OR auth.uid() = assignee_id
  );

--    insert: created_by가 본인일 때만
CREATE POLICY tasks_insert ON public.tasks
  FOR INSERT WITH CHECK (auth.uid() = created_by);

--    update: 생성자 또는 담당자
CREATE POLICY tasks_update ON public.tasks
  FOR UPDATE USING (
    auth.uid() = created_by
    OR auth.uid() = assignee_id
  );

--    delete: 생성자만
CREATE POLICY tasks_delete ON public.tasks
  FOR DELETE USING (auth.uid() = created_by);
