import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authApi } from '../api'
import { useAuth } from '../context/AuthContext'
import { Button, Input, Alert } from '../components/ui'

export default function RegisterPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', email: '', password: '', fullName: '' })
  const [errors, setErrors] = useState({})
  const [apiError, setApiError] = useState('')
  const [loading, setLoading] = useState(false)

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setApiError('')
    setErrors({})
    setLoading(true)
    try {
      const res = await authApi.register(form)
      login(res.data.data)
      navigate('/dashboard')
    } catch (err) {
      const data = err.response?.data
      if (data?.fieldErrors?.length) {
        const fe = {}
        data.fieldErrors.forEach(({ field, message }) => { fe[field] = message })
        setErrors(fe)
      } else {
        setApiError(data?.message || 'Registration failed. Please try again.')
      }
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
        <h1 style={styles.heading}>Create account</h1>
        <p style={styles.sub}>Free forever. No credit card needed.</p>

        {apiError && <Alert type="error">{apiError}</Alert>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <Input
            label="Full Name"
            type="text"
            placeholder="Jane Doe"
            value={form.fullName}
            onChange={set('fullName')}
            error={errors.fullName}
          />
          <Input
            label="Username"
            type="text"
            placeholder="jane_doe"
            value={form.username}
            onChange={set('username')}
            error={errors.username}
            required
          />
          <Input
            label="Email"
            type="email"
            placeholder="jane@example.com"
            value={form.email}
            onChange={set('email')}
            error={errors.email}
            required
          />
          <Input
            label="Password"
            type="password"
            placeholder="Min 8 chars, upper + lower + number"
            value={form.password}
            onChange={set('password')}
            error={errors.password}
            required
          />
          <Button type="submit" fullWidth loading={loading} size="lg">
            Create account
          </Button>
        </form>

        <p style={styles.footer}>
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
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
    width: '100%', maxWidth: 400,
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
}
