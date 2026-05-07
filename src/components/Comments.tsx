'use client'

import { useState } from 'react'
import { Tables } from '@/lib/database.types'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { PlusIcon, Trash2Icon, PencilIcon, CheckIcon, XIcon } from 'lucide-react'

type Comment = Tables<'comments'>

function CommentCard({
  comment,
  onEdit,
  onDelete,
}: {
  comment: Comment
  onEdit: (id: string, body: string) => Promise<void>
  onDelete: (id: string) => void
}) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(comment.body)
  const [saving, setSaving] = useState(false)

  async function handleSave() {
    if (!draft.trim() || saving) return
    setSaving(true)
    try {
      await onEdit(comment.id, draft.trim())
      setEditing(false)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="rounded-lg border bg-card px-4 py-3 shadow-sm flex flex-col gap-2">
      <div className="flex items-start gap-2">
        {editing ? (
          <Textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            className="flex-1 min-h-[60px] text-sm"
            maxLength={500}
            autoFocus
          />
        ) : (
          <p className="flex-1 text-sm whitespace-pre-wrap">{comment.body}</p>
        )}

        <div className="flex shrink-0 gap-1">
          {editing ? (
            <>
              <button
                onClick={handleSave}
                disabled={!draft.trim() || saving}
                className="text-emerald-600 hover:text-emerald-700 disabled:opacity-40 transition-colors"
                aria-label="저장"
              >
                <CheckIcon className="h-4 w-4" />
              </button>
              <button
                onClick={() => { setEditing(false); setDraft(comment.body) }}
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="취소"
              >
                <XIcon className="h-4 w-4" />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setEditing(true)}
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="수정"
              >
                <PencilIcon className="h-4 w-4" />
              </button>
              <button
                onClick={() => onDelete(comment.id)}
                className="text-muted-foreground hover:text-destructive transition-colors"
                aria-label="삭제"
              >
                <Trash2Icon className="h-4 w-4" />
              </button>
            </>
          )}
        </div>
      </div>

      <span className="text-xs text-muted-foreground">
        {new Date(comment.created_at).toLocaleDateString('ko-KR', {
          year: 'numeric', month: 'short', day: 'numeric',
          hour: '2-digit', minute: '2-digit',
        })}
      </span>
    </div>
  )
}

export default function Comments({ initialComments }: { initialComments: Comment[] }) {
  const [comments, setComments] = useState(initialComments)
  const [body, setBody] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    if (!body.trim() || submitting) return
    setSubmitting(true)
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ body: body.trim() }),
      })
      if (res.ok) {
        const comment: Comment = await res.json()
        setComments((prev) => [comment, ...prev])
        setBody('')
      }
    } finally {
      setSubmitting(false)
    }
  }

  async function handleEdit(id: string, newBody: string) {
    const res = await fetch(`/api/comments/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ body: newBody }),
    })
    if (res.ok) {
      const updated: Comment = await res.json()
      setComments((prev) => prev.map((c) => (c.id === id ? updated : c)))
    }
  }

  async function handleDelete(id: string) {
    setComments((prev) => prev.filter((c) => c.id !== id))
    const res = await fetch(`/api/comments/${id}`, { method: 'DELETE' })
    if (!res.ok) {
      const deleted = initialComments.find((c) => c.id === id)
      if (deleted) setComments((prev) => [deleted, ...prev])
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <form onSubmit={handleAdd} className="flex flex-col gap-2">
        <Textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="댓글 내용 입력..."
          className="min-h-[80px]"
          maxLength={500}
        />
        <Button
          type="submit"
          disabled={!body.trim() || submitting}
          className="self-end"
        >
          <PlusIcon className="h-4 w-4 mr-1.5" />
          댓글 추가
        </Button>
      </form>

      {comments.length === 0 ? (
        <p className="rounded-lg border border-dashed px-4 py-8 text-center text-sm text-muted-foreground">
          댓글이 없습니다
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {comments.map((c) => (
            <CommentCard key={c.id} comment={c} onEdit={handleEdit} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  )
}
