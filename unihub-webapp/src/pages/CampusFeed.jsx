import { useState } from 'react'
import { Bell, Utensils, Book, Search, Plus, MapPin, Clock, User, Phone, Mail } from 'lucide-react'

const notices = [
  { id: 1, title: 'College Holiday on 25th December', category: 'Academic', date: '2 hours ago', content: 'The college will remain closed on 25th December 2026 on the occasion of Christmas.' },
  { id: 2, title: 'Fee Payment Deadline Extended', category: 'Administrative', date: '1 day ago', content: 'Last date for semester fee payment has been extended to 20th December 2026.' },
  { id: 3, title: 'Annual Sports Meet Registration', category: 'Events', date: '2 days ago', content: 'Register for the Annual Sports Meet 2026. Last date for registration is 15th December.' },
  { id: 4, title: 'Library Hours Extended', category: 'Library', date: '3 days ago', content: 'Library will remain open till 9 PM during exam season.' }
]

const lostItems = [
  { id: 1, title: 'Blue Water Bottle', location: 'C-301', date: '2 hours ago', contact: 'Rahul V.', status: 'lost', image: 'blue-bottle' },
  { id: 2, title: 'Black Wallet', location: 'Library', date: '1 day ago', contact: 'Priya M.', status: 'lost', image: 'wallet' },
  { id: 3, title: 'Keys with Red Keychain', location: 'Canteen', date: '3 days ago', contact: 'Amit K.', status: 'found', image: 'keys' }
]

const canteenMenu = {
  breakfast: [
    { item: 'Idli Sambar', price: 30 },
    { item: 'Masala Dosa', price: 40 },
    { item: 'Puri Bhaji', price: 35 },
    { item: 'Poha', price: 25 }
  ],
  lunch: [
    { item: 'Veg Biryani', price: 60 },
    { item: 'Dal Fry with Rice', price: 50 },
    { item: 'Chole Bhature', price: 55 },
    { item: 'Roti Sabzi', price: 45 }
  ]
}

const libraryBooks = [
  { title: 'Introduction to Algorithms', author: 'Cormen et al.', available: 3, total: 5 },
  { title: 'Database System Concepts', author: 'Silberschatz', available: 0, total: 4 },
  { title: 'Clean Code', author: 'Robert C. Martin', available: 2, total: 3 },
  { title: 'The Pragmatic Programmer', author: 'Hunt & Thomas', available: 1, total: 2 }
]

const categories = ['All', 'Academic', 'Administrative', 'Events', 'Library', 'Sports']

