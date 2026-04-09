"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const [role, setRole] = useState(null);

  useEffect(() => {
    async function getRole() {
      try {
        const res = await fetch('/api/auth/me');
        const data = await res.json();
        setRole(data.role);
      } catch (err) {
        console.error("Layout role fetch error:", err);
      }
    }
    getRole();
  }, []);

  return (
    <div className="app-layout">
      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="sidebar-logo">Admin</div>
          <div className="sidebar-brand">
            <span className="sidebar-brand-name">Project Shield</span>
            <span className="sidebar-brand-sub">Admin Hub</span>
          </div>
        </div>
        
        <nav className="sidebar-nav">
          <div className="sidebar-section-label">Overview</div>
          <Link href="/admin-dashboard" className={`sidebar-link ${pathname === "/admin-dashboard" ? "active" : ""}`}>
            <span className="sidebar-icon">📊</span>
            Dashboard
          </Link>

          <div className="sidebar-section-label">Sub-Dashboards</div>
          <Link href="/school-dashboard" className="sidebar-link">
            <span className="sidebar-icon">🏫</span>
            School Dashboard
          </Link>
          <Link href="/mentor-dashboard" className="sidebar-link">
            <span className="sidebar-icon">🧑‍⚕️</span>
            Mentor Dashboard
          </Link>

          <div className="sidebar-section-label">Actions</div>
          <Link href="/admin-dashboard/add-mentor" className={`sidebar-link ${pathname === "/admin-dashboard/add-mentor" ? "active" : ""}`}>
            <span className="sidebar-icon">➕</span>
            Add Mentor
          </Link>

          {role === 'admin' && (
            <Link href="/admin-dashboard/roles" className={`sidebar-link ${pathname === "/admin-dashboard/roles" ? "active" : ""}`}>
              <span className="sidebar-icon">🔑</span>
              Manage Roles
            </Link>
          )}
        </nav>
      </aside>

      {/* Main Content Area */}
      {children}
    </div>
  );
}
