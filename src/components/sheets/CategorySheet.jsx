import { useState } from 'react'
import { GROUPS } from '../../data/categories'
import './Sheet.css'
import './CategorySheet.css'

export default function CategorySheet({ open, selected, onSelect, onClose }) {
  const [query, setQuery] = useState('')

  const filtered = query.trim()
    ? GROUPS.map((g) => ({ ...g, cats: g.cats.filter((c) => c.name.toLowerCase().includes(query.toLowerCase())) })).filter((g) => g.cats.length)
    : GROUPS

  return (
    <>
      <div className={`sheet-overlay ${open ? 'open' : ''}`} onClick={onClose} />
      <div className={`bottom-sheet ${open ? 'open' : ''}`}>
        <div className="sheet-handle" />
        <div className="sheet-header">
          <div className="sheet-title">Pick a category</div>
          <div className="sheet-close" onClick={onClose}>✕</div>
        </div>
        <div className="cat-sheet-inner">
          <div className="sheet-search-wrap">
            <input
              className="sheet-search"
              placeholder="Search categories…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <div id="sheetBody">
            {filtered.length === 0 && <div className="no-results">No results</div>}
            {filtered.map((g) => (
              <div key={g.label} className="cat-group">
                <div className="cat-group-label">{g.label}</div>
                <div className="cat-grid">
                  {g.cats.map((c) => (
                    <div
                      key={c.name}
                      className={`cat-cell ${selected?.name === c.name ? 'selected' : ''}`}
                      style={{ color: c.color }}
                      onClick={() => { onSelect(c); setQuery('') }}
                    >
                      <div className="cat-cell-emoji">{c.emoji}</div>
                      <div className="cat-cell-name">{c.name}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
