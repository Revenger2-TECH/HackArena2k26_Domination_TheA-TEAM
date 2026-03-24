import { useState, useEffect } from 'react'
import { QrCode, Users, FileText, CheckCircle, Clock, MapPin, RefreshCw, Monitor, BarChart3, Wifi, UserCheck } from 'lucide-react'
import { useSocket } from '../hooks/useSocket'

export default function FacultyDashboard() {
  const [activeTab, setActiveTab] = useState('qr')
  const [selectedSubject, setSelectedSubject] = useState('')
  const [subjects, setSubjects] = useState([])
  const [generatedQR, setGeneratedQR] = useState(null)
  const [activeQRCodes, setActiveQRCodes] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [countdown, setCountdown] = useState(0)
  const [liveAttendance, setLiveAttendance] = useState({})
  const { isConnected, on } = useSocket()

  useEffect(() => {
    fetchSubjects()
    loadActiveQRCodes()

    const unsubAttendance = on('attendance:marked', (data) => {
      setLiveAttendance(prev => ({
        ...prev,
        [data.subjectId]: [...(prev[data.subjectId] || []), data]
      }))
    })

    const interval = setInterval(() => {
      loadActiveQRCodes()
      updateCountdown()
    }, 5000)
    return () => {
      clearInterval(interval)
      unsubAttendance()
    }
  }, [])

  const fetchSubjects = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/subjects', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
      if (response.ok) {
        const data = await response.json()
        setSubjects(data)
      }
    } catch (err) {
      console.error('Failed to fetch subjects:', err)
    }
  }

  const loadActiveQRCodes = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/faculty/active-qrs', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
      if (response.ok) {
        const data = await response.json()
        setActiveQRCodes(data.activeQRCodes || [])
      }
    } catch (err) {
      console.error('Failed to load:', err)
    }
  }

  const updateCountdown = () => {
    if (generatedQR) {
      const expires = new Date(generatedQR.expiresAt).getTime()
      const now = Date.now()
      const remaining = Math.max(0, Math.floor((expires - now) / 1000))
      setCountdown(remaining)
    }
  }

  const generateQR = async () => {
    if (!selectedSubject) return
    setLoading(true)
    setError('')
    
    const subject = subjects.find(s => s.id === selectedSubject)
    
    try {
      const response = await fetch('http://localhost:5000/api/faculty/generate-qr', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ subjectId: selectedSubject, room: subject.room })
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        setError(data.error || 'Failed to generate QR')
      } else {
        setGeneratedQR(data)
        setCountdown(300)
        loadActiveQRCodes()
      }
    } catch (err) {
      setError('Network error. Is the API running?')
    } finally {
      setLoading(false)
    }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const tabs = [
    { id: 'qr', icon: QrCode, label: 'Generate QR' },
    { id: 'attendance', icon: BarChart3, label: 'View Attendance' },
    { id: 'students', icon: Users, label: 'My Students' }
  ]

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex gap-2 glass-card p-2">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
              activeTab === tab.id ? 'bg-primary text-white' : 'hover:bg-white/10'
            }`}
          >
            <tab.icon size={18} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* QR Generation Tab */}
      {activeTab === 'qr' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Controls */}
          <div className="glass-card p-6">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <Monitor className="text-primary" />
              Start Attendance Session
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Select Subject</label>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg py-3 px-4 text-white"
                >
                  <option value="">-- Choose Subject --</option>
                  {subjects.map(sub => (
                    <option key={sub.id} value={sub.id}>
                      {sub.code} - {sub.name} ({sub.students || 40} students)
                    </option>
                  ))}
                </select>
              </div>

              {selectedSubject && subjects.find(s => s.id === selectedSubject) && (
                <div className="p-4 bg-white/5 rounded-lg space-y-2">
                  <div className="flex items-center gap-3">
                    <FileText size={18} className="text-gray-400" />
                    <span>{subjects.find(s => s.id === selectedSubject)?.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin size={18} className="text-gray-400" />
                    <span>Room: {subjects.find(s => s.id === selectedSubject)?.room}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Users size={18} className="text-gray-400" />
                    <span>{subjects.find(s => s.id === selectedSubject)?.students || 40} Students</span>
                  </div>
                </div>
              )}

              {error && (
                <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm">
                  {error}
                </div>
              )}

              <button
                onClick={generateQR}
                disabled={!selectedSubject || loading}
                className="w-full bg-primary hover:bg-secondary disabled:opacity-50 py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition"
              >
                {loading ? (
                  <><RefreshCw className="animate-spin" size={20} /> Generating...</>
                ) : (
                  <><QrCode size={20} /> Generate Attendance QR</>
                )}
              </button>

              <p className="text-sm text-gray-400 text-center">
                QR code will be active for 5 minutes
              </p>
            </div>
          </div>

          {/* QR Display */}
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold">Live QR Code</h3>
              <span className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full ${isConnected ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                <Wifi size={12} /> {isConnected ? 'Live' : 'Offline'}
              </span>
            </div>
            
            {generatedQR ? (
              <div className="text-center">
                <div className="relative inline-block">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=280x280&data=${encodeURIComponent(generatedQR.qrCode)}`}
                    alt="QR Code"
                    className="w-64 h-64 mx-auto border-4 border-primary rounded-xl"
                  />
                  <div className="absolute -top-3 -right-3 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                    <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                    LIVE
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-green-500/10 rounded-lg border border-green-500/30">
                  <p className="text-green-400 font-bold text-lg">{generatedQR.subject}</p>
                  <p className="text-3xl font-bold text-white mt-2">{formatTime(countdown)}</p>
                  <p className="text-gray-400 text-sm">Time Remaining</p>
                </div>

                <div className="mt-4 p-4 bg-primary/10 rounded-lg border border-primary/30">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <UserCheck size={20} className="text-primary" />
                    <span className="text-primary font-bold text-2xl">{liveAttendance[selectedSubject]?.length || 0}</span>
                    <span className="text-gray-400">students marked</span>
                  </div>
                  {liveAttendance[selectedSubject]?.length > 0 && (
                    <div className="flex flex-wrap justify-center gap-2 mt-3">
                      {liveAttendance[selectedSubject].map((student, i) => (
                        <span key={i} className="bg-green-500/20 text-green-400 px-2 py-1 rounded text-xs">
                          {student.studentName}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <p className="text-xs text-gray-500 mt-4 font-mono break-all">{generatedQR.qrCode}</p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-80 text-gray-400">
                <QrCode size={100} className="opacity-20 mb-4" />
                <p className="text-lg">No QR Code Generated</p>
                <p className="text-sm mt-2">Select a subject and click Generate</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Active QR Codes */}
      {activeTab === 'qr' && activeQRCodes.length > 0 && (
        <div className="glass-card p-6">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <CheckCircle className="text-green-400" />
            Active Attendance Sessions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeQRCodes.map((qr, i) => (
              <div key={i} className="p-4 bg-green-500/10 rounded-lg border border-green-500/30">
                <div className="flex items-center gap-3">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=50x50&data=${encodeURIComponent(qr.code)}`}
                    alt="QR"
                    className="w-12 h-12"
                  />
                  <div>
                    <p className="font-bold">{qr.subjectName}</p>
                    <p className="text-sm text-gray-400">{qr.room}</p>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs text-gray-400">{qr.code?.split('-').slice(-1)[0]}</span>
                  <span className="flex items-center gap-1 text-green-400 text-sm">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                    Active
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* View Attendance Tab */}
      {activeTab === 'attendance' && (
        <div className="glass-card p-6">
          <h3 className="text-lg font-bold mb-6">Attendance Overview</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="p-6 bg-green-500/10 rounded-lg text-center">
              <p className="text-4xl font-bold text-green-400">142</p>
              <p className="text-gray-400 mt-2">Present Today</p>
            </div>
            <div className="p-6 bg-red-500/10 rounded-lg text-center">
              <p className="text-4xl font-bold text-red-400">18</p>
              <p className="text-gray-400 mt-2">Absent Today</p>
            </div>
            <div className="p-6 bg-primary/10 rounded-lg text-center">
              <p className="text-4xl font-bold text-primary">89%</p>
              <p className="text-gray-400 mt-2">Average Attendance</p>
            </div>
          </div>

          <h4 className="font-medium mb-4">Subject-wise Attendance Today</h4>
          <div className="space-y-3">
            {subjects.map((subj, i) => (
              <div key={i} className="flex items-center gap-4 p-4 bg-white/5 rounded-lg">
                <div className="flex-1">
                  <p className="font-medium">{subj.code} - {subj.name}</p>
                  <p className="text-sm text-gray-400">{subj.students || 40} students</p>
                </div>
                <div className="w-32">
                  <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-green-400 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                </div>
                <span className="w-16 text-right font-bold text-green-400">85%</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Students Tab */}
      {activeTab === 'students' && (
        <div className="glass-card p-6">
          <h3 className="text-lg font-bold mb-6">My Students</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 px-4 text-gray-400">USN</th>
                  <th className="text-left py-3 px-4 text-gray-400">Name</th>
                  <th className="text-center py-3 px-4 text-gray-400">Attendance</th>
                  <th className="text-center py-3 px-4 text-gray-400">Status</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { usn: '2AG21CS001', name: 'Rahul Vernekar', att: '92%', status: 'good' },
                  { usn: '2AG21CS002', name: 'Priya Sharma', att: '88%', status: 'good' },
                  { usn: '2AG21CS003', name: 'Amit Kumar', att: '78%', status: 'warning' },
                  { usn: '2AG21CS004', name: 'Sneha Patil', att: '95%', status: 'good' },
                  { usn: '2AG21CS005', name: 'Vikram Rao', att: '72%', status: 'danger' },
                ].map((student, i) => (
                  <tr key={i} className="border-b border-white/5 hover:bg-white/5">
                    <td className="py-3 px-4 font-mono text-sm">{student.usn}</td>
                    <td className="py-3 px-4">{student.name}</td>
                    <td className="py-3 px-4 text-center">
                      <span className={`font-bold ${
                        student.status === 'good' ? 'text-green-400' : 
                        student.status === 'warning' ? 'text-yellow-400' : 'text-red-400'
                      }`}>{student.att}</span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs ${
                        student.status === 'good' ? 'bg-green-500/20 text-green-400' :
                        student.status === 'warning' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {student.status === 'good' ? 'Good' : student.status === 'warning' ? 'Warning' : 'At Risk'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="glass-card p-6 border-l-4 border-blue-500">
        <h4 className="font-bold mb-3">How to Take Attendance:</h4>
        <ol className="grid grid-cols-1 md:grid-cols-4 gap-4 list-decimal list-inside text-sm text-gray-400">
          <li className="p-3 bg-white/5 rounded-lg">Select your subject</li>
          <li className="p-3 bg-white/5 rounded-lg">Click "Generate QR"</li>
          <li className="p-3 bg-white/5 rounded-lg">Display on screen/projector</li>
          <li className="p-3 bg-white/5 rounded-lg">Students scan with UniHub app</li>
        </ol>
      </div>
    </div>
  )
}