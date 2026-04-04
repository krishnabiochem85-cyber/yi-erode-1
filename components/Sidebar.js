'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'

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
  },
  {
    section: 'Administration',
    items: [
      { href: '/admin/roles', label: 'Permissions', icon: '🔐' },
    ]
  }
]

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const supabase = createClient()

  useEffect(() => {
    async function loadUser() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUser(user)
        const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
        if (data) setProfile(data)
      }
    }
    loadUser()
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (pathname === '/login' || pathname.startsWith('/auth')) {
    return null; // hide sidebar on login and auth pages
  }

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

      <div className="sidebar-footer" style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1rem', marginTop: 'auto' }}>
        {user ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div className="sidebar-footer-info" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <img 
                src={profile?.avatar_url || user.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${user.email}`} 
                alt="Avatar" 
                style={{ width: '32px', height: '32px', borderRadius: '50%' }}
              />
              <div style={{ overflow: 'hidden' }}>
                <div className="sidebar-user-name" style={{ fontSize: '0.875rem', fontWeight: '600', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                  {profile?.full_name || user.user_metadata?.full_name || user.email}
                </div>
                <div className="sidebar-user-role" style={{ fontSize: '0.75rem', color: '#a1a1aa', textTransform: 'capitalize' }}>
                  {profile?.role || 'Loading...'}
                </div>
              </div>
            </div>
            
            <button 
              onClick={handleSignOut}
              style={{
                width: '100%',
                padding: '0.5rem',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                color: '#ef4444',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: '500',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.2)'
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)'
              }}
            >
              Sign Out
            </button>
          </div>
        ) : (
          <Link href="/login" style={{
            display: 'block',
            textAlign: 'center',
            width: '100%',
            padding: '0.6rem',
            backgroundColor: '#6366f1',
            color: 'white',
            borderRadius: '8px',
            textDecoration: 'none',
            fontSize: '0.875rem',
            fontWeight: '500'
          }}>
            Login Required
          </Link>
        )}
      </div>
    </aside>
  )
}
