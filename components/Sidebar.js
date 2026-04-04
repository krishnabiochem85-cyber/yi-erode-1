'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  {
    section: 'Overview',
    items: [
      { href: '/', label: 'Dashboard', icon: '🏠' },
    ]
  },
  {
    section: 'Management',
    items: [
      { href: '/schools', label: 'Schools', icon: '🏫' },
      { href: '/assessments', label: 'Assessments', icon: '📝' },
      { href: '/modules', label: 'Module Matrix', icon: '🎯' },
    ]
  },
  {
    section: 'Operations',
    items: [
      { href: '/schedule', label: 'Schedule', icon: '📅' },
      { href: '/mentors', label: 'Mentors', icon: '👥' },
    ]
  },
  {
    section: 'Insights',
    items: [
      { href: '/feedback', label: 'Feedback', icon: '💬' },
    ]
  }
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">🛡️</div>
        <div className="sidebar-brand">
          <span className="sidebar-brand-name">Project Shield</span>
          <span className="sidebar-brand-sub">YI Erode Chapter</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((section) => (
          <div key={section.section}>
            <div className="sidebar-section-label">{section.section}</div>
            {section.items.map((item) => {
              const isActive = pathname === item.href || 
                (item.href !== '/' && pathname.startsWith(item.href))
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`sidebar-link ${isActive ? 'active' : ''}`}
                >
                  <span className="sidebar-icon">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </div>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-footer-info">
          <div className="sidebar-avatar">YI</div>
          <div>
            <div className="sidebar-user-name">YI Erode Admin</div>
            <div className="sidebar-user-role">Administrator</div>
          </div>
        </div>
      </div>
    </aside>
  )
}
