import './BottomNav.css'

const NAV_ITEMS = [
  { id: 'home',    icon: '🏠', label: 'Home'    },
  { id: 'history', icon: '📋', label: 'History' },
  { id: 'fab',     icon: '+',  label: null       },
  { id: 'receipt', icon: '🧾', label: 'Receipt' },
  { id: 'settings',icon: '⚙️', label: 'Settings'},
]

export default function BottomNav({ current, goTo }) {
  return (
    <div className="bnav">
      {NAV_ITEMS.map((item) =>
        item.id === 'fab' ? (
          <button key="fab" className="fab" onClick={() => goTo('home')}>
            +
          </button>
        ) : (
          <div
            key={item.id}
            className={`nav-item ${current === item.id ? 'active' : ''}`}
            onClick={() => goTo(item.id)}
          >
            <div className="nav-icon">{item.icon}</div>
            <div className="nav-label">{item.label}</div>
          </div>
        )
      )}
    </div>
  )
}
