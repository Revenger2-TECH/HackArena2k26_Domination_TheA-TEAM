import { User, Mail, Phone, MapPin, GraduationCap, BookOpen, Calendar, Settings, Bell, Shield, LogOut } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Profile() {
  const { user, logout } = useAuth()

  const attendanceThreshold = 85
  const notifications = [
    { id: 1, title: 'Attendance Alerts', enabled: true },
    { id: 2, title: 'Exam Reminders', enabled: true },
    { id: 3, title: 'Assignment Deadlines', enabled: true },
    { id: 4, title: 'Campus Notices', enabled: false },
    { id: 5, title: 'Lost & Found Updates', enabled: true }
  ]

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="glass-card p-6">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="w-32 h-32 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-5xl font-bold">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div className="text-center md:text-left flex-1">
            <h2 className="text-2xl font-bold">{user?.name || 'Student Name'}</h2>
            <p className="text-gray-400">{user?.email}</p>
            <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-4">
              <span className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm">
                {user?.usn || '2AG21CS001'}
              </span>
              <span className="px-3 py-1 bg-secondary/20 text-secondary rounded-full text-sm">
                {user?.branch || 'Computer Science'}
              </span>
              <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">
                {user?.year || '3rd Year'} - Section {user?.section || 'A'}
              </span>
            </div>
          </div>
          <button className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition">
            <Settings size={18} />
            Edit Profile
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Personal Info */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <User className="text-primary" /> Personal Information
          </h3>
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
              <Mail size={18} className="text-gray-400" />
              <div>
                <p className="text-sm text-gray-400">Email</p>
                <p>{user?.email || 'student@college.edu'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
              <Phone size={18} className="text-gray-400" />
              <div>
                <p className="text-sm text-gray-400">Phone</p>
                <p>+91 98765 43210</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
              <MapPin size={18} className="text-gray-400" />
              <div>
                <p className="text-sm text-gray-400">Address</p>
                <p>Hubli, Karnataka</p>
              </div>
            </div>
          </div>
        </div>

        {/* Academic Info */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <GraduationCap className="text-secondary" /> Academic Details
          </h3>
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
              <BookOpen size={18} className="text-gray-400" />
              <div>
                <p className="text-sm text-gray-400">Course</p>
                <p>Computer Science & Engineering</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
              <Calendar size={18} className="text-gray-400" />
              <div>
                <p className="text-sm text-gray-400">Semester</p>
                <p>5th Semester</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
              <GraduationCap size={18} className="text-gray-400" />
              <div>
                <p className="text-sm text-gray-400">CGPA</p>
                <p>8.2 / 10.0</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-bold mb-4">Quick Stats</h3>
          <div className="space-y-4">
            <div className="p-4 bg-primary/10 rounded-lg text-center">
              <p className="text-3xl font-bold text-primary">90%</p>
              <p className="text-sm text-gray-400">Attendance</p>
            </div>
            <div className="p-4 bg-secondary/10 rounded-lg text-center">
              <p className="text-3xl font-bold text-secondary">8.2</p>
              <p className="text-sm text-gray-400">Current SGPA</p>
            </div>
            <div className="p-4 bg-green-500/10 rounded-lg text-center">
              <p className="text-3xl font-bold text-green-400">12</p>
              <p className="text-sm text-gray-400">Days until Exams</p>
            </div>
          </div>
        </div>
      </div>

      {/* Settings */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
          <Bell className="text-primary" /> Notification Settings
        </h3>
        <div className="space-y-4">
          {notifications.map(notif => (
            <div key={notif.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
              <span>{notif.title}</span>
              <button className={`w-12 h-6 rounded-full transition ${
                notif.enabled ? 'bg-primary' : 'bg-gray-600'
              }`}>
                <div className={`w-5 h-5 bg-white rounded-full transition transform ${
                  notif.enabled ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-6 border-t border-white/10">
          <h4 className="text-sm text-gray-400 mb-4">Attendance Alert Threshold</h4>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min="50"
              max="100"
              value={attendanceThreshold}
              className="flex-1"
            />
            <span className="w-16 text-center font-bold">{attendanceThreshold}%</span>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Get notified when attendance drops below {attendanceThreshold}%
          </p>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="glass-card p-6 border border-red-500/30">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-red-400">
          <Shield className="text-red-400" /> Account Actions
        </h3>
        <div className="flex flex-wrap gap-4">
          <button className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition">
            <Shield size={18} />
            Change Password
          </button>
          <button 
            onClick={logout}
            className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </div>
    </div>
  )
}
