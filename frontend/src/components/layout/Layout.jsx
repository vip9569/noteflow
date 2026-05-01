import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: '⬡' },
  { to: '/tasks',     label: 'My Tasks',  icon: '✦' },
]

export default function Layout() {
  const { user, logout, isAdmin } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => { logout(); navigate('/login') }

  return (
    <div style={styles.shell}>
      <aside style={styles.sidebar}>
        <div style={styles.brand}>
          <span style={styles.brandIcon}>T</span>
          <span style={styles.brandName}>TaskFlow</span>
        </div>

        <nav style={styles.nav}>
          {navItems.map(({ to, label, icon }) => (
            <NavLink key={to} to={to} style={({ isActive }) => ({
              ...styles.navLink,
              ...(isActive ? styles.navLinkActive : {})
            })}>
              <span style={styles.navIcon}>{icon}</span>
              {label}
            </NavLink>
          ))}
          {isAdmin && (
            <NavLink to="/admin" style={({ isActive }) => ({
              ...styles.navLink,
              ...(isActive ? styles.navLinkActive : {})
            })}>
              <span style={styles.navIcon}>⬟</span>
              Admin
            </NavLink>
          )}
        </nav>

        <div style={styles.userSection}>
          <div style={styles.avatar}>
            {user?.username?.[0]?.toUpperCase() ?? 'U'}
          </div>
          <div style={styles.userInfo}>
            <div style={styles.userName}>{user?.username}</div>
            <div style={styles.userRole}>
              {user?.roles?.includes('ROLE_ADMIN') ? 'Admin' : 'User'}
            </div>
          </div>
          <button onClick={handleLogout} style={styles.logoutBtn} title="Logout">⏻</button>
        </div>
      </aside>

      <main style={styles.main}>
        <Outlet />
      </main>
    </div>
  )
}

const styles = {
  shell: { display: 'flex', height: '100vh', overflow: 'hidden' },
  sidebar: {
    width: 220, flexShrink: 0, background: 'var(--bg-card)',
    borderRight: '1px solid var(--border)', display: 'flex',
    flexDirection: 'column', padding: '0 0 16px',
  },
  brand: {
    display: 'flex', alignItems: 'center', gap: 10,
    padding: '24px 20px 20px', borderBottom: '1px solid var(--border)',
  },
  brandIcon: {
    width: 32, height: 32, borderRadius: 8,
    background: 'var(--accent)', color: '#fff',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontWeight: 600, fontSize: 16,
  },
  brandName: { fontWeight: 600, fontSize: 16, letterSpacing: '-0.3px' },
  nav: { flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: 4 },
  navLink: {
    display: 'flex', alignItems: 'center', gap: 10,
    padding: '9px 12px', borderRadius: 'var(--radius-sm)',
    color: 'var(--text-2)', fontSize: 14, fontWeight: 500,
    transition: 'all 0.15s', textDecoration: 'none',
  },
  navLinkActive: {
    background: 'var(--accent-bg)', color: 'var(--accent)',
  },
  navIcon: { fontSize: 14, width: 16, textAlign: 'center' },
  userSection: {
    display: 'flex', alignItems: 'center', gap: 10,
    padding: '12px 16px', margin: '0 12px',
    background: 'var(--bg-input)', borderRadius: 'var(--radius-sm)',
  },
  avatar: {
    width: 30, height: 30, borderRadius: '50%',
    background: 'var(--accent)', color: '#fff',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontWeight: 600, fontSize: 13, flexShrink: 0,
  },
  userInfo: { flex: 1, minWidth: 0 },
  userName: { fontSize: 13, fontWeight: 500, truncate: true, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  userRole: { fontSize: 11, color: 'var(--text-3)' },
  logoutBtn: {
    background: 'none', color: 'var(--text-3)', fontSize: 16,
    padding: 4, borderRadius: 4, flexShrink: 0,
    transition: 'color 0.15s',
  },
  main: { flex: 1, overflow: 'auto', background: 'var(--bg)' },
}
