import './SkeletonLoader.css'

function SkeletonBlock({ width = '100%', height = 16, radius = 8, style = {} }) {
  return (
    <div
      className="skeleton-block"
      style={{ width, height, borderRadius: radius, ...style }}
    />
  )
}

export default function SkeletonLoader() {
  return (
    <div className="skeleton-wrap">

      {/* Greeting */}
      <div className="skeleton-greeting">
        <div>
          <SkeletonBlock width={120} height={14} />
          <SkeletonBlock width={200} height={24} style={{ marginTop: 8 }} radius={10} />
        </div>
        <SkeletonBlock width={40} height={40} radius={99} />
      </div>

      {/* Total card */}
      <div className="skeleton-card">
        <SkeletonBlock width={80} height={12} />
        <SkeletonBlock width={160} height={48} style={{ marginTop: 10 }} radius={12} />
        <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
          <SkeletonBlock width={100} height={28} radius={99} />
          <SkeletonBlock width={100} height={28} radius={99} />
        </div>
      </div>

      {/* Spend cards */}
      <div className="skeleton-stack">
        <SkeletonBlock width="100%" height={120} radius={20} />
      </div>

      {/* Period pills */}
      <div style={{ display: 'flex', gap: 8, padding: '0 16px', marginBottom: 16 }}>
        <SkeletonBlock width={80} height={32} radius={99} />
        <SkeletonBlock width={90} height={32} radius={99} />
        <SkeletonBlock width={90} height={32} radius={99} />
      </div>

      {/* Expense items */}
      <div className="skeleton-expenses">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="skeleton-expense-item">
            <SkeletonBlock width={44} height={44} radius={14} />
            <div style={{ flex: 1 }}>
              <SkeletonBlock width="60%" height={14} />
              <SkeletonBlock width="40%" height={11} style={{ marginTop: 6 }} />
            </div>
            <div style={{ textAlign: 'right' }}>
              <SkeletonBlock width={70} height={14} />
              <SkeletonBlock width={50} height={11} style={{ marginTop: 6 }} />
            </div>
          </div>
        ))}
      </div>

      {/* Syncing indicator */}
      <div className="skeleton-syncing">
        <div className="skeleton-syncing-dot" />
        Syncing from Google Drive...
      </div>

    </div>
  )
}