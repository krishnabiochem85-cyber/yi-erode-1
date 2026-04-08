"use client";

import { useEffect, useState } from "react";
import { 
  getAllMentorsWithAllocations, 
  assignMentorToSchool, 
  removeMentorFromSchool 
} from "@/utils/admin-mentor-actions";
import { getSchools } from "@/utils/school-actions";
import { getMentorAvailability, getMentorInteractions } from "@/utils/mentor-actions";
import Link from 'next/link';

export default function AdminMentorsPage() {
  const [mentors, setMentors] = useState([]);
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  
  // Secondary views
  const [viewDetail, setViewDetail] = useState(null); // 'availability' | 'interactions'
  const [detailData, setDetailData] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    const [mentorList, schoolList] = await Promise.all([
      getAllMentorsWithAllocations(),
      getSchools() // Assuming this fetches active schools
    ]);
    setMentors(mentorList);
    setSchools(schoolList);
    setLoading(false);
  }

  const handleAssign = async (schoolId) => {
    const result = await assignMentorToSchool(selectedMentor.id, schoolId);
    if (result.success) {
      setShowAssignModal(false);
      loadData();
    } else {
      alert(result.error);
    }
  };

  const handleRemove = async (mentorId, schoolId) => {
    if (confirm("Are you sure you want to remove this school allocation?")) {
      await removeMentorFromSchool(mentorId, schoolId);
      loadData();
    }
  };

  const openDetails = async (mentor, type) => {
    setViewDetail(type);
    setSelectedMentor(mentor);
    if (type === 'availability') {
      const data = await getMentorAvailability(mentor.id);
      setDetailData(data);
    } else {
      const data = await getMentorInteractions(mentor.id);
      setDetailData(data);
    }
  };

  if (loading) return <div style={{ padding: '60px', textAlign: 'center' }}>Loading Administrative Mentor Workspace...</div>;

  return (
    <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
      
      {/* Header */}
      <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '30px', fontWeight: 800, letterSpacing: '-0.5px' }}>Mentor Oversight</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Control school allocations and monitor mentor activity.</p>
        </div>
        <Link href="/admin" className="btn btn-secondary">← Back to Dashboard</Link>
      </div>

      {/* Mentor Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Mentor Name</th>
                <th>Allocated Schools</th>
                <th>Activity Tracking</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {mentors.map(mentor => (
                <tr key={mentor.id}>
                  <td>
                    <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{mentor.full_name}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>{mentor.email}</div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {mentor.allocations.map(alloc => (
                        <div key={alloc.schoolId} className="badge badge-info" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          {alloc.schoolName}
                          <span 
                            onClick={() => handleRemove(mentor.id, alloc.schoolId)}
                            style={{ cursor: 'pointer', opacity: 0.6, fontSize: '14px' }}>×</span>
                        </div>
                      ))}
                      <button 
                        onClick={() => { setSelectedMentor(mentor); setShowAssignModal(true); }}
                        style={{ border: '1px dashed var(--border)', background: 'transparent', padding: '2px 8px', borderRadius: '4px', fontSize: '12px', cursor: 'pointer', color: 'var(--text-secondary)' }}
                      >+ Assign School</button>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <button onClick={() => openDetails(mentor, 'availability')} className="section-action" style={{ fontSize: '12px', textDecoration: 'none' }}>📅 Calendar</button>
                      <button onClick={() => openDetails(mentor, 'interactions')} className="section-action" style={{ fontSize: '12px', textDecoration: 'none' }}>💬 Chats</button>
                    </div>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button className="btn btn-sm btn-secondary">Profile</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Assign School */}
      {showAssignModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div className="card" style={{ maxWidth: '500px', width: '100%', padding: '32px' }}>
            <h3 style={{ marginBottom: '20px' }}>Allocate School to {selectedMentor?.full_name}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '400px', overflowY: 'auto', paddingRight: '10px' }}>
              {schools.map(school => (
                <button 
                  key={school.id}
                  onClick={() => handleAssign(school.id)}
                  style={{ 
                    padding: '12px 16px', borderRadius: '10px', border: '1px solid var(--border)', background: 'var(--bg-elevated)',
                    textAlign: 'left', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', justifyContent: 'space-between'
                  }}
                  onMouseOver={e => e.currentTarget.style.borderColor = 'var(--primary-400)'}
                  onMouseOut={e => e.currentTarget.style.borderColor = 'var(--border)'}
                >
                  <span style={{ fontWeight: 600 }}>{school.name}</span>
                  <span style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>{school.district}</span>
                </button>
              ))}
            </div>
            <button className="btn btn-secondary" style={{ width: '100%', marginTop: '20px' }} onClick={() => setShowAssignModal(false)}>Close</button>
          </div>
        </div>
      )}

      {/* Detail Overlay: Availability or Interactions */}
      {viewDetail && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div className="card" style={{ maxWidth: '700px', width: '100%', padding: '32px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
              <h3 style={{ textTransform: 'capitalize' }}>{selectedMentor?.full_name} - {viewDetail}</h3>
              <button onClick={() => setViewDetail(null)} className="btn btn-sm btn-secondary">Close View</button>
            </div>

            {viewDetail === 'availability' ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '12px' }}>
                {detailData?.length === 0 ? <p>No specific availability logs.</p> : detailData.map(a => (
                  <div key={a.id} style={{ padding: '12px', border: '1px solid var(--border)', borderRadius: '8px', textAlign: 'center', background: a.type === 'blocked' ? 'var(--error-glow)' : 'var(--success-glow)' }}>
                    <div style={{ fontSize: '14px', fontWeight: 700 }}>{a.date}</div>
                    <div style={{ fontSize: '12px', color: a.type === 'blocked' ? 'var(--error-400)' : 'var(--success-400)' }}>{a.type}</div>
                    {a.reason && <div style={{ fontSize: '10px', marginTop: '4px', fontStyle: 'italic' }}>"{a.reason}"</div>}
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {detailData?.length === 0 ? <p>No chats yet.</p> : detailData.map(msg => (
                  <div key={msg.id} style={{ padding: '16px', border: '1px solid var(--border)', borderRadius: '12px', background: 'var(--bg-glass)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--primary-400)', fontWeight: 700, marginBottom: '6px' }}>
                      <span>LEARNER @ {msg.schools?.name}</span>
                      <span>{new Date(msg.created_at).toLocaleString()}</span>
                    </div>
                    <p style={{ fontSize: '14px' }}>{msg.message}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
