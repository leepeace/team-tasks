'use client'

const CHARACTERS = [
  { emoji: '🐱', speed: 18, size: 2.0, delay: 0,  bob: 0.45 },
  { emoji: '🐶', speed: 22, size: 2.4, delay: 3,  bob: 0.50 },
  { emoji: '🐰', speed: 14, size: 1.7, delay: 7,  bob: 0.35 },
  { emoji: '🦊', speed: 25, size: 2.2, delay: 12, bob: 0.48 },
  { emoji: '🐸', speed: 19, size: 1.9, delay: 5,  bob: 0.55 },
  { emoji: '🐼', speed: 28, size: 2.6, delay: 16, bob: 0.52 },
  { emoji: '🐨', speed: 16, size: 2.0, delay: 9,  bob: 0.60 },
  { emoji: '🦁', speed: 23, size: 2.3, delay: 20, bob: 0.44 },
  { emoji: '🐻', speed: 30, size: 2.5, delay: 2,  bob: 0.50 },
  { emoji: '🐹', speed: 12, size: 1.5, delay: 14, bob: 0.30 },
  { emoji: '🐧', speed: 20, size: 1.8, delay: 18, bob: 0.40 },
  { emoji: '🦆', speed: 17, size: 1.9, delay: 25, bob: 0.42 },
]

export default function WalkingCharacters() {
  return (
    <>
      <style>{`
        @keyframes walk-left {
          from { transform: translateX(110vw); }
          to   { transform: translateX(-12vw); }
        }
        @keyframes bob {
          0%, 100% { transform: scaleX(-1) translateY(0px); }
          50%       { transform: scaleX(-1) translateY(-7px); }
        }
        @keyframes sway-grass {
          0%, 100% { transform: rotate(-8deg); }
          50%       { transform: rotate(8deg); }
        }
      `}</style>

      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '90px',
          overflow: 'hidden',
          background: 'linear-gradient(to bottom, #d4f5b8 0%, #a8e063 50%, #78c833 100%)',
          borderTop: '3px solid #5aaa1a',
          flexShrink: 0,
        }}
      >
        {/* 풀밭 장식 */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0,
          display: 'flex', gap: '18px', padding: '0 8px',
        }}>
          {Array.from({ length: 36 }).map((_, i) => (
            <span
              key={i}
              style={{
                fontSize: '16px',
                lineHeight: 1,
                marginTop: '-4px',
                display: 'inline-block',
                animation: `sway-grass ${1.5 + (i % 4) * 0.3}s ease-in-out infinite`,
                animationDelay: `${(i * 0.17) % 1.5}s`,
                transformOrigin: 'bottom center',
              }}
            >
              {i % 5 === 0 ? '🌸' : i % 7 === 0 ? '🌼' : '🌿'}
            </span>
          ))}
        </div>

        {/* 캐릭터들 */}
        {CHARACTERS.map((char, i) => (
          <span
            key={i}
            style={{
              position: 'absolute',
              bottom: '12px',
              left: 0,
              fontSize: `${char.size}rem`,
              lineHeight: 1,
              animation: `walk-left ${char.speed}s linear infinite`,
              animationDelay: `-${char.delay}s`,
              willChange: 'transform',
            }}
          >
            <span
              style={{
                display: 'inline-block',
                animation: `bob ${char.bob}s ease-in-out infinite`,
                animationDelay: `-${(char.delay * 0.3) % char.bob}s`,
              }}
            >
              {char.emoji}
            </span>
          </span>
        ))}
      </div>
    </>
  )
}
