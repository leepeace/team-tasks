import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Comments from '@/components/Comments'

export default async function CommentsPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: comments } = await supabase
    .from('comments')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-2xl px-4 py-10">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">댓글</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              총 {comments?.length ?? 0}개
            </p>
          </div>
          <a
            href="/"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            ← 메인으로
          </a>
        </div>

        <Comments initialComments={comments ?? []} />
      </div>
    </main>
  )
}
