import { useState, useEffect } from 'react'
import { QrCode, Camera, CheckCircle, XCircle, MapPin, Clock, AlertTriangle, Wifi } from 'lucide-react'
import { useSocket } from '../hooks/useSocket'

export default function Attendance() {
  const [summary, setSummary] = useState({ present: 0, total: 0, percentage: 0 })
  const [subjects, setSubjects] = useState([])
  const [activeClasses, setActiveClasses] = useState([])
  const [scanMode, setScanMode] = useState(false)
  const [scanResult, setScanResult] = useState(null)
  const [loading, setLoading] = useState(true)
  const [liveCount, setLiveCount] = useState({})
  const { isConnected, on } = useSocket()

  useEffect(() => {
    loadAttendanceData()

    const unsubQR = on('qr:generated', (data) => {
      setActiveClasses(prev => prev.map(cls => 
        cls.subjectId === data.subjectId 
          ? { ...cls, qrAvailable: true, qrCode: data.qrCode, isLive: true }
          : cls
      ))
    })

    const unsubAttendance = on('attendance:marked', (data) => {
      setLiveCount(prev => ({
        ...prev,
        [data.subjectId]: (prev[data.subjectId] || 0) + 1
      }))
    })

    const interval = setInterval(loadActiveClasses, 10000)
    return () => {
      clearInterval(interval)
      unsubQR()
      unsubAttendance()
    }
  }, [])

  const loadAttendanceData = async () => {
    try {
      const [summaryRes, activeRes] = await Promise.all([
        fetch('http://localhost:5000/api/attendance', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }),
        fetch('http://localhost:5000/api/attendance/active', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
      ])
      
      const summaryData = await summaryRes.json()
      const activeData = await activeRes.json()
      
      setSummary(summaryData.summary || { present: 0, total: 0, percentage: 0 })
      setSubjects(summaryData.subjects || [])
      setActiveClasses(activeData.classes || [])
    } catch (err) {
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  const loadActiveClasses = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/attendance/active', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
      if (response.ok) {
        const data = await response.json()
        setActiveClasses(data.classes || [])
      }
    } catch (err) {
      console.error('Error:', err)
    }
  }

  const handleSimulateScan = async (qrCode) => {
    setScanMode(false)
    
    try {
      const response = await fetch('http://localhost:5000/api/attendance/scan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ qrCode })
      })
      
      const data = await response.json()
      
      if (response.ok) {
        setScanResult({ success: true, message: data.message })
        loadAttendanceData()
      } else {
        setScanResult({ success: false, message: data.error })
      }
    } catch (err) {
      setScanResult({ success: false, message: 'Network error' })
    }
  }

  const resetScan = () => {
    setScanMode(false)
    setScanResult(null)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* QR Scanner Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-6">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
            <QrCode className="text-primary" />
            Scan Attendance QR
          </h3>

          {!scanMode && !scanResult && (
            <div className="text-center py-8">
              <div className="w-48 h-48 mx-auto mb-6 border-2 border-dashed border-white/30 rounded-2xl flex items-center justify-center">
                <QrCode size={80} className="text-gray-500" />
              </div>
              <p className="text-gray-400 mb-6">Scan the QR code displayed on classroom screen</p>
              <button
                onClick={() => setScanMode(true)}
                className="inline-flex items-center gap-2 bg-primary hover:bg-secondary text-white font-bold py-3 px-8 rounded-lg transition"
              >
                <Camera size={20} />
                Open Scanner
              </button>
            </div>
          )}

          {scanMode && (
            <div className="text-center py-8">
              <p className="text-gray-400 mb-4">Tap a class below to mark attendance:</p>
              
              {activeClasses.filter(c => c.qrAvailable).length === 0 ? (
                <div className="py-8">
                  <AlertTriangle size={48} className="text-yellow-400 mx-auto mb-4" />
                  <p className="text-yellow-400">No active QR codes</p>
                  <p className="text-gray-400 text-sm mt-2">Ask teacher to generate QR first</p>
                </div>
              ) : (
                <div className="space-y-3 mb-6">
                  {activeClasses.filter(c => c.qrAvailable).map((cls, i) => (
                    <button
                      key={i}
                      onClick={() => handleSimulateScan(cls.qrCode)}
                      className="w-full bg-green-500/20 hover:bg-green-500/30 border border-green-500/50 text-green-400 py-4 px-6 rounded-lg font-medium transition text-left"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-bold">{cls.subject}</p>
                          <p className="text-sm text-green-300">{cls.time} - {cls.room}</p>
                        </div>
                        <span className="bg-green-500 text-white px-3 py-1 rounded text-sm">Scan</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
              
              <button onClick={resetScan} className="text-gray-400 hover:text-white">Cancel</button>
            </div>
          )}

          {scanResult && (
            <div className="text-center py-8">
              <div className={`w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center ${
                scanResult.success ? 'bg-green-500/20' : 'bg-red-500/20'
              }`}>
                {scanResult.success ? <CheckCircle size={48} className="text-green-400" /> : <XCircle size={48} className="text-red-400" />}
              </div>
              <h4 className="text-xl font-bold mb-2">{scanResult.success ? 'Attendance Marked!' : 'Failed'}</h4>
              <p className="text-gray-400 mb-6">{scanResult.message}</p>
              <button onClick={resetScan} className="text-primary hover:underline">Scan Another</button>
            </div>
          )}
        </div>

        {/* Today's Classes */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-bold">Today's Classes</h3>
              <span className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full ${isConnected ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                <Wifi size={12} /> {isConnected ? 'Live' : 'Offline'}
              </span>
            </div>
            <button onClick={loadActiveClasses} className="text-sm text-primary hover:underline flex items-center gap-1">
              <Clock size={14} /> Refresh
            </button>
          </div>
          
          {activeClasses.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <p>No classes today</p>
              <p className="text-sm mt-2">Or ask teacher to generate QR codes</p>
            </div>
          ) : (
            <div className="space-y-4">
              {activeClasses.map((cls, i) => (
                <div key={i} className={`p-4 rounded-lg ${
                  cls.isLive ? 'bg-primary/20 border border-primary' : 
                  cls.qrAvailable ? 'bg-green-500/20 border border-green-500' : 
                  'bg-white/5'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      cls.isLive ? 'bg-primary text-white' : 
                      cls.qrAvailable ? 'bg-green-500 text-white' : 
                      'bg-gray-600 text-gray-300'
                    }`}>
                      {cls.isLive ? 'LIVE' : cls.qrAvailable ? 'QR Ready' : 'Upcoming'}
                    </span>
                    <div className="flex items-center gap-2">
                      {liveCount[cls.subjectId] > 0 && (
                        <span className="text-xs text-green-400">{liveCount[cls.subjectId]} marked</span>
                      )}
                      <span className="text-sm text-gray-400">{cls.subjectCode}</span>
                    </div>
                  </div>
                  <p className="font-bold text-lg">{cls.subject}</p>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-400">
                    <span className="flex items-center gap-1"><Clock size={14} /> {cls.time}</span>
                    <span className="flex items-center gap-1"><MapPin size={14} /> {cls.room}</span>
                  </div>
                  {cls.qrAvailable && !scanResult && (
                    <button 
                      onClick={() => handleSimulateScan(cls.qrCode)}
                      className="w-full mt-4 bg-green-500 hover:bg-green-600 py-2 rounded-lg font-medium transition"
                    >
                      Mark Attendance
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Attendance Summary */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-bold mb-6">Attendance Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center p-4 bg-green-500/10 rounded-lg">
            <p className="text-3xl font-bold text-green-400">{summary.present}</p>
            <p className="text-sm text-gray-400">Present</p>
          </div>
          <div className="text-center p-4 bg-red-500/10 rounded-lg">
            <p className="text-3xl font-bold text-red-400">{summary.total - summary.present}</p>
            <p className="text-sm text-gray-400">Absent</p>
          </div>
          <div className="text-center p-4 bg-primary/10 rounded-lg">
            <p className="text-3xl font-bold text-primary">{summary.percentage}%</p>
            <p className="text-sm text-gray-400">Overall</p>
          </div>
          <div className="text-center p-4 bg-yellow-500/10 rounded-lg">
            <p className="text-3xl font-bold text-yellow-400">{summary.total}</p>
            <p className="text-sm text-gray-400">Total</p>
          </div>
        </div>

        <h4 className="font-medium mb-4">Subject-wise Attendance</h4>
        <div className="space-y-4">
          {subjects.map((subj, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="w-56">
                <p className="font-medium">{subj.name}</p>
                <p className="text-sm text-gray-400">{subj.present}/{subj.total} classes</p>
              </div>
              <div className="flex-1">
                <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${subj.percentage >= 85 ? 'bg-green-400' : subj.percentage >= 75 ? 'bg-yellow-400' : 'bg-red-400'}`}
                    style={{ width: `${subj.percentage}%` }}
                  />
                </div>
              </div>
              <span className={`w-16 text-right font-bold ${subj.percentage >= 85 ? 'text-green-400' : subj.percentage >= 75 ? 'text-yellow-400' : 'text-red-400'}`}>
                {subj.percentage}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {subjects.some(s => s.percentage < 85 && s.percentage > 0) && (
        <div className="glass-card p-6 border-l-4 border-yellow-400">
          <div className="flex items-start gap-4">
            <AlertTriangle size={24} className="text-yellow-400" />
            <div>
              <h4 className="font-bold">Attendance Alert</h4>
              <p className="text-gray-400 mt-1">
                {subjects.filter(s => s.percentage < 85).map(s => s.name).join(', ')} need attention!
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
