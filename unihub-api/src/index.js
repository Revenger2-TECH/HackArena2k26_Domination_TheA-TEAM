require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*', methods: ['GET', 'POST'] }
});

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'unihub_secret';

const db = {
  users: [
    { id: '1', usn: '2AG21CS001', name: 'Rahul Vernekar', email: 'rahul@student.college.edu', password: bcrypt.hashSync('password123', 10), branch: 'Computer Science', year: 3, section: 'A', role: 'student' },
    { id: '2', usn: '2AG21CS002', name: 'Priya Sharma', email: 'priya@student.college.edu', password: bcrypt.hashSync('password123', 10), branch: 'Computer Science', year: 3, section: 'A', role: 'student' },
    { id: '3', usn: '2AG21CS003', name: 'Amit Kumar', email: 'amit@student.college.edu', password: bcrypt.hashSync('password123', 10), branch: 'Computer Science', year: 3, section: 'A', role: 'student' },
    { id: '4', usn: '2AG21CS004', name: 'Sneha Patel', email: 'sneha@student.college.edu', password: bcrypt.hashSync('password123', 10), branch: 'Computer Science', year: 3, section: 'B', role: 'student' },
    { id: '5', usn: '2AG21CS005', name: 'Vikram Reddy', email: 'vikram@student.college.edu', password: bcrypt.hashSync('password123', 10), branch: 'Computer Science', year: 3, section: 'B', role: 'student' },
    { id: '6', usn: '2AG21EC001', name: 'Ananya Iyer', email: 'ananya@student.college.edu', password: bcrypt.hashSync('password123', 10), branch: 'Electronics', year: 3, section: 'A', role: 'student' },
    { id: '7', usn: '2AG21ME001', name: 'Rajesh Gupta', email: 'rajesh@student.college.edu', password: bcrypt.hashSync('password123', 10), branch: 'Mechanical', year: 3, section: 'A', role: 'student' },
    { id: '8', usn: '2AG21CS006', name: 'Kavitha Nair', email: 'kavitha@student.college.edu', password: bcrypt.hashSync('password123', 10), branch: 'Computer Science', year: 3, section: 'B', role: 'student' }
  ],
  subjects: [
    { id: '1', code: 'CS301', name: 'Data Structures', branch: 'CS', room: 'C-301', students: 45 },
    { id: '2', code: 'CS302', name: 'Database Systems', branch: 'CS', room: 'C-302', students: 42 },
    { id: '3', code: 'CS303', name: 'Web Technologies', branch: 'CS', room: 'C-303', students: 40 },
    { id: '4', code: 'MA301', name: 'Mathematics', branch: 'CS', room: 'C-304', students: 55 },
    { id: '5', code: 'CS304', name: 'Software Engineering', branch: 'CS', room: 'C-305', students: 38 }
  ],
  attendance: [
    { id: '1', studentId: '1', subjectId: '1', date: '2026-03-24', status: 'present' },
    { id: '2', studentId: '1', subjectId: '2', date: '2026-03-24', status: 'present' },
    { id: '3', studentId: '1', subjectId: '3', date: '2026-03-24', status: 'absent' }
  ],
  marks: [
    { id: '1', studentId: '1', subjectId: '1', internal: 35, lab: 18, assignment: 8 },
    { id: '2', studentId: '1', subjectId: '2', internal: 42, lab: 19, assignment: 9 },
    { id: '3', studentId: '1', subjectId: '3', internal: 38, lab: 17, assignment: 7 },
    { id: '4', studentId: '1', subjectId: '4', internal: 45, lab: 0, assignment: 10 },
    { id: '5', studentId: '1', subjectId: '5', internal: 40, lab: 20, assignment: 9 },
    { id: '5', studentId: '1', subjectId: '5', internal: 40, lab: 20, assignment: 9 },
    { id: '6', studentId: '2', subjectId: '1', internal: 38, lab: 19, assignment: 9 },
    { id: '7', studentId: '2', subjectId: '2', internal: 40, lab: 18, assignment: 8 },
    { id: '8', studentId: '2', subjectId: '3', internal: 35, lab: 16, assignment: 7 },
    { id: '9', studentId: '2', subjectId: '4', internal: 42, lab: 0, assignment: 9 },
    { id: '10', studentId: '2', subjectId: '5', internal: 39, lab: 19, assignment: 8 },
    { id: '11', studentId: '3', subjectId: '1', internal: 30, lab: 15, assignment: 6 },
    { id: '12', studentId: '3', subjectId: '2', internal: 28, lab: 14, assignment: 5 },
    { id: '13', studentId: '3', subjectId: '3', internal: 32, lab: 15, assignment: 6 },
    { id: '14', studentId: '3', subjectId: '4', internal: 35, lab: 0, assignment: 7 },
    { id: '15', studentId: '3', subjectId: '5', internal: 29, lab: 14, assignment: 5 },
    { id: '16', studentId: '4', subjectId: '1', internal: 44, lab: 20, assignment: 10 },
    { id: '17', studentId: '4', subjectId: '2', internal: 45, lab: 20, assignment: 10 },
    { id: '18', studentId: '4', subjectId: '3', internal: 42, lab: 19, assignment: 9 },
    { id: '19', studentId: '4', subjectId: '4', internal: 48, lab: 0, assignment: 10 },
    { id: '20', studentId: '4', subjectId: '5', internal: 43, lab: 20, assignment: 9 },
    { id: '21', studentId: '5', subjectId: '1', internal: 36, lab: 17, assignment: 8 },
    { id: '22', studentId: '5', subjectId: '2', internal: 38, lab: 18, assignment: 7 },
    { id: '23', studentId: '5', subjectId: '3', internal: 34, lab: 16, assignment: 7 },
    { id: '24', studentId: '5', subjectId: '4', internal: 40, lab: 0, assignment: 8 },
    { id: '25', studentId: '5', subjectId: '5', internal: 37, lab: 18, assignment: 8 },
    { id: '26', studentId: '6', subjectId: '1', internal: 32, lab: 16, assignment: 7 },
    { id: '27', studentId: '6', subjectId: '2', internal: 30, lab: 15, assignment: 6 },
    { id: '28', studentId: '6', subjectId: '3', internal: 33, lab: 16, assignment: 7 },
    { id: '29', studentId: '6', subjectId: '4', internal: 38, lab: 0, assignment: 8 },
    { id: '30', studentId: '6', subjectId: '5', internal: 31, lab: 15, assignment: 6 },
    { id: '31', studentId: '7', subjectId: '1', internal: 28, lab: 14, assignment: 5 },
    { id: '32', studentId: '7', subjectId: '2', internal: 26, lab: 13, assignment: 5 },
    { id: '33', studentId: '7', subjectId: '3', internal: 29, lab: 14, assignment: 5 },
    { id: '34', studentId: '7', subjectId: '4', internal: 32, lab: 0, assignment: 6 },
    { id: '35', studentId: '7', subjectId: '5', internal: 27, lab: 13, assignment: 5 },
    { id: '36', studentId: '8', subjectId: '1', internal: 41, lab: 19, assignment: 9 },
    { id: '37', studentId: '8', subjectId: '2', internal: 39, lab: 18, assignment: 8 },
    { id: '38', studentId: '8', subjectId: '3', internal: 40, lab: 18, assignment: 8 },
    { id: '39', studentId: '8', subjectId: '4', internal: 43, lab: 0, assignment: 9 },
    { id: '40', studentId: '8', subjectId: '5', internal: 38, lab: 18, assignment: 8 }
  ],
  notices: [
    { id: '1', title: 'College Holiday on 25th December', category: 'Academic', content: 'The college will remain closed.', date: '2026-03-24' },
    { id: '2', title: 'Fee Payment Deadline Extended', category: 'Administrative', content: 'Last date extended.', date: '2026-03-23' },
    { id: '3', title: 'Annual Sports Meet Registration', category: 'Events', content: 'Register now!', date: '2026-03-22' }
  ],
  lostFound: [
    { id: '1', title: 'Blue Water Bottle', type: 'lost', location: 'C-301', contact: 'Rahul V.', date: '2026-03-24' }
  ],
  canteenMenu: {
    breakfast: [{ item: 'Idli Sambar', price: 30 }, { item: 'Masala Dosa', price: 40 }, { item: 'Puri Bhaji', price: 35 }],
    lunch: [{ item: 'Veg Biryani', price: 60 }, { item: 'Dal Fry with Rice', price: 50 }, { item: 'Chole Bhature', price: 55 }]
  },
  libraryBooks: [
    { id: '1', title: 'Introduction to Algorithms', author: 'Cormen et al.', available: 3, total: 5 },
    { id: '2', title: 'Database System Concepts', author: 'Silberschatz', available: 0, total: 4 },
    { id: '3', title: 'Clean Code', author: 'Robert Martin', available: 2, total: 3 }
  ],
  activeQRs: [],
  timetable: [
    { day: 'Monday', slots: [
      { time: '09:00', subjectId: '1', room: 'C-301' },
      { time: '10:30', subjectId: '2', room: 'C-302' },
      { time: '12:00', subjectId: '3', room: 'C-303' },
      { time: '14:00', subjectId: '4', room: 'C-304' }
    ]},
    { day: 'Tuesday', slots: [
      { time: '09:00', subjectId: '2', room: 'C-302' },
      { time: '10:30', subjectId: '4', room: 'C-304' },
      { time: '12:00', subjectId: '1', room: 'C-301' },
      { time: '14:00', subjectId: '5', room: 'C-305' }
    ]},
    { day: 'Wednesday', slots: [
      { time: '09:00', subjectId: '3', room: 'C-303' },
      { time: '10:30', subjectId: '1', room: 'C-301' },
      { time: '12:00', subjectId: '5', room: 'C-305' },
      { time: '14:00', subjectId: '2', room: 'C-302' }
    ]},
    { day: 'Thursday', slots: [
      { time: '09:00', subjectId: '1', room: 'C-301' },
      { time: '10:30', subjectId: '3', room: 'C-303' },
      { time: '12:00', subjectId: '4', room: 'C-304' },
      { time: '14:00', subjectId: '2', room: 'C-302' }
    ]},
    { day: 'Friday', slots: [
      { time: '09:00', subjectId: '5', room: 'C-305' },
      { time: '10:30', subjectId: '1', room: 'C-301' },
      { time: '12:00', subjectId: '2', room: 'C-302' },
      { time: '14:00', subjectId: '3', room: 'C-303' }
    ]}
  ]
};

