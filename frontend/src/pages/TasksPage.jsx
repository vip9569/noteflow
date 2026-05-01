import { useState, useEffect, useCallback } from 'react'
import { taskApi } from '../api'
import { Button, Badge, Spinner, Alert, Select } from '../components/ui'
import TaskForm from '../components/tasks/TaskForm'

export default function TasksPage() {
  const [tasks, setTasks]     = useState([])
  const [meta, setMeta]       = useState({ totalElements: 0, totalPages: 0, page: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editTask, setEditTask]  = useState(null)
  const [deleting, setDeleting]  = useState(null)

  const [filters, setFilters] = useState({
    status: '', search: '', page: 0, size: 10,
    sortBy: 'createdAt', direction: 'desc',
  })

  const loadTasks = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const params = { ...filters, status: filters.status || undefined, search: filters.search || undefined }
      const res = await taskApi.getAll(params)
      const d = res.data.data
      setTasks(d.content)
      setMeta({ totalElements: d.totalElements, totalPages: d.totalPages, page: d.page })
    } catch (e) {
      setError('Failed to load tasks')
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => { loadTasks() }, [loadTasks])

  const setFilter = (k) => (e) =>
    setFilters(f => ({ ...f, [k]: e.target.value, page: 0 }))

  const handleDelete = async (id) => {
    if (!confirm('Delete this task?')) return
    setDeleting(id)
    try {
      await taskApi.delete(id)
      loadTasks()
    } catch {
      setError('Failed to delete task')
    } finally {
      setDeleting(null)
    }
  }

  const openEdit = (task) => { setEditTask(task); setShowForm(true) }
  const openNew  = ()     => { setEditTask(null);  setShowForm(true) }
  const closeForm = () => { setShowForm(false); setEditTask(null) }
  const onSuccess = () => { closeForm(); loadTasks() }

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.heading}>My Tasks</h1>
          <p style={styles.sub}>{meta.totalElements} task{meta.totalElements !== 1 ? 's' : ''} total</p>
        </div>
        <Button onClick={openNew}>+ New Task</Button>
      </div>

      {/* Filters */}
      <div style={styles.filterBar}>
        <input
          style={styles.search}
          type="text"
          placeholder="Search tasks..."
          value={filters.search}
          onChange={setFilter('search')}
        />
        <Select value={filters.status} onChange={setFilter('status')} style={{ width: 150 }}>
          <option value="">All statuses</option>
          <option value="TODO">To Do</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="DONE">Done</option>
        </Select>
        <Select value={filters.sortBy} onChange={setFilter('sortBy')} style={{ width: 150 }}>
          <option value="createdAt">Date Created</option>
          <option value="updatedAt">Last Updated</option>
          <option value="dueDate">Due Date</option>
          <option value="priority">Priority</option>
        </Select>
        <Select value={filters.direction} onChange={setFilter('direction')} style={{ width: 110 }}>
          <option value="desc">Newest</option>
          <option value="asc">Oldest</option>
        </Select>
      </div>

      {error && <Alert type="error">{error}</Alert>}

      {/* Task list */}
      <div style={styles.tableWrap}>
        {loading ? (
          <div style={styles.center}><Spinner size={28} /></div>
        ) : tasks.length === 0 ? (
          <div style={styles.empty}>
            <span style={{ fontSize: 32 }}>📋</span>
            <p style={{ color: 'var(--text-2)', fontSize: 15 }}>
              {filters.search || filters.status ? 'No tasks match your filters.' : 'No tasks yet. Create one!'}
            </p>
            {!filters.search && !filters.status && (
              <Button onClick={openNew}>+ Create Task</Button>
            )}
          </div>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                {['Title', 'Status', 'Priority', 'Due Date', 'Created', 'Actions'].map(h => (
                  <th key={h} style={styles.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tasks.map(task => (
                <tr key={task.id} style={styles.tr}>
                  <td style={styles.td}>
                    <div style={styles.titleCell}>
                      <span style={{
                        ...styles.taskTitle,
                        textDecoration: task.status === 'DONE' ? 'line-through' : 'none',
                        color: task.status === 'DONE' ? 'var(--text-3)' : undefined,
                      }}>
                        {task.title}
                      </span>
                      {task.description && (
                        <span style={styles.taskDesc}>{task.description}</span>
                      )}
                    </div>
                  </td>
                  <td style={styles.td}><Badge value={task.status} /></td>
                  <td style={styles.td}><Badge value={task.priority} /></td>
                  <td style={{ ...styles.td, color: 'var(--text-2)', fontSize: 13 }}>
                    {task.dueDate
                      ? new Date(task.dueDate + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                      : <span style={{ color: 'var(--text-3)' }}>—</span>}
                  </td>
                  <td style={{ ...styles.td, color: 'var(--text-3)', fontSize: 12 }}>
                    {new Date(task.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </td>
                  <td style={styles.td}>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <Button variant="ghost" size="sm" onClick={() => openEdit(task)}>Edit</Button>
                      <Button
                        variant="danger" size="sm"
                        loading={deleting === task.id}
                        onClick={() => handleDelete(task.id)}
                      >
                        Del
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {meta.totalPages > 1 && (
        <div style={styles.pagination}>
          <Button
            variant="secondary" size="sm"
            disabled={meta.page === 0}
            onClick={() => setFilters(f => ({ ...f, page: f.page - 1 }))}
          >← Prev</Button>
          <span style={{ fontSize: 13, color: 'var(--text-2)' }}>
            Page {meta.page + 1} of {meta.totalPages}
          </span>
          <Button
            variant="secondary" size="sm"
            disabled={meta.page >= meta.totalPages - 1}
            onClick={() => setFilters(f => ({ ...f, page: f.page + 1 }))}
          >Next →</Button>
        </div>
      )}

      {/* Modal */}
      {showForm && <TaskForm task={editTask} onSuccess={onSuccess} onClose={closeForm} />}
    </div>
  )
}

const styles = {
  page:      { padding: '32px 36px', display: 'flex', flexDirection: 'column', gap: 24 },
  header:    { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' },
  heading:   { fontSize: 24, fontWeight: 600, letterSpacing: '-0.5px' },
  sub:       { color: 'var(--text-2)', fontSize: 14, marginTop: 4 },
  filterBar: { display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' },
  search:    { flex: 1, minWidth: 200 },
  tableWrap: {
    background: 'var(--bg-card)', border: '1px solid var(--border)',
    borderRadius: 'var(--radius-lg)', overflow: 'hidden', minHeight: 200,
  },
  table:     { width: '100%', borderCollapse: 'collapse' },
  th: {
    padding: '12px 16px', textAlign: 'left', fontSize: 12,
    fontWeight: 600, color: 'var(--text-3)', letterSpacing: '0.5px', textTransform: 'uppercase',
    borderBottom: '1px solid var(--border)', background: 'var(--bg)',
  },
  tr: { borderBottom: '1px solid var(--border)', transition: 'background 0.1s' },
  td: { padding: '14px 16px', verticalAlign: 'middle' },
  titleCell: { display: 'flex', flexDirection: 'column', gap: 2 },
  taskTitle: { fontSize: 14, fontWeight: 500 },
  taskDesc:  { fontSize: 12, color: 'var(--text-3)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 240 },
  center:    { display: 'flex', alignItems: 'center', justifyContent: 'center', height: 200 },
  empty:     { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, height: 200 },
  pagination:{ display: 'flex', alignItems: 'center', gap: 12, justifyContent: 'center' },
}
