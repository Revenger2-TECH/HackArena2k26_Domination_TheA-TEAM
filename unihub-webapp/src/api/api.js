import axios from 'axios'

const API_URL = 'http://localhost:5000/api'

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' }
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password })
}

export const studentAPI = {
  getProfile: () => api.get('/student/profile')
}

export const subjectsAPI = {
  getAll: () => api.get('/subjects')
}

export const attendanceAPI = {
  getSummary: () => api.get('/attendance'),
  getActive: () => api.get('/attendance/active'),
  scanQR: (qrCode) => api.post('/attendance/scan', { qrCode })
}

export const academicAPI = {
  getMarks: () => api.get('/academic/marks'),
  calculateGPA: (targetGPA) => api.post('/academic/calculate-gpa', { targetGPA })
}

export const campusAPI = {
  getNotices: () => api.get('/campus/notices'),
  getLostFound: () => api.get('/campus/lost-found'),
  getCanteen: () => api.get('/campus/canteen'),
  getLibrary: () => api.get('/campus/library')
}

export default api
