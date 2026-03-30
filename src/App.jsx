import React from 'react'
import { Routes, Route, NavLink, useLocation } from 'react-router-dom'
import { ScanLine, Clock, Info } from 'lucide-react'
import ScanPage from './pages/ScanPage'
import HistoryPage from './pages/HistoryPage'
import AboutPage from './pages/AboutPage'

export default function App() {
  return (
    <div className="grain-overlay min-h-screen flex flex-col max-w-lg mx-auto">

      {/* Header */}
      <header className="sticky top-0 z-50 px-5 pt-5 pb-4 flex items-center justify-between"
        style={{ background: 'linear-gradient(to bottom, #0D0D0D 80%, transparent)' }}>
        <div>
          <h1 className="font-display font-extrabold text-2xl text-sugar-text tracking-tight">
            Sugar<span className="text-sugar-accent">Scan</span>
          </h1>
          <p className="font-mono text-xs text-sugar-muted">Indian snacks · honest labels</p>
        </div>
        {/* Accent dot */}
        <div className="relative">
          <div className="w-2 h-2 rounded-full bg-sugar-accent" />
          <div className="absolute inset-0 w-2 h-2 rounded-full bg-sugar-accent animate-pulse-ring" />
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 px-5 pb-24">
        <Routes>
          <Route path="/" element={<ScanPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
      </main>

      {/* Bottom nav */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-lg
                      border-t border-sugar-border bg-sugar-bg/95 backdrop-blur-sm">
        <div className="flex">
          <NavItem to="/" icon={<ScanLine size={20} />} label="Scan" />
          <NavItem to="/history" icon={<Clock size={20} />} label="History" />
          <NavItem to="/about" icon={<Info size={20} />} label="About" />
        </div>
      </nav>
    </div>
  )
}

function NavItem({ to, icon, label }) {
  return (
    <NavLink
      to={to}
      end
      className={({ isActive }) =>
        `flex-1 flex flex-col items-center gap-1 py-3 text-xs font-mono transition-colors
        ${isActive ? 'text-sugar-accent' : 'text-sugar-muted hover:text-sugar-textDim'}`
      }
    >
      {icon}
      {label}
    </NavLink>
  )
}