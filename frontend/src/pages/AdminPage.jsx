import { useState, useEffect } from 'react'
import { adminApi } from '../api'
import { Badge, Spinner, Alert, Button } from '../components/ui'

export default function AdminPage() {
  const [tasks, setTasks]     = useState([])
  const [meta, setMeta]       = useState({ totalElements: 0, totalPages: 0, page: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState('')
  const [page, setPage]       = useState(0)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const res = await adminApi.getAllTasks({ page, size: 20 })
        const d = res.data.data
        setTasks(d.content)
        setMeta({ totalElements: d.totalElements, totalPages: d.totalPages, page: d.page })
      } catch {
        setError('Failed to load tasks')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [page])

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <span style={styles.pill}>Admin</span>
          <h1 style={styles.heading}>All Tasks</h1>
          <p style={styles.sub}>{meta.totalElements} tasks across all users</p>
        </div>
      </div>

      {error && <Alert type="error">{error}</Alert>}

      <div style={styles.tableWrap}>
        {loading ? (
          <div style={styles.center}><Spinner size={28} /></div>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                {['ID', 'Title', 'Owner', 'Status', 'Priority', 'Due Date', 'Created'].map(h => (
                  <th key={h} style={styles.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tasks.map(task => (
                <tr key={task.id} style={styles.tr}>
                  <td style={{ ...styles.td, color: 'var(--text-3)', fontFamily: 'var(--font-mono)', fontSize: 12 }}>
                    #{task.id}
                  </td>
                  <td style={styles.td}>
                    <span style={{ fontSize: 14, fontWeight: 500 }}>{task.title}</span>
                  </td>
                  <td style={styles.td}>
                    <div style={styles.avatarRow}>
                      <div style={styles.avatar}>{task.username?.[0]?.toUpperCase()}</div>
                      <span style={{ fontSize: 13 }}>{task.username}</span>
                    </div>
                  </td>
                  <td style={styles.td}><Badge value={task.status} /></td>
                  <td style={styles.td}><Badge value={task.priority} /></td>
                  <td style={{ ...styles.td, fontSize: 13, color: 'var(--text-2)' }}>
                    {task.dueDate
                      ? new Date(task.dueDate + 'T00:00:00').toLocaleDateString()
                      : <span style={{ color: 'var(--text-3)' }}>—</span>}
                  </td>
                  <td style={{ ...styles.td, fontSize: 12, color: 'var(--text-3)' }}>
                    {new Date(task.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {meta.totalPages > 1 && (
        <div style={styles.pagination}>
          <Button variant="secondary" size="sm" disabled={page === 0} onClick={() => setPage(p => p - 1)}>← Prev</Button>
          <span style={{ fontSize: 13, color: 'var(--text-2)' }}>Page {page + 1} of {meta.totalPages}</span>
          <Button variant="secondary" size="sm" disabled={page >= meta.totalPages - 1} onClick={() => setPage(p => p + 1)}>Next →</Button>
        </div>
      )}
    </div>
  )
}

const styles = {
  page:    { padding: '32px 36px', display: 'flex', flexDirection: 'column', gap: 24 },
  header:  { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' },
  pill: {
    display: 'inline-block', fontSize: 11, fontWeight: 600,
    background: 'rgba(239,68,68,0.12)', color: 'var(--danger)',
    padding: '3px 8px', borderRadius: 4, letterSpacing: '0.5px',
    textTransform: 'uppercase', marginBottom: 6,
  },
  heading: { fontSize: 24, fontWeight: 600, letterSpacing: '-0.5px' },
  sub:     { color: 'var(--text-2)', fontSize: 14, marginTop: 4 },
  tableWrap: {
    background: 'var(--bg-card)', border: '1px solid var(--border)',
    borderRadius: 'var(--radius-lg)', overflow: 'hidden', minHeight: 200,
  },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: {
    padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600,
    color: 'var(--text-3)', letterSpacing: '0.5px', textTransform: 'uppercase',
    borderBottom: '1px solid var(--border)', background: 'var(--bg)',
  },
  tr: { borderBottom: '1px solid var(--border)' },
  td: { padding: '13px 16px', verticalAlign: 'middle' },
  avatarRow: { display: 'flex', alignItems: 'center', gap: 8 },
  avatar: {
    width: 26, height: 26, borderRadius: '50%', background: 'var(--accent-bg)',
    color: 'var(--accent)', fontSize: 12, fontWeight: 600,
    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  center:     { display: 'flex', alignItems: 'center', justifyContent: 'center', height: 200 },
  pagination: { display: 'flex', alignItems: 'center', gap: 12, justifyContent: 'center' },
}
