"use client";

import { useState } from "react";
import { createSession } from "@/utils/mentor-actions";

export default function NewSessionPage() {
  const [status, setStatus] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("submitting");
    const formData = new FormData(e.target);
    const result = await createSession(formData);
    
    if (result.error) {
      setStatus(`Error: ${result.error}`);
    } else {
      setStatus("Success! Session created.");
      e.target.reset();
    }
  }

  return (
    <div style={{ animation: 'fadeIn 0.4s ease-out' }}>
      <div className="page-header">
        <h1 className="page-title">New Session</h1>
        <p className="page-subtitle">Schedule a new awareness session</p>
      </div>

      <div className="card" style={{ maxWidth: "600px", margin: "0 auto" }}>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>Session Title</label>
            <input 
              type="text" 
              name="title" 
              required 
              style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid var(--border-default)", background: "var(--bg-primary)" }}
              placeholder="e.g. Awareness Campaign at Bharathi Vidya Bhavan"
            />
          </div>
          
          <div>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>Description</label>
            <textarea 
              name="description" 
              rows="3"
              style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid var(--border-default)", background: "var(--bg-primary)" }}
              placeholder="Any details about the upcoming session..."
            ></textarea>
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>Date & Time</label>
            <input 
              type="datetime-local" 
              name="scheduled_at" 
              required 
              style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid var(--border-default)", background: "var(--bg-primary)" }}
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
            {status === "submitting" ? "Scheduling..." : "Schedule Session"}
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
