import { useState, useEffect } from 'react'
import { QrCode, Clock, MapPin, Play, CheckCircle, RefreshCw, Trash2 } from 'lucide-react'

export default function QRGenerator() {
  const [selectedSubject, setSelectedSubject] = useState('')
  const [generatedQR, setGeneratedQR] = useState(null)
  const [activeQRCodes, setActiveQRCodes] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const subjects = [
    { id: '1', code: 'CS301', name: 'Data Structures', room: 'C-301' },
    { id: '2', code: 'CS302', name: 'Database Systems', room: 'C-302' },
    { id: '3', code: 'CS303', name: 'Web Technologies', room: 'C-303' },
    { id: '4', code: 'MA301', name: 'Mathematics', room: 'C-304' },
    { id: '5', code: 'CS304', name: 'Software Engineering', room: 'C-305' }
  ]

  useEffect(() => {
    loadActiveQRCodes()
    const interval = setInterval(loadActiveQRCodes, 10000) // Refresh every 10 seconds
    return () => clearInterval(interval)
  }, [])

  const loadActiveQRCodes = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/faculty/active-qrs', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
      if (response.ok) {
        const data = await response.json()
        setActiveQRCodes(data.activeQRCodes)
      }
    } catch (err) {
      console.error('Failed to load active QR codes:', err)
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
        loadActiveQRCodes()
      }
    } catch (err) {
      setError('Network error. Make sure API is running.')
    } finally {
      setLoading(false)
    }
  }

  const getTimeRemaining = (expiresAt) => {
    const now = new Date()
    const expires = new Date(expiresAt)
    const diff = expires - now
    if (diff <= 0) return 'Expired'
    const minutes = Math.floor(diff / 60000)
    const seconds = Math.floor((diff % 60000) / 1000)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  return (
    <div className="space-y-6">
      <div className="glass-card p-6">
        <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
          <QrCode className="text-primary" />
          Generate Attendance QR Code
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Controls */}
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
                  <option key={sub.id} value={sub.id}>{sub.code} - {sub.name} ({sub.room})</option>
                ))}
              </select>
            </div>

            {selectedSubject && (
              <div className="p-4 bg-white/5 rounded-lg space-y-2">
                <div className="flex items-center gap-3">
                  <Clock size={18} className="text-gray-400" />
                  <span className="text-sm">Current Time: {new Date().toLocaleTimeString()}</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin size={18} className="text-gray-400" />
                  <span className="text-sm">Room: {subjects.find(s => s.id === selectedSubject)?.room}</span>
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
              className="w-full bg-primary hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition"
            >
              {loading ? (
                <><RefreshCw className="animate-spin" size={20} /> Generating...</>
              ) : (
                <><Play size={20} /> Generate QR Code</>
              )}
            </button>

            <p className="text-sm text-gray-400 text-center">
              QR code will be valid for 5 minutes only
            </p>
          </div>

          {/* QR Display */}
          <div className="flex flex-col items-center justify-center p-8 bg-white/5 rounded-lg min-h-[300px]">
            {generatedQR ? (
              <>
                <div className="relative">
                  <img 
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(generatedQR.qrCode)}`}
                    alt="QR Code" 
                    className="w-56 h-56 border-4 border-primary rounded-lg" 
                  />
                  <div className="absolute -top-2 -right-2 bg-green-500 rounded-full p-2">
                    <CheckCircle size={20} className="text-white" />
                  </div>
                </div>
                <p className="mt-4 text-green-400 font-medium">QR Code Generated!</p>
                <p className="text-sm text-gray-400 mt-1">
                  Expires in: <span className="text-white font-bold">{getTimeRemaining(generatedQR.expiresAt)}</span>
                </p>
                <p className="text-xs text-gray-500 mt-2 font-mono">{generatedQR.qrCode}</p>
              </>
            ) : (
              <div className="text-center text-gray-400">
                <QrCode size={80} className="mx-auto mb-4 opacity-30" />
                <p>Select a subject and generate QR code</p>
                <p className="text-sm mt-2">The QR will be displayed on screen for students to scan</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Active QR Codes */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <QrCode className="text-green-400" />
            Active QR Codes
          </h3>
          <button onClick={loadActiveQRCodes} className="text-sm text-primary hover:underline flex items-center gap-1">
            <RefreshCw size={14} /> Refresh
          </button>
        </div>
        
        {activeQRCodes.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <QrCode size={48} className="mx-auto mb-4 opacity-30" />
            <p>No active QR codes right now</p>
            <p className="text-sm">Generate a QR code to start attendance</p>
          </div>
        ) : (
          <div className="space-y-3">
            {activeQRCodes.map((qr, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-green-500/10 rounded-lg border border-green-500/30">
                <div className="flex items-center gap-4">
                  <img 
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=60x60&data=${encodeURIComponent(qr.code)}`}
                    alt="QR" 
                    className="w-16 h-16 border border-green-500/50 rounded"
                  />
                  <div>
                    <p className="font-bold">{qr.subjectName}</p>
                    <p className="text-sm text-gray-400 flex items-center gap-2">
                      <MapPin size={12} /> {qr.room}
                      <span className="mx-2">•</span>
                      <Clock size={12} /> {qr.createdAt ? new Date(qr.createdAt).toLocaleTimeString() : 'N/A'}
                    </p>
                    <p className="text-xs text-gray-500 font-mono mt-1">{qr.code}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                    Active
                  </span>
                  <p className="text-xs text-gray-400 mt-2">
                    Expires: {getTimeRemaining(qr.expiresAt)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="glass-card p-6 border-l-4 border-blue-500">
        <h4 className="font-bold mb-3">How Attendance QR Works:</h4>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-white/5 rounded-lg">
            <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="font-bold text-primary">1</span>
            </div>
            <p className="text-sm text-gray-400">Faculty selects subject</p>
          </div>
          <div className="text-center p-4 bg-white/5 rounded-lg">
            <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="font-bold text-primary">2</span>
            </div>
            <p className="text-sm text-gray-400">QR code is generated</p>
          </div>
          <div className="text-center p-4 bg-white/5 rounded-lg">
            <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="font-bold text-primary">3</span>
            </div>
            <p className="text-sm text-gray-400">Displayed on screen</p>
          </div>
          <div className="text-center p-4 bg-white/5 rounded-lg">
            <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="font-bold text-primary">4</span>
            </div>
            <p className="text-sm text-gray-400">Students scan within 5 min</p>
          </div>
        </div>
      </div>
    </div>
  )
}