"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { submitAssessment, scheduleSession } from "@/utils/assessment-actions";

export default function AssessmentFlow() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resultCode, setResultCode] = useState(null);

  // Metadata form
  const [metadata, setMetadata] = useState({
    schoolName: '', principal: '', coordinator: '',
    grades: [], section: '', staffMember: '', totalStudents: ''
  });

  // Questionnaire responses
  const [answersA, setAnswersA] = useState({});
  const [answersB, setAnswersB] = useState({});
  
  // Scheduling
  const [schedule, setSchedule] = useState({ date: '', time: '' });

  const handleMetadataChange = (e) => {
    const { name, value } = e.target;
    setMetadata(prev => ({ ...prev, [name]: value }));
  };

  const handleGradeToggle = (grade) => {
    setMetadata(prev => ({
      ...prev,
      grades: prev.grades.includes(grade) 
        ? prev.grades.filter(g => g !== grade)
        : [...prev.grades, grade]
    }));
  };

  const submitForm = async () => {
    setIsSubmitting(true);
    
    const countsA = { X: 0, Y: 0, Z: 0 };
    Object.values(answersA).forEach(val => { countsA[val] = (countsA[val] || 0) + 1; });
    
    const countsB = { P: 0, Q: 0, R: 0 };
    Object.values(answersB).forEach(val => { countsB[val] = (countsB[val] || 0) + 1; });

    const result = await submitAssessment({ metadata, answersA, answersB, countsA, countsB });
    if (result.success) {
      setResultCode(result.moduleCode);
      setStep(4); // Move to success/scheduling step
    }
    setIsSubmitting(false);
  };

  const handleScheduleSubmit = async () => {
    setIsSubmitting(true);
    await scheduleSession({ ...schedule, moduleCode: resultCode });
    setIsSubmitting(false);
    router.push('/school-dashboard');
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', paddingBottom: '60px' }}>
      
      {/* Progress Header */}
      <div style={{ marginBottom: '32px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '12px' }}>
          {step === 1 && "School Profile Details"}
          {step === 2 && "Part 1: Mental Health Baseline"}
          {step === 3 && "Part 2: Environmental Reality"}
          {step === 4 && "Analysis Complete"}
        </h1>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
          {[1,2,3,4].map(i => (
            <div key={i} style={{ 
              height: '6px', width: '40px', borderRadius: '4px',
              background: step >= i ? 'var(--primary-400)' : 'var(--border)' 
            }} />
          ))}
        </div>
      </div>

      <div className="card" style={{ padding: '40px' }}>
        
        {/* STEP 1: METADATA */}
        {step === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <label className="form-label">Name of the School</label>
                <input className="form-input" name="schoolName" value={metadata.schoolName} onChange={handleMetadataChange} placeholder="e.g. JKKN Public School" />
              </div>
              <div>
                <label className="form-label">Name of the Principal</label>
                <input className="form-input" name="principal" value={metadata.principal} onChange={handleMetadataChange} placeholder="Principal Name" />
              </div>
            </div>
            <div>
              <label className="form-label">Name of the Coordinator</label>
              <input className="form-input" name="coordinator" value={metadata.coordinator} onChange={handleMetadataChange} />
            </div>
            
            <div style={{ background: 'var(--bg-glass)', border: '1px solid var(--border)', padding: '20px', borderRadius: '12px' }}>
              <label className="form-label" style={{ marginBottom: '12px' }}>Grades for which the session will be handled</label>
              <div style={{ display: 'flex', gap: '12px' }}>
                {['Grade 8', 'Grade 9', 'Grade 10', 'Grade 11'].map(grade => (
                  <button 
                    key={grade}
                    onClick={() => handleGradeToggle(grade)}
                    style={{
                      padding: '8px 16px', borderRadius: '8px', border: '1px solid', cursor: 'pointer', transition: 'all 0.2s', fontWeight: 600,
                      background: metadata.grades.includes(grade) ? 'var(--primary-glow)' : 'transparent',
                      color: metadata.grades.includes(grade) ? 'var(--primary-400)' : 'var(--text-secondary)',
                      borderColor: metadata.grades.includes(grade) ? 'var(--primary-400)' : 'var(--border)'
                    }}
                  >{grade}</button>
                ))}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
              <div>
                <label className="form-label">Section</label>
                <input className="form-input" name="section" value={metadata.section} onChange={handleMetadataChange} placeholder="e.g. A" />
              </div>
              <div>
                <label className="form-label">Staff Responsible</label>
                <input className="form-input" name="staffMember" value={metadata.staffMember} onChange={handleMetadataChange} />
              </div>
              <div>
                <label className="form-label">Total Students</label>
                <input className="form-input" type="number" name="totalStudents" value={metadata.totalStudents} onChange={handleMetadataChange} />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
              <button 
                className="btn btn-primary" 
                onClick={() => setStep(2)}
                disabled={!metadata.schoolName || metadata.grades.length === 0}
              >Next Step →</button>
            </div>
          </div>
        )}

        {/* STEP 2: CATEGORY A */}
        {step === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Section 1: Mental Health & Awareness (Category A)</p>
            
            <QuestionBlock 
              num={1} 
              q="What are the main things in your life that cause you stress or make you feel worried?"
              opts={[
                { value: 'X', text: 'Image, social media status, and intense competition.' },
                { value: 'Y', text: 'Academic pressure, fear of disappointing parents, and friend drama.' },
                { value: 'Z', text: 'Difficult home life, financial struggles, and adult responsibilities.' }
              ]}
              val={answersA[1]} onChange={(v) => setAnswersA(p => ({...p, 1: v}))}
            />
            
            <QuestionBlock 
              num={2} 
              q="Which of the following best describes your daily relationship with the internet and social media?"
              opts={[
                { value: 'X', text: 'Chasing viral trends and seeking online validation.' },
                { value: 'Y', text: 'Escapism (binge-watching, excessive gaming).' },
                { value: 'Z', text: 'Little focus on digital trends; focused on real-world survival.' }
              ]}
              val={answersA[2]} onChange={(v) => setAnswersA(p => ({...p, 2: v}))}
            />

            <QuestionBlock 
              num={3} 
              q="When things don't go your way (like failing a test or project), what is the first thing you usually do?"
              opts={[
                { value: 'X', text: 'I act "cool" outside, but I’m secretly obsessing over it.' },
                { value: 'Y', text: 'I get very upset, cry, or find it hard to keep going.' },
                { value: 'Z', text: 'I don\'t really feel anything; I just stay in "survival mode."' }
              ]}
              val={answersA[3]} onChange={(v) => setAnswersA(p => ({...p, 3: v}))}
            />

            <QuestionBlock 
              num={4} 
              q="When you get into an argument or a fight, what is usually the reason?"
              opts={[
                { value: 'X', text: 'Online drama, reputation, and group chat exclusions.' },
                { value: 'Y', text: 'Interpersonal misunderstandings, jealousy, or feeling left out.' },
                { value: 'Z', text: 'Physical intimidation or neighborhood disputes.' }
              ]}
              val={answersA[4]} onChange={(v) => setAnswersA(p => ({...p, 4: v}))}
            />

            <QuestionBlock 
              num={5} 
              q="When you are in big trouble, who do you actually go to for help?"
              opts={[
                { value: 'X', text: 'Peers and the internet (fear adults will judge them).' },
                { value: 'Y', text: 'No one (want help but fear getting in trouble).' },
                { value: 'Z', text: 'No one (believe their situation cannot be fixed).' }
              ]}
              val={answersA[5]} onChange={(v) => setAnswersA(p => ({...p, 5: v}))}
            />

            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border)', paddingTop: '24px' }}>
              <button className="btn btn-secondary" onClick={() => setStep(1)}>← Back</button>
              <button 
                className="btn btn-primary" 
                onClick={() => setStep(3)}
                disabled={Object.keys(answersA).length < 5}
              >Next Section →</button>
            </div>
          </div>
        )}

        {/* STEP 3: CATEGORY B */}
        {step === 3 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Section 2: Usage & Peer Pressure (Category B)</p>
            
            <QuestionBlock 
              num={6} 
              q="Boundary Setting (Can they say 'No'?)"
              opts={[
                { value: 'P', text: 'Yes, confidently and effectively.' },
                { value: 'Q', text: 'No, they fear being labeled "uncool" (FOMO).' },
                { value: 'R', text: 'No, they are physically/socially afraid of older/dominant peers.' }
              ]}
              val={answersB[6]} onChange={(v) => setAnswersB(p => ({...p, 6: v}))}
            />

            <QuestionBlock 
              num={7} 
              q="Where do they spend most of their time after school ends?"
              opts={[
                { value: 'P', text: 'Safe, supervised places (home, tuition, sports).' },
                { value: 'Q', text: 'Unsupervised hangouts (malls, cafes) where dares happen.' },
                { value: 'R', text: 'High-risk, unstructured streets with visible substance use.' }
              ]}
              val={answersB[7]} onChange={(v) => setAnswersB(p => ({...p, 7: v}))}
            />

            <QuestionBlock 
              num={8} 
              q="How do they try to join a group or make themselves part of a circle?"
              opts={[
                { value: 'P', text: 'Through shared hobbies, academics, or sports.' },
                { value: 'Q', text: 'By copying the group\'s habits (e.g., vaping, slang, rule-breaking).' },
                { value: 'R', text: 'By proving toughness or doing risky dares.' }
              ]}
              val={answersB[8]} onChange={(v) => setAnswersB(p => ({...p, 8: v}))}
            />

            <QuestionBlock 
              num={9} 
              q="What do they do when they see a friend or classmate in serious trouble?"
              opts={[
                { value: 'P', text: 'Try to stop them or tell a trusted adult.' },
                { value: 'Q', text: 'Practice "toxic loyalty" by hiding the behavior to protect the friend.' },
                { value: 'R', text: 'Join in out of fear, or ignore it because intervening is dangerous.' }
              ]}
              val={answersB[9]} onChange={(v) => setAnswersB(p => ({...p, 9: v}))}
            />

            <QuestionBlock 
              num={10} 
              q="What is the main reason they take risks or do something dangerous?"
              opts={[
                { value: 'P', text: 'Rarely happens; just isolated, brief rebellion.' },
                { value: 'Q', text: 'FOMO and mimicking internet trends.' },
                { value: 'R', text: 'Numbing emotional pain or being pressured by older community members.' }
              ]}
              val={answersB[10]} onChange={(v) => setAnswersB(p => ({...p, 10: v}))}
            />

            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border)', paddingTop: '24px' }}>
              <button className="btn btn-secondary" onClick={() => setStep(2)}>← Back</button>
              <button 
                className="btn btn-primary" 
                onClick={submitForm}
                disabled={Object.keys(answersB).length < 5 || isSubmitting}
              >{isSubmitting ? 'Processing...' : 'Submit & Analyze'}</button>
            </div>
          </div>
        )}

        {/* STEP 4: RESULT & SCHEDULE */}
        {step === 4 && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', animation: 'fadeInUp 0.6s ease-out' }}>
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>🎉</div>
            <h2 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '12px' }}>Assessment Registered</h2>
            
            <div style={{ background: 'var(--bg-glass)', border: '1px solid var(--border)', padding: '24px', borderRadius: '16px', marginBottom: '32px', width: '100%', maxWidth: '400px' }}>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600 }}>Assigned Module</p>
              <div style={{ fontSize: '48px', fontWeight: 900, color: 'var(--primary-400)', letterSpacing: '-2px', margin: '8px 0' }}>
                {resultCode}
              </div>
              <p style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>This matrix will guide our expert mentors during the sessions.</p>
            </div>

            <div style={{ width: '100%', borderTop: '1px solid var(--border)', paddingTop: '32px', textAlign: 'left' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '20px' }}>Proceed to Live Scheduling</h3>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '24px' }}>
                Choose a date and time to take this specific module to live sessions with JKKN trainers and mentors.
              </p>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '32px' }}>
                <div>
                  <label className="form-label">Preferred Date</label>
                  <input type="date" className="form-input" value={schedule.date} onChange={e => setSchedule(p => ({...p, date: e.target.value}))} />
                </div>
                <div>
                  <label className="form-label">Preferred Time</label>
                  <input type="time" className="form-input" value={schedule.time} onChange={e => setSchedule(p => ({...p, time: e.target.value}))} />
                </div>
              </div>

              <button 
                className="btn btn-success" 
                style={{ width: '100%', justifyContent: 'center', padding: '16px', fontSize: '16px' }}
                onClick={handleScheduleSubmit}
                disabled={!schedule.date || !schedule.time || isSubmitting}
              >
                {isSubmitting ? 'Confirming...' : 'Confirm Live Session Date'}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

