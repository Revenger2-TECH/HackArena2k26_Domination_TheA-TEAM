import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { LayoutDashboard, QrCode, GraduationCap, Building2, User, LogOut, Bell, Menu, X, Monitor } from 'lucide-react'
import { useState } from 'react'

const navItems = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/attendance', icon: QrCode, label: 'Attendance' },
  { path: '/academic', icon: GraduationCap, label: 'Academic' },
  { path: '/campus', icon: Building2, label: 'Campus Feed' },
  { path: '/faculty', icon: Monitor, label: 'Faculty Panel' },
  { path: '/profile', icon: User, label: 'Profile' }
]

export default function Layout() {
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = () => { logout(); navigate('/login') }

  return (
    <div className="flex min-h-screen">
      <button className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-darker rounded-lg" onClick={() => setSidebarOpen(!sidebarOpen)}>
        {sidebarOpen ? <X /> : <Menu />}
      </button>

      <aside className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-darker border-r border-white/10 transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-6">
          <h1 className="text-2xl font-bold gradient-text mb-8">UniHub</h1>
          
          <nav className="space-y-2">
            {navItems.map(({ path, icon: Icon, label }) => (
              <Link key={path} to={path} onClick={() => setSidebarOpen(false)} className={`sidebar-link ${location.pathname === path ? 'active' : ''}`}>
                <Icon size={20} /><span>{label}</span>
              </Link>
            ))}
          </nav>

          <div className="mt-8 pt-6 border-t border-white/10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">{user?.name?.charAt(0) || 'U'}</div>
              <div>
                <p className="font-medium text-sm">{user?.name || 'Student'}</p>
                <p className="text-xs text-gray-400">{user?.branch || ''}</p>
              </div>
            </div>
            <button onClick={handleLogout} className="sidebar-link w-full text-gray-400 hover:text-primary">
              <LogOut size={20} /><span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      <main className="flex-1 p-4 lg:p-8">
        <header className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold">{navItems.find(n => n.path === location.pathname)?.label || 'Dashboard'}</h2>
            <p className="text-gray-400 text-sm">{user?.branch} • {user?.year ? `${user.year}rd Year` : ''} • Section {user?.section || 'A'}</p>
          </div>
          <button className="relative p-3 glass-card hover:bg-white/10 transition">
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full"></span>
          </button>
        </header>
        <Outlet />
      </main>

      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />}
    </div>
  )
}