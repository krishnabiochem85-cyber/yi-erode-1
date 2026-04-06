'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { getDevRole, getDevUser, clearDevRole } from '@/utils/auth'
import { createClient } from '@/utils/supabase/client'

const adminNav = [
  {
    section: 'Overview',
    items: [
      { href: '/admin', label: 'Dashboard', icon: '📊' },
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
    section: 'Admin',
    items: [
      { href: '/admin/roles', label: 'Manage Roles', icon: '🔐' },
    ]
  }
]

const mentorNav = [
  {
    section: 'Overview',
    items: [
      { href: '/mentor-dashboard', label: 'My Dashboard', icon: '📊' },
    ]
  },
  {
    section: 'Sessions',
    items: [
      { href: '/schedule', label: 'My Schedule', icon: '📅' },
      { href: '/feedback', label: 'Submit Feedback', icon: '💬' },
    ]
  },
]

const schoolNav = [
  {
    section: 'Overview',
    items: [
      { href: '/school-dashboard', label: 'My Dashboard', icon: '📊' },
    ]
  },
  {
    section: 'School',
    items: [
      { href: '/assessments', label: 'Assessment', icon: '📝' },
      { href: '/schedule', label: 'Sessions', icon: '📅' },
      { href: '/feedback', label: 'Feedback', icon: '💬' },
    ]
  },
]

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [role, setRole] = useState(null)
  const [user, setUser] = useState(null)

  useEffect(() => {
    // Check Supabase first, then dev cookies
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data: { user: sbUser } }) => {
      if (sbUser) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', sbUser.id)
          .single();
        setRole(profile?.role || 'unassigned');
        setUser({ name: sbUser.user_metadata?.full_name, email: sbUser.email, avatar: sbUser.user_metadata?.avatar_url });
      } else {
        // Fallback to dev cookies
        setRole(getDevRole());
        setUser(getDevUser());
      }
    }).catch(() => {
      setRole(getDevRole());
      setUser(getDevUser());
    });
  }, [])

  if (pathname === '/login' || pathname.startsWith('/auth')) {
    return null
  }

  const navItems = role === 'admin' ? adminNav : role === 'mentor' ? mentorNav : schoolNav

  const roleDisplay = {
    admin: { label: 'Administrator', color: '#818cf8' },
    school_coordinator: { label: 'Coordinator', color: '#fbbf24' },
    mentor: { label: 'Mentor', color: '#34d399' },
  }

  const currentRole = roleDisplay[role] || roleDisplay.admin

  const handleSignOut = async () => {
    clearDevRole()
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch {}
    router.push('/login')
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
                (item.href !== '/admin' && item.href !== '/mentor-dashboard' && item.href !== '/school-dashboard' && pathname.startsWith(item.href))
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '34px', height: '34px', borderRadius: '50%',
              background: `linear-gradient(135deg, ${currentRole.color}, ${currentRole.color}80)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '14px', fontWeight: 700, color: 'white', flexShrink: 0,
              boxShadow: `0 0 12px ${currentRole.color}30`
            }}>
              {(user?.name || 'U').charAt(0)}
            </div>
            <div style={{ overflow: 'hidden', flex: 1 }}>
              <div style={{
                fontSize: '13px', fontWeight: '600',
                whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden',
                color: 'var(--text-primary)'
              }}>
                {user?.name || 'User'}
              </div>
              <div style={{
                fontSize: '11px', fontWeight: '600',
                color: currentRole.color,
                display: 'flex', alignItems: 'center', gap: '4px'
              }}>
                <span style={{
                  width: '6px', height: '6px', borderRadius: '50%',
                  background: currentRole.color, display: 'inline-block',
                  boxShadow: `0 0 6px ${currentRole.color}`
                }}></span>
                {currentRole.label}
              </div>
            </div>
          </div>
          
          <button
            onClick={handleSignOut}
            style={{
              width: '100%', padding: '8px',
              backgroundColor: 'rgba(239, 68, 68, 0.06)',
              color: '#f87171',
              border: '1px solid rgba(239, 68, 68, 0.12)',
              borderRadius: '8px', cursor: 'pointer',
              fontSize: '12.5px', fontWeight: '600',
              transition: 'all 0.2s',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.12)'
              e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.25)'
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.06)'
              e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.12)'
            }}
          >
            Sign Out
          </button>
        </div>
      </div>
    </aside>
  )
}
