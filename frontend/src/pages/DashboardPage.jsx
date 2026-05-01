import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { taskApi } from '../api'
import { useAuth } from '../context/AuthContext'
import { Card, Badge, Spinner, Button } from '../components/ui'

export default function DashboardPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState(null)
  const [recent, setRecent] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const [todoRes, doneRes, inProgRes, allRes] = await Promise.all([
          taskApi.getAll({ status: 'TODO',        size: 1 }),
          taskApi.getAll({ status: 'DONE',        size: 1 }),
          taskApi.getAll({ status: 'IN_PROGRESS', size: 1 }),
          taskApi.getAll({ size: 5, sortBy: 'createdAt', direction: 'desc' }),
        ])
        setStats({
          todo:       todoRes.data.data.totalElements,
          done:       doneRes.data.data.totalElements,
          inProgress: inProgRes.data.data.totalElements,
          total:      allRes.data.data.totalElements,
        })
        setRecent(allRes.data.data.content)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
      <Spinner size={32} />
    </div>
  )

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.heading}>{greeting}, {user?.fullName || user?.username} 👋</h1>
          <p style={styles.sub}>Here's what's on your plate today.</p>
        </div>
        <Button onClick={() => navigate('/tasks')}>+ New Task</Button>
      </div>

      <div style={styles.statGrid}>
        {[
          { label: 'Total Tasks',   value: stats?.total,      color: 'var(--accent)' },
          { label: 'To Do',         value: stats?.todo,       color: '#848ca8' },
          { label: 'In Progress',   value: stats?.inProgress, color: 'var(--info)' },
          { label: 'Completed',     value: stats?.done,       color: 'var(--success)' },
        ].map(({ label, value, color }) => (
          <div key={label} style={styles.statCard}>
            <div style={{ ...styles.statValue, color }}>{value ?? 0}</div>
            <div style={styles.statLabel}>{label}</div>
          </div>
        ))}
      </div>

      <Card>
        <div style={styles.sectionHead}>
          <h2 style={styles.sectionTitle}>Recent Tasks</h2>
          <Button variant="ghost" size="sm" onClick={() => navigate('/tasks')}>View all →</Button>
        </div>

        {recent.length === 0 ? (
          <div style={styles.empty}>
            <p style={{ color: 'var(--text-3)', fontSize: 14 }}>No tasks yet.</p>
            <Button size="sm" onClick={() => navigate('/tasks')}>Create your first task</Button>
          </div>
        ) : (
          <div style={styles.taskList}>
            {recent.map(task => (
              <div key={task.id} style={styles.taskRow}>
                <div style={styles.taskInfo}>
                  <span style={styles.taskTitle}>{task.title}</span>
                  <span style={styles.taskDate}>
                    {new Date(task.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
                <div style={styles.taskBadges}>
                  <Badge value={task.priority} />
                  <Badge value={task.status} />
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}

const styles = {
  page:   { padding: '32px 36px', display: 'flex', flexDirection: 'column', gap: 28, maxWidth: 900 },
  header: { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' },
  heading: { fontSize: 24, fontWeight: 600, letterSpacing: '-0.5px' },
  sub:     { color: 'var(--text-2)', fontSize: 14, marginTop: 4 },

  statGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 },
  statCard: {
    background: 'var(--bg-card)', border: '1px solid var(--border)',
    borderRadius: 'var(--radius-md)', padding: '20px 20px',
  },
  statValue: { fontSize: 32, fontWeight: 600, letterSpacing: '-1px', lineHeight: 1 },
  statLabel: { fontSize: 13, color: 'var(--text-2)', marginTop: 6 },

  sectionHead:  { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  sectionTitle: { fontSize: 15, fontWeight: 600 },

  taskList: { display: 'flex', flexDirection: 'column' },
  taskRow: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '12px 0', borderBottom: '1px solid var(--border)',
  },
  taskInfo: { display: 'flex', alignItems: 'center', gap: 16, flex: 1, minWidth: 0 },
  taskTitle: { fontSize: 14, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  taskDate:  { fontSize: 12, color: 'var(--text-3)', flexShrink: 0 },
  taskBadges: { display: 'flex', gap: 6, flexShrink: 0, marginLeft: 16 },

  empty: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, padding: '32px 0', color: 'var(--text-3)' },
}