// Clean up expired QR codes every minute
setInterval(() => {
  const now = Date.now()
  db.activeQRs = db.activeQRs.filter(qr => (now - new Date(qr.createdAt).getTime()) <= 5 * 60 * 1000)
}, 60000)

const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) return res.status(401).json({ error: 'No token provided' })
  try {
    req.user = db.users.find(u => u.id === jwt.verify(token, JWT_SECRET).id)
    next()
  } catch { res.status(401).json({ error: 'Invalid token' }) }
}

// ==================== AUTH ====================
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body
  const user = db.users.find(u => u.email === email)
  if (!user || !bcrypt.compareSync(password, user.password)) return res.status(401).json({ error: 'Invalid credentials' })
  res.json({
    token: jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '7d' }),
    user: { id: user.id, name: user.name, email: user.email, branch: user.branch, usn: user.usn, role: user.role }
  })
})

// ==================== SUBJECTS ====================
app.get('/api/subjects', auth, (req, res) => {
  res.json(db.subjects)
})

// ==================== PROFILE ====================
app.get('/api/student/profile', auth, (req, res) => {
  const u = req.user
  const att = db.attendance.filter(a => a.studentId === u.id)
  const present = att.filter(a => a.status === 'present').length
  res.json({
    id: u.id, name: u.name, email: u.email, usn: u.usn, branch: u.branch, year: u.year, section: u.section,
    attendancePercent: att.length ? ((present / att.length) * 100).toFixed(1) : 0,
    gpa: 6.5, cgpa: 8.2
  })
})

