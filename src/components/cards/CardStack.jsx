import { useState, useRef } from 'react'
import { getCat } from '../../data/categories'
import { useToast } from '../Toast'
import styles from './CardStack.module.css'

export default function CardStack({ catsSorted, total }) {
  const [currentIdx, setCurrentIdx] = useState(0)
  const showToast = useToast()

  const cards = catsSorted.map((item, rank) => {
    const c = getCat(item.cat)
    return { ...item, ...c, rank }
  })

  const visibleCards = cards.slice(currentIdx, currentIdx + 3)

  function handleSwipe(direction) {
    if (currentIdx < cards.length - 1) {
      setCurrentIdx(i => i + 1)
    }
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.viewport}>
        {[...visibleCards].reverse().map((card, revIdx) => {
          const stackIdx = visibleCards.length - 1 - revIdx
          const isTop = stackIdx === 0
          return (
            <SwipeCard
              key={card.cat}
              card={card}
              stackIdx={stackIdx}
              isTop={isTop}
              onSwipe={handleSwipe}
              onTap={() => showToast(`${card.emoji} ${card.cat} · ₹${card.amt.toLocaleString()}`)}
            />
          )
        })}
      </div>

      {currentIdx > 0 && (
        <div className={styles.resetRow}>
          <span onClick={() => setCurrentIdx(0)} className={styles.reset}>
            ↩ Start over
          </span>
        </div>
      )}
    </div>
  )
}

function SwipeCard({ card, stackIdx, isTop, onSwipe, onTap }) {
  const startX  = useRef(0)
  const dragging = useRef(false)
  const el       = useRef(null)

  const scale    = 1 - stackIdx * 0.04
  const topOff   = stackIdx * 13
  const opacity  = isTop ? 1 : 0.7

  const onStart = (x) => {
    startX.current  = x
    dragging.current = true
  }

  const onMove = (x) => {
    if (!dragging.current || !el.current) return
    const dx = x - startX.current
    el.current.style.transition = 'none'
    el.current.style.transform  = `scale(1) translateX(${dx}px) rotate(${dx * 0.03}deg)`
    el.current.style.opacity    = Math.max(0.3, 1 - Math.abs(dx) / 160)
  }

  const onEnd = (x) => {
    if (!dragging.current || !el.current) return
    dragging.current = false
    const dx = x - startX.current
    el.current.style.transition = ''

    if (Math.abs(dx) > 65) {
      el.current.style.transform = `translateX(${dx > 0 ? 420 : -420}px) rotate(${dx > 0 ? 18 : -18}deg)`
      el.current.style.opacity   = '0'
      setTimeout(() => onSwipe(dx > 0 ? 'right' : 'left'), 280)
    } else {
      el.current.style.transform = `scale(${scale})`
      el.current.style.opacity   = String(opacity)
      if (Math.abs(dx) < 8) onTap()
    }
  }

  return (
    <div
      ref={el}
      className={styles.card}
      style={{
        top:       topOff,
        transform: `scale(${scale})`,
        transformOrigin: 'center top',
        zIndex:    10 - stackIdx,
        background: card.bg,
        boxShadow: isTop
          ? `0 8px 32px ${card.color}28, 0 2px 8px rgba(0,0,0,.06)`
          : '0 2px 8px rgba(0,0,0,.03)',
        opacity,
        borderColor: `${card.color}20`,
      }}
      onMouseDown={e => {
        onStart(e.clientX)
        const mm = e2 => onMove(e2.clientX)
        const mu = e2 => { onEnd(e2.clientX); document.removeEventListener('mousemove', mm); document.removeEventListener('mouseup', mu) }
        document.addEventListener('mousemove', mm)
        document.addEventListener('mouseup', mu)
      }}
      onTouchStart={e => onStart(e.touches[0].clientX)}
      onTouchMove={e => onMove(e.touches[0].clientX)}
      onTouchEnd={e => onEnd(e.changedTouches[0].clientX)}
    >
      {isTop ? (
        <>
          <div>
            <div className={styles.badge} style={{ color: card.color }}>
              {card.rank === 0 ? 'Top spend' : 'Category'} · {card.pct}%
            </div>
            <div className={styles.cat} style={{ color: card.color }}>
              {card.emoji} {card.cat}
            </div>
            <div className={styles.sub} style={{ color: card.color }}>
              {card.items?.length ?? 1} transaction{(card.items?.length ?? 1) !== 1 ? 's' : ''}
            </div>
          </div>
          <div>
            <div className={styles.amt} style={{ color: card.color }}>
              ₹{card.amt.toLocaleString()}
            </div>
            <div className={styles.pct} style={{ color: card.color }}>
              {card.pct}% of total
            </div>
          </div>
        </>
      ) : (
        <>
          <div style={{ fontSize: 14, fontWeight: 500, color: `${card.color}99` }}>
            {card.emoji} {card.cat}
          </div>
          <div style={{ fontFamily: 'var(--fh)', fontSize: 16, fontWeight: 700, color: `${card.color}99` }}>
            ₹{card.amt.toLocaleString()}
          </div>
        </>
      )}
    </div>
  )
}
