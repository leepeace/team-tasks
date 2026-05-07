'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import SupabaseTasks from '@/components/SupabaseTasks'
import WalkingCharacters from '@/components/WalkingCharacters'
import SkyHeader from '@/components/SkyHeader'
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
      <SkyHeader
        totalCount={tasks.length}
        todoCount={todoCount}
        doneCount={doneCount}
        email={email}
        onLogout={handleLogout}
      />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-6">
        <SupabaseTasks initialTasks={tasks} />
      </main>

      <WalkingCharacters />
    </div>
  )
}
