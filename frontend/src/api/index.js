import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
})

// Attach JWT to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Handle 401 globally — redirect to login
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

// ── Auth ──────────────────────────────────────────────────────────

export const authApi = {
  register: (data) => api.post('/v1/auth/register', data),
  login:    (data) => api.post('/v1/auth/login', data),
}

// ── Tasks ─────────────────────────────────────────────────────────

export const taskApi = {
  getAll: (params) => api.get('/v1/tasks', { params }),
  getById: (id)    => api.get(`/v1/tasks/${id}`),
  create:  (data)  => api.post('/v1/tasks', data),
  update:  (id, data) => api.patch(`/v1/tasks/${id}`, data),
  delete:  (id)    => api.delete(`/v1/tasks/${id}`),
}

// ── Admin ─────────────────────────────────────────────────────────

export const adminApi = {
  getAllTasks: (params) => api.get('/v1/admin/tasks', { params }),
}

export default api
