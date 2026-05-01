import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authApi } from '../api'
import { useAuth } from '../context/AuthContext'
import { Button, Input, Alert } from '../components/ui'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await authApi.login(form)
      login(res.data.data)
      navigate('/dashboard')
      console.log(res.data.data)
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Check your credentials.')
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.logo}>
          <span style={styles.logoIcon}>T</span>
          <span style={styles.logoText}>TaskFlow</span>
        </div>
        <h1 style={styles.heading}>Welcome back</h1>
        <p style={styles.sub}>Sign in to your account</p>

        {error && <Alert type="error">{error}</Alert>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <Input
            label="Username"
            type="text"
            placeholder="your_username"
            value={form.username}
            onChange={set('username')}
            required
            autoFocus
          />
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={form.password}
            onChange={set('password')}
            required
          />
          <Button type="submit" fullWidth loading={loading} size="lg">
            Sign in
          </Button>
        </form>

        <p style={styles.footer}>
          No account? <Link to="/register">Create one</Link>
        </p>

        <div style={styles.hint}>
          <span style={{ color: 'var(--text-3)', fontSize: 12 }}>
            Demo admin: <code style={{ color: 'var(--accent)', fontFamily: 'var(--font-mono)' }}>vikas_kumar / Vikas@123</code>
          </span>
        </div>
      </div>
    </div>
  )
}

const styles = {
  page: {
    minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: 'var(--bg)', padding: 16,
  },
  card: {
    width: '100%', maxWidth: 380,
    background: 'var(--bg-card)', border: '1px solid var(--border)',
    borderRadius: 'var(--radius-lg)', padding: '36px 32px',
    display: 'flex', flexDirection: 'column', gap: 16,
  },
  logo: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 },
  logoIcon: {
    width: 36, height: 36, borderRadius: 9, background: 'var(--accent)',
    color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontWeight: 700, fontSize: 18,
  },
  logoText: { fontWeight: 700, fontSize: 18, letterSpacing: '-0.4px' },
  heading: { fontSize: 22, fontWeight: 600, letterSpacing: '-0.4px', marginTop: 4 },
  sub: { fontSize: 14, color: 'var(--text-2)', marginTop: -8 },
  form: { display: 'flex', flexDirection: 'column', gap: 14, marginTop: 4 },
  footer: { fontSize: 13, color: 'var(--text-2)', textAlign: 'center' },
  hint: { textAlign: 'center', paddingTop: 4, borderTop: '1px solid var(--border)' },
}
