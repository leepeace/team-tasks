import { readTasks } from '@/lib/storage';
import TaskBoard from '@/components/TaskBoard';
import { LayoutDashboardIcon } from 'lucide-react';

export default async function Home() {
  const tasks = readTasks();

  const stats = {
    total: tasks.length,
    todo: tasks.filter((t) => t.status === 'todo').length,
    inProgress: tasks.filter((t) => t.status === 'in-progress').length,
    done: tasks.filter((t) => t.status === 'done').length,
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <LayoutDashboardIcon className="h-4 w-4" />
            </div>
            <span className="font-semibold text-base">팀 일감 관리</span>
          </div>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>전체 <strong className="text-foreground">{stats.total}</strong></span>
            <span className="text-slate-500">할 일 <strong className="text-slate-700">{stats.todo}</strong></span>
            <span className="text-blue-500">진행 중 <strong className="text-blue-700">{stats.inProgress}</strong></span>
            <span className="text-emerald-500">완료 <strong className="text-emerald-700">{stats.done}</strong></span>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6">
        <TaskBoard initialTasks={tasks} />
      </main>
    </div>
  );
}
