import styles from './BottomSheet.module.css'

export default function BottomSheet({ open, onClose, title, children }) {
  return (
    <>
      <div className={`${styles.overlay} ${open ? styles.open : ''}`} onClick={onClose} />
      <div className={`${styles.sheet} ${open ? styles.open : ''}`}>
        <div className={styles.handle} />
        <div className={styles.header}>
          <div className={styles.title}>{title}</div>
          <div className={styles.close} onClick={onClose}>✕</div>
        </div>
        {children}
      </div>
    </>
  )
}
