import { useState } from 'react'
import { TrendingUp, Target, Calendar, FileText, Award, Calculator } from 'lucide-react'

const subjectMarks = [
  { subject: 'Data Structures', internal: 35, lab: 18, assignment: 8, total: 61, max: 100 },
  { subject: 'Database Systems', internal: 42, lab: 19, assignment: 9, total: 70, max: 100 },
  { subject: 'Web Technologies', internal: 38, lab: 17, assignment: 7, total: 62, max: 100 },
  { subject: 'Mathematics', internal: 45, lab: 0, assignment: 10, total: 55, max: 100 },
  { subject: 'Software Engineering', internal: 40, lab: 20, assignment: 9, total: 69, max: 100 }
]

const upcomingExams = [
  { exam: 'Internal Exam 2 - Data Structures', date: 'Dec 20, 2026', daysLeft: 12 },
  { exam: 'Lab Exam - Database Systems', date: 'Dec 22, 2026', daysLeft: 14 },
  { exam: 'Quiz - Web Technologies', date: 'Dec 18, 2026', daysLeft: 10 }
]

const deadlines = [
  { task: 'DS Lab Assignment 4', due: 'Dec 15, 2026', daysLeft: 7 },
  { task: 'DBMS Project Report', due: 'Dec 18, 2026', daysLeft: 10 },
  { task: 'WT Mini Project', due: 'Dec 22, 2026', daysLeft: 14 }
]

export default function Academic() {
  const [targetGPA, setTargetGPA] = useState(8.5)
  const [requiredScore, setRequiredScore] = useState(null)

  const calculateRequired = () => {
    const currentTotal = subjectMarks.reduce((sum, s) => sum + s.total, 0)
    const subjects = subjectMarks.length
    const currentGPA = (currentTotal / subjects / 10).toFixed(2)
    
    const requiredTotal = (targetGPA * 10 * subjects) - currentTotal
    const perSubject = Math.round(requiredTotal / subjects)
    
    setRequiredScore({ perSubject, currentGPA })
  }

  const currentGPA = (subjectMarks.reduce((sum, s) => sum + s.total, 0) / subjectMarks.length / 10).toFixed(2)
  const sgpa = (currentGPA * 10).toFixed(1)

  return (
    <div className="space-y-6">
      {/* GPA Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-card p-6 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-primary/20 rounded-full flex items-center justify-center">
            <TrendingUp size={32} className="text-primary" />
          </div>
          <p className="text-gray-400 text-sm mb-1">Current SGPA</p>
          <p className="text-4xl font-bold gradient-text">{sgpa}</p>
          <p className="text-sm text-gray-400 mt-1">Semester 5</p>
        </div>
        
        <div className="glass-card p-6 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-secondary/20 rounded-full flex items-center justify-center">
            <Award size={32} className="text-secondary" />
          </div>
          <p className="text-gray-400 text-sm mb-1">CGPA (Cumulative)</p>
          <p className="text-4xl font-bold gradient-text">8.2</p>
          <p className="text-sm text-gray-400 mt-1">Out of 10.0</p>
        </div>

        <div className="glass-card p-6">
          <h4 className="text-center mb-4">GPA Estimator</h4>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-400">Target GPA</label>
              <input
                type="number"
                value={targetGPA}
                onChange={(e) => setTargetGPA(parseFloat(e.target.value))}
                step="0.1"
                min="6"
                max="10"
                className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-3 mt-1"
              />
            </div>
            <button
              onClick={calculateRequired}
              className="w-full bg-primary hover:bg-secondary py-2 rounded-lg font-medium transition flex items-center justify-center gap-2"
            >
              <Calculator size={18} />
              Calculate Required Score
            </button>
            {requiredScore && (
              <div className="text-center text-sm">
                <p className="text-gray-400">Current: {requiredScore.currentGPA}</p>
                <p className="text-green-400 mt-1">
                  Need avg {requiredScore.perSubject}/100 in remaining exams
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Subject-wise Marks */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
          <FileText className="text-primary" />
          Subject-wise Performance
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Subject</th>
                <th className="text-center py-3 px-4 text-gray-400 font-medium">Internal (50)</th>
                <th className="text-center py-3 px-4 text-gray-400 font-medium">Lab (25)</th>
                <th className="text-center py-3 px-4 text-gray-400 font-medium">Assignment (25)</th>
                <th className="text-center py-3 px-4 text-gray-400 font-medium">Total (100)</th>
                <th className="text-center py-3 px-4 text-gray-400 font-medium">Grade</th>
              </tr>
            </thead>
            <tbody>
              {subjectMarks.map((subj, index) => (
                <tr key={index} className="border-b border-white/5 hover:bg-white/5">
                  <td className="py-4 px-4 font-medium">{subj.subject}</td>
                  <td className="text-center py-4 px-4">{subj.internal}</td>
                  <td className="text-center py-4 px-4">{subj.lab}</td>
                  <td className="text-center py-4 px-4">{subj.assignment}</td>
                  <td className="text-center py-4 px-4">
                    <span className={`font-bold ${
                      subj.total >= 70 ? 'text-green-400' :
                      subj.total >= 50 ? 'text-yellow-400' : 'text-red-400'
                    }`}>
                      {subj.total}/{subj.max}
                    </span>
                  </td>
                  <td className="text-center py-4 px-4">
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      subj.total >= 90 ? 'bg-green-500/20 text-green-400' :
                      subj.total >= 70 ? 'bg-blue-500/20 text-blue-400' :
                      subj.total >= 50 ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {subj.total >= 90 ? 'O' : subj.total >= 70 ? 'A' : subj.total >= 50 ? 'B' : 'F'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upcoming Exams & Deadlines */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Exams */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Calendar className="text-secondary" />
            Upcoming Exams
          </h3>
          <div className="space-y-4">
            {upcomingExams.map((exam, index) => (
              <div key={index} className="flex items-center gap-4 p-4 bg-white/5 rounded-lg">
                <div className="p-3 bg-secondary/20 rounded-lg">
                  <Calendar size={20} className="text-secondary" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{exam.exam}</p>
                  <p className="text-sm text-gray-400">{exam.date}</p>
                </div>
                <span className="bg-secondary/20 text-secondary px-3 py-1 rounded-full text-sm">
                  {exam.daysLeft} days
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Assignment Deadlines */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Target className="text-primary" />
            Assignment Deadlines
          </h3>
          <div className="space-y-4">
            {deadlines.map((deadline, index) => (
              <div key={index} className="flex items-center gap-4 p-4 bg-white/5 rounded-lg">
                <div className="p-3 bg-primary/20 rounded-lg">
                  <FileText size={20} className="text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{deadline.task}</p>
                  <p className="text-sm text-gray-400">Due: {deadline.due}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  deadline.daysLeft <= 7 ? 'bg-red-500/20 text-red-400' : 'bg-primary/20 text-primary'
                }`}>
                  {deadline.daysLeft} days
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
