"use client";

import { useState } from "react";
import { addMentor } from "@/utils/admin-actions";

export default function AddMentorPage() {
  const [status, setStatus] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("submitting");
    const formData = new FormData(e.target);
    const result = await addMentor(formData);
    
    if (result.error) {
      setStatus(`Error: ${result.error}`);
    } else {
      setStatus("Success! Mentor added.");
      e.target.reset();
    }
  }

  return (
    <div className="main-content">
      <div className="page-header">
        <h1 className="page-title">Add New Mentor</h1>
        <p className="page-subtitle">Register a new mentor into the JKKN system</p>
      </div>

      <div className="card" style={{ maxWidth: "600px", margin: "0 auto" }}>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>Name</label>
            <input 
              type="text" 
              name="name" 
              required 
              style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid var(--border-default)", background: "var(--bg-primary)" }}
              placeholder="e.g. Dr. Anitha"
            />
          </div>
          
          <div>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>Email</label>
            <input 
              type="email" 
              name="email" 
              required 
              style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid var(--border-default)", background: "var(--bg-primary)" }}
              placeholder="anitha@jkkn.edu"
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>Expertise Tags (comma separated)</label>
            <input 
              type="text" 
              name="expertise" 
              style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid var(--border-default)", background: "var(--bg-primary)" }}
              placeholder="e.g. Counseling, Core Module, A1"
            />
          </div>

          <button 
            type="submit" 
            disabled={status === "submitting"}
            style={{ 
              padding: "14px", 
              borderRadius: "8px", 
              background: "var(--primary-600)", 
              color: "white", 
              fontWeight: "600",
              cursor: status === "submitting" ? "not-allowed" : "pointer"
            }}
          >
            {status === "submitting" ? "Adding..." : "Add Mentor"}
          </button>
          
          {status && status !== "submitting" && (
            <div style={{ 
              padding: "12px", 
              background: status.startsWith("Error") ? "var(--danger-bg)" : "var(--success-bg)",
              color: status.startsWith("Error") ? "var(--danger-500)" : "var(--success-500)",
              borderRadius: "8px",
              textAlign: "center"
            }}>
              {status}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
