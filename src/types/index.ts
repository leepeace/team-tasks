export type TaskStatus = 'todo' | 'in-progress' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee: string;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

export const STATUS_LABELS: Record<TaskStatus, string> = {
  todo: '할 일',
  'in-progress': '진행 중',
  done: '완료',
};

export const PRIORITY_LABELS: Record<TaskPriority, string> = {
  low: '낮음',
  medium: '보통',
  high: '높음',
};

export const COLUMNS: TaskStatus[] = ['todo', 'in-progress', 'done'];
