import { useState, useRef } from 'react'
import { getCat } from '../../data/categories'
import './CardStack.css'

function SpendCard({ card, onSwipe, onTap, isTop, offset }) {
  const startX = useRef(null)
  const el = useRef(null)
  const c = getCat(card.cat)

  const handleStart = (x) => { startX.current = x }

  const handleMove = (x) => {
    if (startX.current === null || !el.current || !isTop) return
    const dx = x - startX.current
    el.current.style.transition = 'none'
    el.current.style.transform = `scale(1) translateX(${dx}px) rotate(${dx * 0.03}deg)`
    el.current.style.opacity = Math.max(0.3, 1 - Math.abs(dx) / 160)
  }

  const handleEnd = (x) => {
    if (startX.current === null) return
    const dx = x - startX.current
    startX.current = null
    if (!el.current) return
    el.current.style.transition = ''

    if (Math.abs(dx) > 65) {
      el.current.style.transform = `translateX(${dx > 0 ? 420 : -420}px) rotate(${dx > 0 ? 18 : -18}deg)`
      el.current.style.opacity = '0'
      setTimeout(onSwipe, 280)
    } else {
      el.current.style.transform = `scale(${1 - offset * 0.04})`
      el.current.style.opacity = isTop ? '1' : '0.7'
      if (Math.abs(dx) < 8) onTap?.()
    }
  }

  return (
    <div
      ref={el}
      className="spend-card"
      style={{
        top: `${offset * 13}px`,
        transform: `scale(${1 - offset * 0.04})`,
        transformOrigin: 'center top',
        zIndex: 10 - offset,
        background: c.bg,
        boxShadow: isTop
          ? `0 8px 32px ${c.color}28, 0 2px 8px rgba(0,0,0,0.06)`
          : '0 2px 8px rgba(0,0,0,0.03)',
        opacity: isTop ? 1 : 0.7,
        borderColor: `${c.color}20`,
      }}
      onMouseDown={(e) => handleStart(e.clientX)}
      onMouseMove={(e) => { if (e.buttons === 1) handleMove(e.clientX) }}
      onMouseUp={(e) => handleEnd(e.clientX)}
      onTouchStart={(e) => handleStart(e.touches[0].clientX)}
      onTouchMove={(e) => handleMove(e.touches[0].clientX)}
      onTouchEnd={(e) => handleEnd(e.changedTouches[0].clientX)}
    >
      {isTop ? (
        <>
          <div>
            <div className="card-badge" style={{ color: c.color }}>
              {card.rank === 0 ? 'Top spend' : 'Category'} · {card.pct}%
            </div>
            <div className="card-cat" style={{ color: c.color }}>
              {c.emoji} {card.cat}
            </div>
            <div className="card-sub" style={{ color: c.color }}>
              {card.items.length} transaction{card.items.length !== 1 ? 's' : ''}
            </div>
          </div>
          <div>
            <div className="card-amt" style={{ color: c.color }}>
              ₹{card.amt.toLocaleString()}
            </div>
            <div className="card-pct" style={{ color: c.color }}>
              {card.pct}% of total
            </div>
          </div>
        </>
      ) : (
        <>
          <div style={{ fontSize: 14, fontWeight: 500, color: `${c.color}99` }}>
            {c.emoji} {card.cat}
          </div>
          <div style={{ fontFamily: 'var(--fh)', fontSize: 16, fontWeight: 700, color: `${c.color}99` }}>
            ₹{card.amt.toLocaleString()}
          </div>
        </>
      )}
    </div>
  )
}

export default function CardStack({ cardData, showToast, onCardTap }) {
  const [current, setCurrent] = useState(0)

  const visible = cardData.slice(current, current + 3)

  return (
    <div className="stack-section">
      <div className="stack-viewport">
        {[...visible].reverse().map((card, ri) => {
          const offset = visible.length - 1 - ri
          return (
            <SpendCard
              key={card.cat}
              card={card}
              offset={offset}
              isTop={offset === 0}
              onSwipe={() => {
                if (current < cardData.length - 1) setCurrent((c) => c + 1)
              }}
              onTap={() => onCardTap?.(card.cat)}
            />
          )
        })}
      </div>
      {current > 0 && (
        <div className="stack-reset" onClick={() => setCurrent(0)}>
          ↩ Start over
        </div>
      )}
    </div>
  )
}
