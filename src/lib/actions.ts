'use server';

import { revalidatePath } from 'next/cache';
import { readTasks, writeTasks } from '@/lib/storage';
import { Task, TaskStatus, TaskPriority } from '@/types';

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

export async function createTask(formData: {
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee: string;
  dueDate?: string;
}): Promise<Task> {
  const tasks = readTasks();
  const now = new Date().toISOString();
  const newTask: Task = {
    id: generateId(),
    ...formData,
    createdAt: now,
    updatedAt: now,
  };
  tasks.push(newTask);
  writeTasks(tasks);
  revalidatePath('/');
  return newTask;
}

export async function updateTask(
  id: string,
  updates: Partial<Omit<Task, 'id' | 'createdAt' | 'updatedAt'>>
): Promise<Task> {
  const tasks = readTasks();
  const index = tasks.findIndex((t) => t.id === id);
  if (index === -1) throw new Error('Task not found');
  const updated: Task = {
    ...tasks[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  tasks[index] = updated;
  writeTasks(tasks);
  revalidatePath('/');
  return updated;
}

export async function deleteTask(id: string): Promise<void> {
  const tasks = readTasks();
  const filtered = tasks.filter((t) => t.id !== id);
  writeTasks(filtered);
  revalidatePath('/');
}
