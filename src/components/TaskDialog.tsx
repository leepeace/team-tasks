'use client';

import { useState, useEffect } from 'react';
import { Task, TaskStatus, TaskPriority, STATUS_LABELS, PRIORITY_LABELS } from '@/types';
import { createTask, updateTask } from '@/lib/actions';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface TaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task?: Task | null;
  defaultStatus?: TaskStatus;
  onSuccess?: () => void;
}

const defaultForm = {
  title: '',
  description: '',
  status: 'todo' as TaskStatus,
  priority: 'medium' as TaskPriority,
  assignee: '',
  dueDate: '',
};

export default function TaskDialog({
  open,
  onOpenChange,
  task,
  defaultStatus,
  onSuccess,
}: TaskDialogProps) {
  const [form, setForm] = useState(defaultForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      if (task) {
        setForm({
          title: task.title,
          description: task.description,
          status: task.status,
          priority: task.priority,
          assignee: task.assignee,
          dueDate: task.dueDate ?? '',
        });
      } else {
        setForm({ ...defaultForm, status: defaultStatus ?? 'todo' });
      }
      setError('');
    }
  }, [open, task, defaultStatus]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) {
      setError('제목을 입력해주세요.');
      return;
    }
    setLoading(true);
    try {
      if (task) {
        await updateTask(task.id, {
          title: form.title.trim(),
          description: form.description.trim(),
          status: form.status,
          priority: form.priority,
          assignee: form.assignee.trim(),
          dueDate: form.dueDate || undefined,
        });
      } else {
        await createTask({
          title: form.title.trim(),
          description: form.description.trim(),
          status: form.status,
          priority: form.priority,
          assignee: form.assignee.trim(),
          dueDate: form.dueDate || undefined,
        });
      }
      onOpenChange(false);
      onSuccess?.();
    } catch {
      setError('저장 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{task ? '일감 수정' : '새 일감 만들기'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="title">제목 *</Label>
            <Input
              id="title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="일감 제목을 입력하세요"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="description">설명</Label>
            <Textarea
              id="description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="일감에 대한 설명을 입력하세요"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>상태</Label>
              <Select
                value={form.status}
                onValueChange={(v) => setForm({ ...form, status: (v ?? 'todo') as TaskStatus })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(Object.entries(STATUS_LABELS) as [TaskStatus, string][]).map(([val, label]) => (
                    <SelectItem key={val} value={val}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label>우선순위</Label>
              <Select
                value={form.priority}
                onValueChange={(v) => setForm({ ...form, priority: (v ?? 'medium') as TaskPriority })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(Object.entries(PRIORITY_LABELS) as [TaskPriority, string][]).map(([val, label]) => (
                    <SelectItem key={val} value={val}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="assignee">담당자</Label>
              <Input
                id="assignee"
                value={form.assignee}
                onChange={(e) => setForm({ ...form, assignee: e.target.value })}
                placeholder="담당자 이름"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="dueDate">마감일</Label>
              <Input
                id="dueDate"
                type="date"
                value={form.dueDate}
                onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
              />
            </div>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              취소
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? '저장 중...' : task ? '수정' : '만들기'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