export default function CampusFeed() {
  const [activeTab, setActiveTab] = useState('notices')
  const [activeCategory, setActiveCategory] = useState('All')

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 glass-card p-2">
        {[
          { id: 'notices', icon: Bell, label: 'Notices' },
          { id: 'lost', icon: Search, label: 'Lost & Found' },
          { id: 'canteen', icon: Utensils, label: 'Canteen' },
          { id: 'library', icon: Book, label: 'Library' }
        ].map(tab => (
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

      {/* Notices Tab */}
      {activeTab === 'notices' && (
        <div className="space-y-6">
          {/* Category Filter */}
          <div className="flex gap-2 flex-wrap">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm transition ${
                  activeCategory === cat ? 'bg-primary text-white' : 'bg-white/5 hover:bg-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Notice Cards */}
          <div className="grid gap-4">
            {notices
              .filter(n => activeCategory === 'All' || n.category === activeCategory)
              .map(notice => (
                <div key={notice.id} className="glass-card p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        notice.category === 'Academic' ? 'bg-blue-500/20 text-blue-400' :
                        notice.category === 'Administrative' ? 'bg-yellow-500/20 text-yellow-400' :
                        notice.category === 'Events' ? 'bg-purple-500/20 text-purple-400' :
                        'bg-green-500/20 text-green-400'
                      }`}>
                        {notice.category}
                      </span>
                      <h4 className="text-lg font-bold mt-2">{notice.title}</h4>
                    </div>
                    <span className="text-sm text-gray-400 flex items-center gap-1">
                      <Clock size={14} /> {notice.date}
                    </span>
                  </div>
                  <p className="text-gray-400">{notice.content}</p>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Lost & Found Tab */}
      {activeTab === 'lost' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Lost Items */}
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Lost Items</h3>
              <button className="flex items-center gap-2 bg-primary hover:bg-secondary px-4 py-2 rounded-lg text-sm transition">
                <Plus size={16} /> Report Lost
              </button>
            </div>
            <div className="space-y-4">
              {lostItems.filter(item => item.status === 'lost').map(item => (
                <div key={item.id} className="p-4 bg-white/5 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gray-700 rounded-lg flex items-center justify-center">
                      <Search size={24} className="text-gray-500" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold">{item.title}</h4>
                      <p className="text-sm text-gray-400 flex items-center gap-1">
                        <MapPin size={14} /> {item.location}
                      </p>
                      <p className="text-sm text-gray-400 flex items-center gap-1">
                        <User size={14} /> {item.contact}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Found Items */}
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Found Items</h3>
              <button className="flex items-center gap-2 bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg text-sm transition">
                <Plus size={16} /> Report Found
              </button>
            </div>
            <div className="space-y-4">
              {lostItems.filter(item => item.status === 'found').map(item => (
                <div key={item.id} className="p-4 bg-green-500/10 rounded-lg border border-green-500/30">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-green-500/20 rounded-lg flex items-center justify-center">
                      <Search size={24} className="text-green-400" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold">{item.title}</h4>
                      <p className="text-sm text-gray-400 flex items-center gap-1">
                        <MapPin size={14} /> Found at {item.location}
                      </p>
                      <p className="text-sm text-gray-400 flex items-center gap-1">
                        <User size={14} /> {item.contact}
                      </p>
                    </div>
                    <button className="bg-green-500 px-4 py-2 rounded-lg text-sm">
                      Claim
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Canteen Tab */}
      {activeTab === 'canteen' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="glass-card p-6">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Utensils className="text-primary" /> Breakfast Menu
            </h3>
            <p className="text-sm text-gray-400 mb-4">Available: 7:30 AM - 10:00 AM</p>
            <div className="space-y-3">
              {canteenMenu.breakfast.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <span>{item.item}</span>
                  <span className="text-primary font-bold">₹{item.price}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card p-6">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Utensils className="text-secondary" /> Lunch Menu
            </h3>
            <p className="text-sm text-gray-400 mb-4">Available: 12:00 PM - 2:30 PM</p>
            <div className="space-y-3">
              {canteenMenu.lunch.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <span>{item.item}</span>
                  <span className="text-secondary font-bold">₹{item.price}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Library Tab */}
      {activeTab === 'library' && (
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Book className="text-primary" /> Library Book Availability
            </h3>
            <div className="relative">
              <input
                type="text"
                placeholder="Search books..."
                className="bg-white/5 border border-white/10 rounded-lg py-2 pl-10 pr-4 w-64"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Book Title</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Author</th>
                  <th className="text-center py-3 px-4 text-gray-400 font-medium">Available</th>
                  <th className="text-center py-3 px-4 text-gray-400 font-medium">Total</th>
                  <th className="text-center py-3 px-4 text-gray-400 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {libraryBooks.map((book, index) => (
                  <tr key={index} className="border-b border-white/5 hover:bg-white/5">
                    <td className="py-4 px-4 font-medium">{book.title}</td>
                    <td className="py-4 px-4 text-gray-400">{book.author}</td>
                    <td className="text-center py-4 px-4">{book.available}</td>
                    <td className="text-center py-4 px-4">{book.total}</td>
                    <td className="text-center py-4 px-4">
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        book.available > 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                      }`}>
                        {book.available > 0 ? 'Available' : 'Not Available'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
