'use client'

const CLOUDS = [
  { size: 2.4, speed: 28, delay: 0,   top: '18%' },
  { size: 1.6, speed: 40, delay: -12, top: '55%' },
  { size: 2.0, speed: 34, delay: -6,  top: '30%' },
  { size: 1.3, speed: 22, delay: -18, top: '65%' },
  { size: 1.8, speed: 38, delay: -24, top: '20%' },
]

export default function SkyHeader({
  totalCount,
  todoCount,
  doneCount,
  email,
  onLogout,
}: {
  totalCount: number
  todoCount: number
  doneCount: number
  email: string | null
  onLogout: () => void
}) {
  return (
    <>
      <style>{`
        @keyframes drift {
          from { transform: translateX(110vw); }
          to   { transform: translateX(-20vw); }
        }
        @keyframes float-sun {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50%       { transform: translateY(-4px) rotate(8deg); }
        }
        @keyframes twinkle {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.6; transform: scale(0.85); }
        }
      `}</style>

      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 10,
          overflow: 'hidden',
          background: 'linear-gradient(to bottom, #bde8ff 0%, #d6f0ff 60%, #eaf8ff 100%)',
          borderBottom: '3px solid #7ac8f0',
          height: '64px',
          flexShrink: 0,
        }}
      >
        {/* 구름들 */}
        {CLOUDS.map((c, i) => (
          <span
            key={i}
            style={{
              position: 'absolute',
              top: c.top,
              left: 0,
              fontSize: `${c.size}rem`,
              lineHeight: 1,
              animation: `drift ${c.speed}s linear infinite`,
              animationDelay: `${c.delay}s`,
              opacity: 0.75,
              pointerEvents: 'none',
            }}
          >
            ☁️
          </span>
        ))}

        {/* 별 장식 */}
        {[
          { top: '15%', left: '42%', delay: '0s' },
          { top: '60%', left: '58%', delay: '0.8s' },
          { top: '20%', left: '72%', delay: '1.4s' },
        ].map((s, i) => (
          <span
            key={i}
            style={{
              position: 'absolute',
              top: s.top,
              left: s.left,
              fontSize: '0.7rem',
              animation: `twinkle 2s ease-in-out infinite`,
              animationDelay: s.delay,
              pointerEvents: 'none',
            }}
          >
            ✨
          </span>
        ))}

        {/* 내용 */}
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            maxWidth: '896px',
            margin: '0 auto',
            padding: '0 1rem',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {/* 로고 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                fontSize: '1.6rem',
                lineHeight: 1,
                animation: 'float-sun 3s ease-in-out infinite',
                display: 'inline-block',
              }}
            >
              🌟
            </span>
            <span
              style={{
                fontWeight: 700,
                fontSize: '1rem',
                color: '#1a6ea0',
                letterSpacing: '-0.02em',
              }}
            >
              팀 일감 관리
            </span>
          </div>

          {/* 오른쪽 영역 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            {/* 통계 뱃지 */}
            <Pill emoji="📋" label="전체" count={totalCount} color="#1a6ea0" bg="rgba(255,255,255,0.65)" />
            <Pill emoji="📝" label="할 일" count={todoCount} color="#b05c00" bg="rgba(255,237,200,0.8)" />
            <Pill emoji="✅" label="완료" count={doneCount} color="#1a7a40" bg="rgba(200,255,220,0.8)" />

            {email && (
              <>
                <span
                  style={{
                    fontSize: '0.75rem',
                    color: '#1a6ea0',
                    maxWidth: '160px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  🐾 {email}
                </span>
                <button
                  onClick={onLogout}
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    color: '#fff',
                    background: 'linear-gradient(135deg, #5bb8f5 0%, #3a9de0 100%)',
                    border: 'none',
                    borderRadius: '999px',
                    padding: '4px 12px',
                    cursor: 'pointer',
                    boxShadow: '0 2px 6px rgba(90,170,230,0.4)',
                    transition: 'opacity 0.15s',
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.opacity = '0.85')}
                  onMouseOut={(e) => (e.currentTarget.style.opacity = '1')}
                >
                  로그아웃 🚀
                </button>
              </>
            )}
          </div>
        </div>
      </header>
    </>
  )
}

function Pill({
  emoji, label, count, color, bg,
}: {
  emoji: string; label: string; count: number; color: string; bg: string
}) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '3px',
        fontSize: '0.72rem',
        fontWeight: 600,
        color,
        background: bg,
        border: `1.5px solid ${color}30`,
        borderRadius: '999px',
        padding: '2px 9px',
        backdropFilter: 'blur(4px)',
      }}
    >
      {emoji} {label} <strong>{count}</strong>
    </span>
  )
}
