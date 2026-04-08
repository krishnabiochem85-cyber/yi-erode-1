"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { submitStudentFeedback } from "@/utils/feedback-actions";

const PILLARS = [
  { id: 'saying_no', name: 'Saying No', emoji: '🚫', description: 'Learning to say no to peers' },
  { id: 'boundaries', name: 'Boundaries', emoji: '🛡️', description: 'Personal safety and space' },
  { id: 'confidential_sharing', name: 'Confidentiality', emoji: '🤫', description: 'Safe sharing spaces' },
  { id: 'suicide', name: 'Suicide Awareness', emoji: '❤️‍🩹', description: 'Mental health support' },
  { id: 'social_media', name: 'Social Media', emoji: '📱', description: 'Responsible digital choices' },
  { id: 'substance', name: 'Substance Abuse', emoji: '💊', description: 'Smart health choices' }
];

export default function StudentFeedbackPage() {
  const { id: sessionId } = useParams();
  const [ratings, setRatings] = useState({
    saying_no: 5,
    boundaries: 5,
    confidential_sharing: 5,
    suicide: 5,
    social_media: 5,
    substance: 5
  });
  const [comments, setComments] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleRating = (pillarId, value) => {
    setRatings(prev => ({ ...prev, [pillarId]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await submitStudentFeedback(sessionId, ratings, comments);
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      alert("Submission failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div style={{ 
        minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', 
        padding: '24px', background: 'var(--bg-base)', textAlign: 'center' 
      }}>
        <div style={{ fontSize: '64px', marginBottom: '16px' }}>🌟</div>
        <h1 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '12px' }}>Thank You!</h1>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '300px' }}>
          Your feedback helps us make <strong>Mission On</strong> better for everyone. Your smart choices matter!
        </p>
        <div style={{ marginTop: '32px', color: 'var(--primary-400)', fontWeight: 700 }}>Project Shield | Yi Erode</div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '32px 20px', background: 'var(--bg-base)', minHeight: '100vh' }}>
      
      {/* Brand Header */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
         <div style={{ display: 'inline-block', padding: '6px 12px', background: 'var(--accent-glow)', color: 'var(--accent-400)', borderRadius: '20px', fontSize: '13px', fontWeight: 700, marginBottom: '16px' }}>
            SESSION FEEDBACK
         </div>
         <h1 style={{ fontSize: '24px', fontWeight: 900, marginBottom: '8px' }}>Mission On: Smart Choices</h1>
         <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Tell us how today&apos;s session helped you!</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginBottom: '40px' }}>
          {PILLARS.map(pillar => (
            <div key={pillar.id} className="card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px', background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '24px' }}>{pillar.emoji}</span>
                    <span style={{ fontWeight: 700, fontSize: '16px' }}>{pillar.name}</span>
                  </div>
                  <span style={{ fontWeight: 800, color: 'var(--primary-400)', fontSize: '20px' }}>{ratings[pillar.id]}</span>
               </div>
               
               <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px' }}>
                  {[1, 2, 3, 4, 5].map(star => (
                    <button 
                      key={star}
                      type="button"
                      onClick={() => handleRating(pillar.id, star)}
                      style={{ 
                        fontSize: '28px', background: 'none', border: 'none', cursor: 'pointer',
                        filter: star <= ratings[pillar.id] ? 'grayscale(0)' : 'grayscale(1)',
                        opacity: star <= ratings[pillar.id] ? 1 : 0.3, transition: 'all 0.2s'
                      }}
                    >
                      {star <= ratings[pillar.id] ? '⭐' : '☆'}
                    </button>
                  ))}
               </div>
               <p style={{ fontSize: '12px', color: 'var(--text-tertiary)', fontStyle: 'italic' }}>{pillar.description}</p>
            </div>
          ))}
        </div>

        <div className="card" style={{ padding: '24px', marginBottom: '32px' }}>
          <label style={{ fontWeight: 700, marginBottom: '12px', display: 'block' }}>Any other thoughts or questions?</label>
          <textarea 
            className="form-input" 
            placeholder="Your comments are confidential..." 
            rows={4}
            value={comments}
            onChange={e => setComments(e.target.value)}
            style={{ minHeight: '120px' }}
          />
        </div>

        <button 
          type="submit" 
          disabled={isSubmitting}
          className="btn btn-primary" 
          style={{ width: '100%', height: '56px', fontSize: '18px', fontWeight: 800 }}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Evaluation 🚀'}
        </button>
      </form>

      <footer style={{ marginTop: '60px', textAlign: 'center', color: 'var(--text-tertiary)', fontSize: '12px' }}>
        © 2026 Young Indians Erode Chapter | Project Shield
      </footer>
    </div>
  );
}
