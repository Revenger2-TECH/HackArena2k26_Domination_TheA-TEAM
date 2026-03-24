# UniHub - Student Campus Dashboard

A modern, student-first unified campus dashboard built with React.js.

## Features

- **Smart Attendance via QR** - Scan classroom QR codes with GPS verification
- **Academic Dashboard** - View marks, GPA estimator, upcoming exams and deadlines
- **Unified Campus Feed** - Notices, Lost & Found, Canteen Menu, Library book availability

## Tech Stack

- **Frontend**: React.js + Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **Icons**: Lucide React
- **State Management**: React Context

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn

### Installation

```bash
# Navigate to project directory
cd unihub-web

# Install dependencies
npm install

# Start development server
npm run dev
```

### Build for Production

```bash
npm run build
npm run preview
```

## Project Structure

```
unihub-web/
├── src/
│   ├── components/     # Reusable UI components
│   ├── context/        # React context providers
│   ├── pages/           # Page components
│   ├── App.jsx          # Main app with routing
│   ├── main.jsx         # Entry point
│   └── index.css        # Global styles
├── public/              # Static assets
├── index.html           # HTML template
├── package.json
├── vite.config.js       # Vite configuration
├── tailwind.config.js   # Tailwind configuration
└── postcss.config.js    # PostCSS configuration
```

## Pages

| Route | Description |
|-------|-------------|
| `/login` | Login page |
| `/` | Dashboard - Overview with stats and quick actions |
| `/attendance` | QR scanning and attendance tracking |
| `/academic` | Marks, GPA, exams and deadlines |
| `/campus` | Notices, Lost & Found, Canteen, Library |
| `/profile` | User profile and settings |

## Team A-TEAM

- Rahul Vernekar (Team Leader)
- Vaishnavi Antalmarad
- Vaibhavi Kabade
- Tanishq Lakkundi

## HackArena 2K26

**Track**: Campus Solutions

---

*One Login. Every Campus Need. Zero Chaos.*
