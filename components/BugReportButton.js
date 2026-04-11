'use client';

import { useState, useRef } from 'react';
import { submitBugReport } from '@/utils/bug-report-actions';
import { createClient } from '@/utils/supabase/client';

export default function BugReportButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [screenshot, setScreenshot] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setScreenshot(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Please enter a title for the bug report.');
      return;
    }

    setSubmitting(true);
    let screenshotUrl = null;

    // Upload screenshot if present
    if (screenshot) {
      try {
        const supabase = createClient();
        const fileName = `bug_${Date.now()}_${screenshot.name}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('bug-screenshots')
          .upload(fileName, screenshot);

        if (!uploadError && uploadData) {
          const { data: urlData } = supabase.storage
            .from('bug-screenshots')
            .getPublicUrl(uploadData.path);
          screenshotUrl = urlData?.publicUrl || null;
        }
      } catch (err) {
        console.error('Screenshot upload error:', err);
      }
    }

    const result = await submitBugReport({
      title,
      description,
      screenshotUrl,
      pageUrl: window.location.href
    });

    if (result.success) {
      setSuccess(true);
      setTitle('');
      setDescription('');
      setScreenshot(null);
      setPreviewUrl(null);
      setTimeout(() => {
        setSuccess(false);
        setIsOpen(false);
      }, 2500);
    } else {
      alert(`Error: ${result.error}`);
    }

    setSubmitting(false);
  };

  const handleClose = () => {
    setIsOpen(false);
    setSuccess(false);
    setTitle('');
    setDescription('');
    setScreenshot(null);
    setPreviewUrl(null);
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        title="Report a Bug"
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #ef4444, #f97316)',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '24px',
          boxShadow: '0 6px 24px rgba(239,68,68,0.4)',
          zIndex: 9998,
          transition: 'transform 0.2s, box-shadow 0.2s'
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.transform = 'scale(1.1)';
          e.currentTarget.style.boxShadow = '0 8px 32px rgba(239,68,68,0.5)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '0 6px 24px rgba(239,68,68,0.4)';
        }}
      >
        🐛
      </button>

      {/* Modal Overlay */}
      {isOpen && (
        <div
          onClick={handleClose}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(4px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            animation: 'fadeIn 0.2s ease-out'
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'var(--bg-primary, #1a1a2e)',
              borderRadius: '20px',
              border: '1px solid var(--border, #333)',
              padding: '32px',
              width: '90%',
              maxWidth: '520px',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 24px 80px rgba(0,0,0,0.4)'
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div>
                <h3 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary, #fff)', margin: 0 }}>🐛 Report a Bug</h3>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary, #888)', marginTop: '4px' }}>Help us improve by reporting issues you encounter.</p>
              </div>
              <button
                onClick={handleClose}
                style={{
                  width: '36px', height: '36px', borderRadius: '50%',
                  background: 'var(--bg-elevated, #252540)', border: 'none',
                  color: 'var(--text-secondary, #888)', fontSize: '18px',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}
              >
                ✕
              </button>
            </div>

            {success ? (
              <div style={{
                padding: '40px', textAlign: 'center', borderRadius: '16px',
                background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.3)'
              }}>
                <div style={{ fontSize: '48px', marginBottom: '12px' }}>✅</div>
                <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--success-400, #34d399)' }}>Bug Report Submitted!</div>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary, #888)', marginTop: '8px' }}>The admin team will review your report shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                {/* Title */}
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary, #aaa)', marginBottom: '6px' }}>
                    Bug Title *
                  </label>
                  <input
                    className="form-input"
                    placeholder="e.g. Calendar not saving dates"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    required
                    style={{ width: '100%' }}
                  />
                </div>

                {/* Description */}
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary, #aaa)', marginBottom: '6px' }}>
                    What happened?
                  </label>
                  <textarea
                    className="form-input"
                    placeholder="Describe the issue in detail..."
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    rows={4}
                    style={{ width: '100%', resize: 'vertical' }}
                  />
                </div>

                {/* Screenshot Upload */}
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary, #aaa)', marginBottom: '6px' }}>
                    Attach Screenshot
                  </label>
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                      border: '2px dashed var(--border, #444)',
                      borderRadius: '12px',
                      padding: previewUrl ? '8px' : '32px',
                      textAlign: 'center',
                      cursor: 'pointer',
                      transition: 'border-color 0.2s',
                      background: 'var(--bg-elevated, #252540)',
                      position: 'relative'
                    }}
                  >
                    {previewUrl ? (
                      <div style={{ position: 'relative' }}>
                        <img
                          src={previewUrl}
                          alt="Screenshot preview"
                          style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '8px', objectFit: 'contain' }}
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setScreenshot(null);
                            setPreviewUrl(null);
                          }}
                          style={{
                            position: 'absolute', top: '4px', right: '4px',
                            width: '28px', height: '28px', borderRadius: '50%',
                            background: 'rgba(239,68,68,0.9)', border: 'none',
                            color: '#fff', fontSize: '14px', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                          }}
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <div>
                        <div style={{ fontSize: '32px', marginBottom: '8px', opacity: 0.6 }}>📷</div>
                        <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-secondary, #aaa)' }}>
                          Click to upload a screenshot
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--text-tertiary, #666)', marginTop: '4px' }}>
                          PNG, JPG up to 5MB
                        </div>
                      </div>
                    )}
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                  />
                </div>

                {/* Current Page Info */}
                <div style={{
                  padding: '10px 14px', borderRadius: '8px', fontSize: '11px',
                  background: 'var(--bg-elevated, #252540)', color: 'var(--text-tertiary, #666)',
                  marginBottom: '20px'
                }}>
                  📍 Page: {typeof window !== 'undefined' ? window.location.pathname : ''}
                </div>

                {/* Submit */}
                <button
                  className="btn btn-primary"
                  type="submit"
                  disabled={submitting}
                  style={{ width: '100%', padding: '14px', fontSize: '15px', fontWeight: 700 }}
                >
                  {submitting ? 'Submitting...' : '🚀 Submit Bug Report'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
