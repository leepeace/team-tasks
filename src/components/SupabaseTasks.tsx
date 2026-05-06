'use client'

import { useState } from 'react'
import { Tables } from '@/lib/database.types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { CheckIcon, PlusIcon, Trash2Icon } from 'lucide-react'

type Task = Tables<'tasks'>

function TaskCard({
  task,
  onToggle,
  onDelete,
}: {
  task: Task
  onToggle: (task: Task) => void
  onDelete: (id: string) => void
}) {
  const done = task.status === 'done'
  return (
    <div className="flex items-center gap-3 rounded-lg border bg-card px-4 py-3 shadow-sm">
      <button
        onClick={() => onToggle(task)}
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
          done
            ? 'border-emerald-500 bg-emerald-500 text-white'
            : 'border-slate-300 hover:border-emerald-400'
        }`}
        aria-label={done ? '할 일로 되돌리기' : '완료로 표시'}
      >
        {done && <CheckIcon className="h-3 w-3" />}
      </button>

      <span className={`flex-1 text-sm ${done ? 'text-muted-foreground line-through' : ''}`}>
        {task.title}
      </span>

      <span className="shrink-0 text-xs text-muted-foreground">
        {new Date(task.created_at).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })}
      </span>

      <button
        onClick={() => onDelete(task.id)}
        className="shrink-0 text-muted-foreground hover:text-destructive transition-colors"
        aria-label="삭제"
      >
        <Trash2Icon className="h-4 w-4" />
      </button>
    </div>
  )
}

function Column({ title, tasks, onToggle, onDelete }: {
  title: string
  tasks: Task[]
  onToggle: (task: Task) => void
  onDelete: (id: string) => void
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <h2 className="font-semibold text-sm">{title}</h2>
        <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
          {tasks.length}
        </span>
      </div>
      {tasks.length === 0 ? (
        <p className="rounded-lg border border-dashed px-4 py-6 text-center text-sm text-muted-foreground">
          일감이 없습니다
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          {tasks.map((t) => (
            <TaskCard key={t.id} task={t} onToggle={onToggle} onDelete={onDelete} />
          ))}
        </div>
      )}
    </div>
  )
}

export default function SupabaseTasks({ initialTasks }: { initialTasks: Task[] }) {
  const [tasks, setTasks] = useState(initialTasks)
  const [title, setTitle] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim() || submitting) return
    setSubmitting(true)
    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: title.trim() }),
      })
      if (res.ok) {
        const task: Task = await res.json()
        setTasks((prev) => [task, ...prev])
        setTitle('')
      }
    } finally {
      setSubmitting(false)
    }
  }

  async function handleToggle(task: Task) {
    const next = task.status === 'todo' ? 'done' : 'todo'
    setTasks((prev) => prev.map((t) => (t.id === task.id ? { ...t, status: next } : t)))
    const res = await fetch(`/api/tasks/${task.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: next }),
    })
    if (!res.ok) {
      setTasks((prev) => prev.map((t) => (t.id === task.id ? task : t)))
    }
  }

  async function handleDelete(id: string) {
    setTasks((prev) => prev.filter((t) => t.id !== id))
    const res = await fetch(`/api/tasks/${id}`, { method: 'DELETE' })
    if (!res.ok) {
      setTasks((prev) => {
        const deleted = initialTasks.find((t) => t.id === id)
        return deleted ? [...prev, deleted] : prev
      })
    }
  }

  const todo = tasks.filter((t) => t.status === 'todo')
  const done = tasks.filter((t) => t.status === 'done')

  return (
    <div className="flex flex-col gap-6">
      <form onSubmit={handleAdd} className="flex gap-2">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="새 일감 제목 입력..."
          className="flex-1"
          maxLength={100}
        />
        <Button type="submit" disabled={!title.trim() || submitting} className="shrink-0">
          <PlusIcon className="h-4 w-4 mr-1.5" />
          추가
        </Button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Column title="할 일" tasks={todo} onToggle={handleToggle} onDelete={handleDelete} />
        <Column title="완료" tasks={done} onToggle={handleToggle} onDelete={handleDelete} />
      </div>
    </div>
  )
}
