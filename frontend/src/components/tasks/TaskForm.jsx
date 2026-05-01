import { useState, useEffect } from 'react'
import { taskApi } from '../../api'
import { Button, Input, Select, Alert, Modal } from '../ui'

export default function TaskForm({ task, onSuccess, onClose }) {
  const isEdit = !!task
  const [form, setForm] = useState({
    title:       task?.title       ?? '',
    description: task?.description ?? '',
    status:      task?.status      ?? 'TODO',
    priority:    task?.priority    ?? 'MEDIUM',
    dueDate:     task?.dueDate     ?? '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const payload = { ...form, dueDate: form.dueDate || null }
      if (isEdit) {
        await taskApi.update(task.id, payload)
      } else {
        await taskApi.create(payload)
      }
      onSuccess()
    } catch (err) {
      const data = err.response?.data
      setError(data?.message || 'Failed to save task')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal title={isEdit ? 'Edit Task' : 'New Task'} onClose={onClose}>
      {error && <div style={{ marginBottom: 16 }}><Alert type="error">{error}</Alert></div>}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <Input
          label="Title *"
          type="text"
          placeholder="What needs to be done?"
          value={form.title}
          onChange={set('title')}
          required
          autoFocus
        />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-2)' }}>Description</label>
          <textarea
            rows={3}
            placeholder="Optional details..."
            value={form.description}
            onChange={set('description')}
            style={{ resize: 'vertical', minHeight: 72 }}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <Select label="Status" value={form.status} onChange={set('status')}>
            <option value="TODO">To Do</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="DONE">Done</option>
          </Select>
          <Select label="Priority" value={form.priority} onChange={set('priority')}>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </Select>
        </div>

        <Input
          label="Due Date"
          type="date"
          value={form.dueDate}
          onChange={set('dueDate')}
        />

        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 4 }}>
          <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit" loading={loading}>
            {isEdit ? 'Save Changes' : 'Create Task'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
