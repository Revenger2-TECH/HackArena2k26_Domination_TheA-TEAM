import { QrCode, Calendar, TrendingUp, Bell, BookOpen, Clock, AlertCircle } from 'lucide-react'
import { Link } from 'react-router-dom'

const todayClasses = [
  { time: '09:00 AM', subject: 'Data Structures', room: 'C-301', status: 'completed' },
  { time: '10:30 AM', subject: 'Database Systems', room: 'C-302', status: 'current' },
  { time: '12:00 PM', subject: 'Web Technologies', room: 'C-303', status: 'upcoming' },
  { time: '02:00 PM', subject: 'Mathematics', room: 'C-304', status: 'upcoming' }
]

const upcomingEvents = [
  { title: 'Internal Exam - 1', date: 'Dec 15, 2026', daysLeft: 5 },
  { title: 'Lab Submission', date: 'Dec 18, 2026', daysLeft: 8 },
  { title: 'Semester Fee Due', date: 'Dec 20, 2026', daysLeft: 10 }
]

const recentNotices = [
  { title: 'Holiday on Dec 25th', time: '2 hours ago', type: 'notice' },
  { title: 'New Library Books Added', time: '5 hours ago', type: 'library' },
  { title: 'Lost Item: Blue Water Bottle', time: '1 day ago', type: 'lost' }
]

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat-card">
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-400 text-sm">Attendance</span>
            <span className="p-2 bg-primary/20 rounded-lg">
              <QrCode size={20} className="text-primary" />
            </span>
          </div>
          <p className="text-3xl font-bold text-white">85.5%</p>
          <p className="text-sm text-green-400 mt-1">↑ 2.5% this month</p>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-400 text-sm">Current GPA</span>
            <span className="p-2 bg-secondary/20 rounded-lg">
              <TrendingUp size={20} className="text-secondary" />
            </span>
          </div>
          <p className="text-3xl font-bold text-white">8.2</p>
          <p className="text-sm text-gray-400 mt-1">Target: 8.5 GPA</p>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-400 text-sm">Classes Today</span>
            <span className="p-2 bg-green-500/20 rounded-lg">
              <Calendar size={20} className="text-green-400" />
            </span>
          </div>
          <p className="text-3xl font-bold text-white">4</p>
          <p className="text-sm text-gray-400 mt-1">2 completed, 2 remaining</p>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-400 text-sm">New Notices</span>
            <span className="p-2 bg-yellow-500/20 rounded-lg">
              <Bell size={20} className="text-yellow-400" />
            </span>
          </div>
          <p className="text-3xl font-bold text-white">3</p>
          <p className="text-sm text-gray-400 mt-1">Since yesterday</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-bold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link to="/attendance" className="flex flex-col items-center p-4 rounded-lg bg-white/5 hover:bg-white/10 transition">
            <QrCode size={32} className="text-primary mb-2" />
            <span className="text-sm font-medium">Scan Attendance</span>
          </Link>
          <Link to="/academic" className="flex flex-col items-center p-4 rounded-lg bg-white/5 hover:bg-white/10 transition">
            <BookOpen size={32} className="text-secondary mb-2" />
            <span className="text-sm font-medium">View Marks</span>
          </Link>
          <Link to="/campus" className="flex flex-col items-center p-4 rounded-lg bg-white/5 hover:bg-white/10 transition">
            <AlertCircle size={32} className="text-yellow-400 mb-2" />
            <span className="text-sm font-medium">Lost & Found</span>
          </Link>
          <Link to="/campus" className="flex flex-col items-center p-4 rounded-lg bg-white/5 hover:bg-white/10 transition">
            <Clock size={32} className="text-green-400 mb-2" />
            <span className="text-sm font-medium">Canteen Menu</span>
          </Link>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Schedule */}
        <div className="lg:col-span-2 glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold">Today's Classes</h3>
            <span className="text-sm text-gray-400">March 24, 2026</span>
          </div>
          <div className="space-y-3">
            {todayClasses.map((cls, index) => (
              <div 
                key={index}
                className={`flex items-center gap-4 p-4 rounded-lg transition ${
                  cls.status === 'current' ? 'bg-primary/20 border border-primary' :
                  cls.status === 'completed' ? 'bg-green-500/10' : 'bg-white/5'
                }`}
              >
                <div className={`w-1 h-12 rounded-full ${
                  cls.status === 'current' ? 'bg-primary' :
                  cls.status === 'completed' ? 'bg-green-400' : 'bg-gray-500'
                }`} />
                <div className="flex-1">
                  <p className={`font-medium ${cls.status === 'completed' ? 'text-gray-400' : 'text-white'}`}>
                    {cls.subject}
                  </p>
                  <p className="text-sm text-gray-400">{cls.room}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">{cls.time}</p>
                  <p className={`text-xs ${
                    cls.status === 'current' ? 'text-primary' :
                    cls.status === 'completed' ? 'text-green-400' : 'text-gray-500'
                  }`}>
                    {cls.status === 'current' ? 'In Progress' : cls.status === 'completed' ? 'Completed' : 'Upcoming'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Upcoming Deadlines */}
          <div className="glass-card p-6">
            <h3 className="text-lg font-bold mb-4">Upcoming Deadlines</h3>
            <div className="space-y-4">
              {upcomingEvents.map((event, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="p-2 bg-primary/20 rounded-lg">
                    <Calendar size={16} className="text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{event.title}</p>
                    <p className="text-xs text-gray-400">{event.date}</p>
                  </div>
                  <span className="ml-auto text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">
                    {event.daysLeft}d
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Notices */}
          <div className="glass-card p-6">
            <h3 className="text-lg font-bold mb-4">Recent Updates</h3>
            <div className="space-y-4">
              {recentNotices.map((notice, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className={`w-2 h-2 mt-2 rounded-full ${
                    notice.type === 'notice' ? 'bg-blue-400' :
                    notice.type === 'library' ? 'bg-green-400' : 'bg-yellow-400'
                  }`} />
                  <div>
                    <p className="font-medium text-sm">{notice.title}</p>
                    <p className="text-xs text-gray-400">{notice.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