// ==================== ATTENDANCE ====================
app.get('/api/attendance', auth, (req, res) => {
  const u = req.user
  const att = db.attendance.filter(a => a.studentId === u.id)
  const present = att.filter(a => a.status === 'present').length
  const subjects = db.subjects.map(s => {
    const sa = att.filter(a => a.subjectId === s.id)
    const p = sa.filter(a => a.status === 'present').length
    return { id: s.id, code: s.code, name: s.name, present: p, total: sa.length, percentage: sa.length ? ((p / sa.length) * 100).toFixed(1) : 0 }
  })
  res.json({ summary: { present, total: att.length, percentage: att.length ? ((present / att.length) * 100).toFixed(1) : 0 }, subjects })
})

app.get('/api/attendance/active', auth, (req, res) => {
  const today = new Date()
  const dayName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][today.getDay()]
  const todayStr = today.toISOString().split('T')[0]
  const dayTimetable = db.timetable.find(t => t.day === dayName)
  
  if (!dayTimetable) return res.json({ classes: [], day: dayName, message: 'No timetable for today' })
  
  const activeClasses = dayTimetable.slots.map(slot => {
    const subject = db.subjects.find(s => s.id === slot.subjectId)
    const qr = db.activeQRs.find(q => q.subjectId === slot.subjectId && q.date === todayStr)
    const now = Date.now()
    const isExpired = qr ? (now - new Date(qr.createdAt).getTime()) > 5 * 60 * 1000 : true
    
    return {
      time: slot.time,
      subject: subject?.name,
      subjectCode: subject?.code,
      subjectId: slot.subjectId,
      room: slot.room,
      qrAvailable: !!qr && !isExpired,
      qrCode: qr?.code || null,
      isLive: !!qr && !isExpired
    }
  })
  
  res.json({ classes: activeClasses, day: dayName })
})

