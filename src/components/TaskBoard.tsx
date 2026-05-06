'use client';

import { useState, useMemo } from 'react';
import { Task, TaskStatus, COLUMNS } from '@/types';
import TaskColumn from '@/components/TaskColumn';
import TaskDialog from '@/components/TaskDialog';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { PlusIcon, SearchIcon } from 'lucide-react';

interface TaskBoardProps {
  initialTasks: Task[];
}

export default function TaskBoard({ initialTasks }: TaskBoardProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [defaultStatus, setDefaultStatus] = useState<TaskStatus>('todo');
  const [search, setSearch] = useState('');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [filterAssignee, setFilterAssignee] = useState<string>('all');

  const assignees = useMemo(() => {
    const names = initialTasks.map((t) => t.assignee).filter(Boolean);
    return [...new Set(names)].sort();
  }, [initialTasks]);

  const filtered = useMemo(() => {
    return initialTasks.filter((t) => {
      const matchSearch =
        !search ||
        t.title.toLowerCase().includes(search.toLowerCase()) ||
        t.description.toLowerCase().includes(search.toLowerCase()) ||
        t.assignee.toLowerCase().includes(search.toLowerCase());
      const matchPriority = filterPriority === 'all' || t.priority === filterPriority;
      const matchAssignee = filterAssignee === 'all' || t.assignee === filterAssignee;
      return matchSearch && matchPriority && matchAssignee;
    });
  }, [initialTasks, search, filterPriority, filterAssignee]);

  const tasksByStatus = useMemo(() => {
    const map: Record<TaskStatus, Task[]> = { todo: [], 'in-progress': [], done: [] };
    filtered.forEach((t) => map[t.status].push(t));
    return map;
  }, [filtered]);

  function handleEdit(task: Task) {
    setEditingTask(task);
    setDialogOpen(true);
  }

  function handleAddTask(status: TaskStatus) {
    setEditingTask(null);
    setDefaultStatus(status);
    setDialogOpen(true);
  }

  function handleDialogClose(open: boolean) {
    setDialogOpen(open);
    if (!open) setEditingTask(null);
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <SearchIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            className="pl-8"
            placeholder="일감 검색..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <Select value={filterPriority} onValueChange={(v) => setFilterPriority(v ?? 'all')}>
          <SelectTrigger className="w-[130px]">
            <SelectValue placeholder="우선순위" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">모든 우선순위</SelectItem>
            <SelectItem value="high">높음</SelectItem>
            <SelectItem value="medium">보통</SelectItem>
            <SelectItem value="low">낮음</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filterAssignee} onValueChange={(v) => setFilterAssignee(v ?? 'all')}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="담당자" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">모든 담당자</SelectItem>
            {assignees.map((name) => (
              <SelectItem key={name} value={name}>{name}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button onClick={() => handleAddTask('todo')} className="shrink-0">
          <PlusIcon className="h-4 w-4 mr-1.5" />
          새 일감
        </Button>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {COLUMNS.map((status) => (
          <TaskColumn
            key={status}
            status={status}
            tasks={tasksByStatus[status]}
            onEdit={handleEdit}
            onAddTask={handleAddTask}
          />
        ))}
      </div>

      <TaskDialog
        open={dialogOpen}
        onOpenChange={handleDialogClose}
        task={editingTask}
        defaultStatus={defaultStatus}
      />
    </div>
  );
}
