import { createContext, useContext, useState, useEffect } from 'react'
import { authAPI } from '../api/api'
import { getSocket } from '../hooks/useSocket'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const savedUser = localStorage.getItem('user')
    if (token && savedUser) {
      const userData = JSON.parse(savedUser)
      setUser(userData)
      setTimeout(() => {
        const socket = getSocket()
        if (socket) socket.emit('register', { userId: userData.id, role: userData.role })
      }, 1000)
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    const response = await authAPI.login(email, password)
    const { token, user: userData } = response.data
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(userData))
    setUser(userData)
    setTimeout(() => {
      const socket = getSocket()
      if (socket) socket.emit('register', { userId: userData.id, role: userData.role })
    }, 500)
    return userData
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() { return useContext(AuthContext) }