app.post('/api/attendance/scan', auth, (req, res) => {
  const { qrCode } = req.body
  const u = req.user
  const today = new Date().toISOString().split('T')[0]
  
  const qr = db.activeQRs.find(q => q.code === qrCode)
  if (!qr) return res.status(400).json({ error: 'Invalid or expired QR code' })
  if (qr.date !== today) return res.status(400).json({ error: 'QR code is from a different day' })
  
  const now = Date.now()
  if (now - new Date(qr.createdAt).getTime() > 5 * 60 * 1000) return res.status(400).json({ error: 'QR code has expired' })
  
  const already = db.attendance.find(a => a.studentId === u.id && a.subjectId === qr.subjectId && a.date === today)
  if (already) return res.status(400).json({ error: 'Attendance already marked' })
  
  const subject = db.subjects.find(s => s.id === qr.subjectId)
  const newAttendance = { id: uuidv4(), studentId: u.id, studentName: u.name, subjectId: qr.subjectId, subjectName: subject?.name, date: today, status: 'present' }
  db.attendance.push(newAttendance)
  
  const response = { success: true, message: 'Attendance marked!', attendance: newAttendance }
  res.json(response)
  
  io.emit('attendance:marked', {
    ...newAttendance,
    studentName: u.name,
    studentUSN: u.usn,
    subjectName: subject?.name,
    totalPresent: db.attendance.filter(a => a.subjectId === qr.subjectId && a.status === 'present').length
  })
})

// ==================== FACULTY / QR ====================
app.post('/api/faculty/generate-qr', auth, (req, res) => {
  const { subjectId, room } = req.body
  const u = req.user
  const subject = db.subjects.find(s => s.id === subjectId)
  if (!subject) return res.status(400).json({ error: 'Invalid subject' })
  
  const now = new Date()
  const qrCode = `UH-${subjectId}-${now.toISOString().split('T')[0]}-${now.toTimeString().slice(0, 5)}`
  
  const qrData = {
    id: uuidv4(),
    code: qrCode,
    subjectId,
    subjectName: subject.name,
    room: room || subject.room,
    date: now.toISOString().split('T')[0],
    createdAt: now.toISOString(),
    expiresAt: new Date(now.getTime() + 5 * 60 * 1000).toISOString(),
    generatedBy: u.name
  }
  
  db.activeQRs.push(qrData)
  
  const response = {
    success: true,
    qrCode,
    subject: subject.name,
    room: qrData.room,
    createdAt: qrData.createdAt,
    expiresAt: qrData.expiresAt
  }
  res.json(response)
  
  io.emit('qr:generated', {
    ...qrData,
    qrCode,
    subject: subject.name,
    expiresIn: 300
  })
})

