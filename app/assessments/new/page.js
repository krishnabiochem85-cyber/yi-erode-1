"use client";

import Link from "next/link";
import { useState } from "react";

const assessmentQuestions = [
  { id: 1, type: 'scale', text: "1. Rate the general awareness level of students regarding substance abuse." },
  { id: 2, type: 'scale', text: "2. How often do instances of behavioral risk issues (e.g. smoking, drinking) surface in school?" },
  { id: 3, type: 'multiple_choice', text: "3. Are students openly discussing social media peer-pressure?", options: ['Rarely', 'Sometimes', 'Often'] },
  { id: 4, type: 'scale', text: "4. Rate the current effectiveness of school boundaries/rules against substance possession." },
  { id: 5, type: 'multiple_choice', text: "5. How comfortable are students with confidential sharing to staff?", options: ['Very Uncomfortable', 'Neutral', 'Comfortable'] },
];

export default function NewAssessmentPage() {
  const [step, setStep] = useState(1);
  const totalSteps = 2;

  return (
    <div>
      <div className="page-header">
        <Link href="/assessments" style={{ fontSize: '13px', color: 'var(--text-secondary)', textDecoration: 'none', marginBottom: '8px', display: 'inline-block' }}>
          ← Back to Assessments
        </Link>
        <div className="page-header-row">
          <div>
            <h1 className="page-title">Module Planning Assessment</h1>
            <p className="page-subtitle">Standard 10-Question Diagnostic Tool</p>
          </div>
        </div>
      </div>

      <div className="card" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
            <span>Step {step} of {totalSteps}</span>
            <span>{step === 1 ? 'Demographic & General Awareness' : 'Behavioral Risk Indicators'}</span>
          </div>
          <div className="progress-bar">
             <div className="progress-fill" style={{ width: step === 1 ? '50%' : '100%' }}></div>
          </div>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); if (step === 1) setStep(2); }}>
          
          {step === 1 && (
            <div className="form-group">
              <label className="form-label" style={{ fontSize: '15px', color: 'var(--text-primary)', marginBottom: '16px' }}>
                Select School
              </label>
              <select className="form-input" style={{ marginBottom: '24px' }}>
                <option value="">-- Choose a registered school --</option>
                <option value="1">Kongu Vellalar Matric</option>
                <option value="2">Govt. Boys Hr Sec School</option>
              </select>

              {assessmentQuestions.slice(0, 3).map(q => (
                <div key={q.id} style={{ marginBottom: '24px', paddingBottom: '24px', borderBottom: '1px solid var(--border-subtle)' }}>
                  <label className="form-label" style={{ fontSize: '14px', color: 'var(--text-primary)', marginBottom: '12px', display: 'block' }}>
                    {q.text}
                  </label>
                  
                  {q.type === 'scale' && (
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <span style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>Low (1)</span>
                      <input type="range" min="1" max="5" defaultValue="3" style={{ flex: 1, accentColor: 'var(--primary-500)' }} />
                      <span style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>High (5)</span>
                    </div>
                  )}

                  {q.type === 'multiple_choice' && (
                    <div style={{ display: 'flex', gap: '16px' }}>
                      {q.options.map(opt => (
                        <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
                          <input type="radio" name={`q${q.id}`} value={opt} />
                          {opt}
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {step === 2 && (
             <div className="form-group">
                {assessmentQuestions.slice(3).map(q => (
                <div key={q.id} style={{ marginBottom: '24px', paddingBottom: '24px', borderBottom: '1px solid var(--border-subtle)' }}>
                  <label className="form-label" style={{ fontSize: '14px', color: 'var(--text-primary)', marginBottom: '12px', display: 'block' }}>
                    {q.text}
                  </label>
                  
                  {q.type === 'scale' && (
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <span style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>Weak (1)</span>
                      <input type="range" min="1" max="5" defaultValue="3" style={{ flex: 1, accentColor: 'var(--primary-500)' }} />
                      <span style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>Strong (5)</span>
                    </div>
                  )}

                  {q.type === 'multiple_choice' && (
                    <div style={{ display: 'flex', gap: '16px' }}>
                      {q.options.map(opt => (
                        <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
                          <input type="radio" name={`q${q.id}`} value={opt} />
                          {opt}
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              ))}
             </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '32px' }}>
            {step > 1 ? (
              <button type="button" className="btn btn-secondary" onClick={() => setStep(1)}>Previous</button>
            ) : <div></div>}
            
            {step < totalSteps ? (
              <button type="submit" className="btn btn-primary">Next Step</button>
            ) : (
              <button type="button" className="btn btn-primary" onClick={() => alert('Assessment Complete! Categorizing school...')}>Submit Assessment</button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