function QuestionBlock({ num, q, opts, val, onChange }) {
  return (
    <div style={{ padding: '24px', background: 'var(--bg-glass)', borderRadius: '16px', border: '1px solid var(--border-subtle)' }}>
      <p style={{ fontWeight: 600, fontSize: '16px', color: 'var(--text-primary)', marginBottom: '16px' }}>
        <span style={{ color: 'var(--primary-400)', marginRight: '6px' }}>{num}.</span> {q}
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {opts.map(opt => (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            style={{
              padding: '16px 20px', borderRadius: '12px', border: '1px solid', cursor: 'pointer', textAlign: 'left',
              transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '16px',
              background: val === opt.value ? 'var(--primary-glow)' : 'transparent',
              borderColor: val === opt.value ? 'var(--primary-400)' : 'var(--border)',
              color: val === opt.value ? 'var(--primary-400)' : 'var(--text-secondary)',
            }}
          >
            <div style={{ 
              width: '24px', height: '24px', borderRadius: '50%', flexShrink: 0,
              border: `2px solid ${val === opt.value ? 'var(--primary-400)' : 'var(--border)'}`,
              background: val === opt.value ? 'var(--primary-400)' : 'transparent',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              {val === opt.value && <span style={{ color: 'white', fontSize: '12px', fontWeight: 'bold' }}>✓</span>}
            </div>
            <span style={{ fontWeight: 500, fontSize: '14px', lineHeight: 1.4 }}>{opt.text}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