app.get('/api/faculty/active-qrs', auth, (req, res) => {
  const now = Date.now()
  const active = db.activeQRs.filter(qr => (now - new Date(qr.createdAt).getTime()) <= 5 * 60 * 1000)
  res.json({ activeQRCodes: active })
})

app.get('/api/faculty/attendance/:subjectId', auth, (req, res) => {
  const today = new Date().toISOString().split('T')[0]
  const subject = db.subjects.find(s => s.id === req.params.subjectId)
  const att = db.attendance.filter(a => a.subjectId === req.params.subjectId && a.date === today)
  res.json({
    subject: subject?.name,
    date: today,
    totalPresent: att.filter(a => a.status === 'present').length,
    totalAbsent: att.filter(a => a.status === 'absent').length,
    students: att
  })
})

// ==================== ACADEMIC ====================
app.get('/api/academic/marks', auth, (req, res) => {
  const u = req.user
  const marks = db.marks.filter(m => m.studentId === u.id).map(m => ({
    ...m,
    code: db.subjects.find(s => s.id === m.subjectId)?.code,
    subjectName: db.subjects.find(s => s.id === m.subjectId)?.name,
    total: m.internal + m.lab + m.assignment
  }))
  const total = marks.reduce((s, m) => s + m.total, 0)
  res.json({ marks, currentGPA: (total / marks.length / 10).toFixed(2), sgpa: (total / marks.length / 10 * 10).toFixed(1) })
})

app.post('/api/academic/calculate-gpa', auth, (req, res) => {
  const { targetGPA } = req.body
  const u = req.user
  const marks = db.marks.filter(m => m.studentId === u.id)
  const currentTotal = marks.reduce((sum, m) => sum + m.internal + m.lab + m.assignment, 0)
  const currentGPA = (currentTotal / marks.length / 10).toFixed(2)
  const requiredTotal = targetGPA * 10 * marks.length
  const requiredScore = Math.round((requiredTotal - currentTotal) / marks.length)
  res.json({ currentGPA: parseFloat(currentGPA), targetGPA, requiredPerSubject: requiredScore > 0 ? requiredScore : 0, achievable: requiredScore <= 100 })
})

// ==================== CAMPUS ====================
app.get('/api/campus/notices', auth, (req, res) => res.json(db.notices))
app.get('/api/campus/lost-found', auth, (req, res) => res.json(db.lostFound))
app.get('/api/campus/canteen', auth, (req, res) => res.json(db.canteenMenu))
app.get('/api/campus/library', auth, (req, res) => res.json(db.libraryBooks))

// ==================== TIMETABLE ====================
app.get('/api/timetable', auth, (req, res) => {
  res.json(db.timetable.map(day => ({
    day: day.day,
    slots: day.slots.map(slot => ({
      ...slot,
      subject: db.subjects.find(s => s.id === slot.subjectId)?.name,
      code: db.subjects.find(s => s.id === slot.subjectId)?.code
    }))
  })))
})

// ==================== SOCKET.IO ====================
const connectedUsers = new Map();

io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`);
  
  socket.on('register', (data) => {
    if (data?.userId) {
      connectedUsers.set(data.userId, socket.id);
      socket.userId = data.userId;
      socket.role = data.role;
      console.log(`User ${data.userId} (${data.role}) registered`);
    }
  });

  socket.on('disconnect', () => {
    if (socket.userId) {
      connectedUsers.delete(socket.userId);
    }
    console.log(`Client disconnected: ${socket.id}`);
  });
});

function emitToAll(event, data) {
  io.emit(event, data);
}

function emitToRole(role, event, data) {
  for (const [userId, socketId] of connectedUsers) {
    const user = db.users.find(u => u.id === userId);
    if (user?.role === role) {
      io.to(socketId).emit(event, data);
    }
  }
}

// ==================== HEALTH ====================
app.get('/api/health', (req, res) => res.json({ 
  status: 'ok', 
  timestamp: new Date().toISOString(),
  connectedClients: connectedUsers.size
}))

server.listen(PORT, () => {
  console.log(`UniHub API running on port ${PORT}`)
  console.log(`Today: ${new Date().toDateString()}`)
})