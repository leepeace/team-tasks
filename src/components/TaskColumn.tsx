'use client';

import { useState } from 'react';
import { Task, TaskStatus, STATUS_LABELS } from '@/types';
import { updateTask } from '@/lib/actions';
import TaskCard from '@/components/TaskCard';
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';

const COLUMN_STYLES: Record<TaskStatus, { header: string; badge: string; drop: string }> = {
  todo: {
    header: 'text-slate-700',
    badge: 'bg-slate-100 text-slate-600',
    drop: 'border-slate-300 bg-slate-50',
  },
  'in-progress': {
    header: 'text-blue-700',
    badge: 'bg-blue-100 text-blue-600',
    drop: 'border-blue-300 bg-blue-50',
  },
  done: {
    header: 'text-emerald-700',
    badge: 'bg-emerald-100 text-emerald-600',
    drop: 'border-emerald-300 bg-emerald-50',
  },
};

interface TaskColumnProps {
  status: TaskStatus;
  tasks: Task[];
  onEdit: (task: Task) => void;
  onAddTask: (status: TaskStatus) => void;
}

export default function TaskColumn({ status, tasks, onEdit, onAddTask }: TaskColumnProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const styles = COLUMN_STYLES[status];

  function handleDragStart(e: React.DragEvent, taskId: string) {
    e.dataTransfer.setData('taskId', taskId);
    e.dataTransfer.setData('fromStatus', status);
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    setIsDragOver(true);
  }

  function handleDragLeave() {
    setIsDragOver(false);
  }

  async function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragOver(false);
    const taskId = e.dataTransfer.getData('taskId');
    const fromStatus = e.dataTransfer.getData('fromStatus') as TaskStatus;
    if (taskId && fromStatus !== status) {
      await updateTask(taskId, { status });
    }
  }

  return (
    <div className="flex flex-col min-w-0">
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <h2 className={`font-semibold text-sm ${styles.header}`}>
            {STATUS_LABELS[status]}
          </h2>
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${styles.badge}`}>
            {tasks.length}
          </span>
        </div>
        <Button
          size="icon"
          variant="ghost"
          className="h-6 w-6"
          onClick={() => onAddTask(status)}
          title={`${STATUS_LABELS[status]} 일감 추가`}
        >
          <PlusIcon className="h-4 w-4" />
        </Button>
      </div>

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`flex flex-col gap-2.5 min-h-[120px] rounded-xl p-2.5 border-2 border-dashed transition-colors ${
          isDragOver ? styles.drop : 'border-transparent'
        }`}
      >
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onEdit={onEdit}
            onDragStart={handleDragStart}
          />
        ))}
        {tasks.length === 0 && (
          <div className="flex items-center justify-center h-20 text-xs text-muted-foreground">
            일감 없음
          </div>
        )}
      </div>
    </div>
  );
}
