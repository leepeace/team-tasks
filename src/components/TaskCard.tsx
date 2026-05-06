'use client';

import { Task, TaskPriority } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { deleteTask } from '@/lib/actions';
import { CalendarIcon, UserIcon, Trash2Icon, PencilIcon } from 'lucide-react';

const PRIORITY_STYLES: Record<TaskPriority, string> = {
  high: 'bg-red-100 text-red-700 border-red-200',
  medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  low: 'bg-green-100 text-green-700 border-green-200',
};

const PRIORITY_LABELS: Record<TaskPriority, string> = {
  high: '높음',
  medium: '보통',
  low: '낮음',
};

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat('ko-KR', { month: 'short', day: 'numeric' }).format(date);
}

function isOverdue(dueDate?: string) {
  if (!dueDate) return false;
  return new Date(dueDate) < new Date(new Date().toDateString());
}

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDragStart: (e: React.DragEvent, taskId: string) => void;
}

export default function TaskCard({ task, onEdit, onDragStart }: TaskCardProps) {
  async function handleDelete(e: React.MouseEvent) {
    e.stopPropagation();
    if (!confirm(`"${task.title}" 일감을 삭제하시겠습니까?`)) return;
    await deleteTask(task.id);
  }

  const overdue = isOverdue(task.dueDate);

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, task.id)}
      className="group bg-white rounded-lg border border-border p-3 shadow-sm hover:shadow-md transition-all cursor-grab active:cursor-grabbing active:opacity-70 active:scale-95"
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-medium text-foreground leading-snug flex-1">{task.title}</p>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
          <Button
            size="icon"
            variant="ghost"
            className="h-6 w-6"
            onClick={(e) => { e.stopPropagation(); onEdit(task); }}
          >
            <PencilIcon className="h-3 w-3" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="h-6 w-6 hover:text-destructive"
            onClick={handleDelete}
          >
            <Trash2Icon className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {task.description && (
        <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2">{task.description}</p>
      )}

      <div className="flex items-center justify-between mt-3 gap-2 flex-wrap">
        <Badge
          variant="outline"
          className={`text-xs px-1.5 py-0 ${PRIORITY_STYLES[task.priority]}`}
        >
          {PRIORITY_LABELS[task.priority]}
        </Badge>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {task.assignee && (
            <span className="flex items-center gap-1">
              <UserIcon className="h-3 w-3" />
              {task.assignee}
            </span>
          )}
          {task.dueDate && (
            <span className={`flex items-center gap-1 ${overdue ? 'text-red-500 font-medium' : ''}`}>
              <CalendarIcon className="h-3 w-3" />
              {formatDate(task.dueDate)}
              {overdue && ' ⚠'}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
