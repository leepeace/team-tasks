'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import SupabaseTasks from '@/components/SupabaseTasks'
import { LayoutDashboardIcon } from 'lucide-react'
import type { Tables } from '@/lib/database.types'

type Task = Tables<'tasks'>

export default function Home() {
  const router = useRouter()
  const [email, setEmail] = useState<string | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])

  useEffect(() => {
    const supabase = createClient()
    async function init() {
      const [{ data: { user } }, { data: taskData }] = await Promise.all([
        supabase.auth.getUser(),
        supabase.from('tasks').select('*').order('created_at', { ascending: false }),
      ])
      setEmail(user?.email ?? null)
      setTasks(taskData ?? [])
    }
    init()
  }, [])

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  const todoCount = tasks.filter((t) => t.status === 'todo').length
  const doneCount = tasks.filter((t) => t.status === 'done').length

  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <LayoutDashboardIcon className="h-4 w-4" />
            </div>
            <span className="font-semibold text-base">팀 일감 관리</span>
          </div>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>전체 <strong className="text-foreground">{tasks.length}</strong></span>
            <span className="text-slate-500">할 일 <strong className="text-slate-700">{todoCount}</strong></span>
            <span className="text-emerald-500">완료 <strong className="text-emerald-700">{doneCount}</strong></span>
            {email && (
              <>
                <span className="text-foreground truncate max-w-[180px]">{email}</span>
                <button
                  onClick={handleLogout}
                  className="shrink-0 rounded-md px-3 py-1.5 text-xs font-medium ring-1 ring-slate-300 hover:bg-muted transition-colors"
                >
                  로그아웃
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-6">
        <SupabaseTasks initialTasks={tasks} />
      </main>
    </div>
  )
}
