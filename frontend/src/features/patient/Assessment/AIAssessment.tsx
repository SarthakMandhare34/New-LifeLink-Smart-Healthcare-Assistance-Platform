/**
 * ============================================================================
 * AI SYMPTOM CHECKER UI
 * ============================================================================
 * 
 * WHY THIS FILE IS SPECIAL:
 * This React component provides the interface for patients to type their symptoms.
 * It manages complex loading states while waiting for Google's supercomputers to reply,
 * ensuring the user feels calm and informed during a potentially stressful medical moment.
 */
import React, { useState } from 'react';
import { AlertCircle, ArrowRight, ShieldAlert, Stethoscope, Clock, Activity, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Input } from '../../../components/ui/Input';
import { Popup } from '../../../components/ui/Popup';
import { ValidationMessage } from '../../../components/ui/ValidationMessage';
import { formatUserFriendlyError } from '../../../lib/errorFormatting';
import { trpc } from '../../../lib/trpc';

type AssessmentResult = {
  id: number;
  createdAt: Date | string;
  symptoms: string;
  age: number;
  gender: string;
  conditions?: string | null;
  duration: string;
  urgency: 'LOW' | 'MODERATE' | 'EMERGENCY' | 'ERROR';
  reason: string;
  specialty: string;
  guidance: string;
};

function urgencyBadgeStyle(urgency: AssessmentResult['urgency']) {
  if (urgency === 'EMERGENCY') {
    return { bg: 'rgba(220, 38, 38, 0.12)', color: 'var(--color-semantic-emergency)', border: '1px solid rgba(220, 38, 38, 0.2)' };
  }
  if (urgency === 'MODERATE') {
    return { bg: 'rgba(217, 119, 6, 0.12)', color: 'var(--color-semantic-warning)', border: '1px solid rgba(217, 119, 6, 0.2)' };
  }
  if (urgency === 'ERROR') {
    return { bg: 'rgba(225, 29, 72, 0.12)', color: 'var(--color-semantic-emergency)', border: '1px solid rgba(225, 29, 72, 0.2)' };
  }
  return { bg: 'rgba(13, 148, 136, 0.12)', color: 'var(--color-semantic-success)', border: '1px solid rgba(13, 148, 136, 0.2)' };
}

// AI symptom evaluation and clinical decision-support triage page
export const AIAssessment = () => {
  const trpcUtils = trpc.useUtils();                                                       // Cache invalidation client
  const savedAssessments = trpc.assessment.list.useQuery();                                // Query historical assessments for patient
  const analyzeAssessment = trpc.assessment.analyze.useMutation();                         // Mutation to trigger live Gemini evaluation
  const navigate = useNavigate();                                                          // Programmatic navigation hook

  const [symptoms, setSymptoms] = useState('');                                            // Patient symptom description text
  const [age, setAge] = useState('');                                                      // Patient age input string
  const [gender, setGender] = useState('');                                                // Stated biological gender ('Male', 'Female', 'Other')
  const [conditions, setConditions] = useState('');                                        // Pre-existing medical conditions
  const [duration, setDuration] = useState('');                                            // Symptom onset / duration
  const [result, setResult] = useState<AssessmentResult | null>(null);                     // Newly returned assessment result
  const [selectedHistoryItem, setSelectedHistoryItem] = useState<AssessmentResult | null>(null); // Historical assessment chosen for popup
  const [isProcessing, setIsProcessing] = useState(false);                                 // Processing state while waiting for AI response
  const [apiError, setApiError] = useState<string | null>(null);                           // Error message string
  const [isResultModalOpen, setIsResultModalOpen] = useState(false);                       // Modal visibility state

  // Resets symptom form inputs
  const resetForm = () => {
    setSymptoms('');
    setAge('');
    setGender('');
    setConditions('');
    setDuration('');
    setResult(null);
    setApiError(null);
  };

  // Handles closing the triage results modal
  const handleCloseResult = () => {
    setIsResultModalOpen(false);                                                           // Close dialog
    if (result?.urgency !== 'EMERGENCY') resetForm();                                      // Keep emergency details visible
  };

  // Submits patient clinical data to tRPC for Gemini AI evaluation
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();                                                                // Prevent browser form reload
    const parsedAge = Number.parseInt(age, 10);                                            // Parse numeric age
    if (!symptoms.trim() || Number.isNaN(parsedAge) || parsedAge < 0 || parsedAge > 100 || !gender || !duration.trim()) {
      setApiError('Please fill out all required fields with valid values (Age between 0 and 100).'); // Validation failure
      return;
    }

    setIsProcessing(true);                                                                 // Activate loading animation
    setApiError(null);                                                                     // Clear existing error
    try {
      const assessment = await analyzeAssessment.mutateAsync({                             // Send request to backend
        symptoms: symptoms.trim(),
        age: parsedAge,
        gender,
        conditions: conditions.trim() || undefined,
        duration: duration.trim(),
      });
      await trpcUtils.assessment.list.invalidate();                                        // Invalidate assessment history cache
      await trpcUtils.patientDashboard.summary.invalidate();                               // Invalidate dashboard metrics
      setResult(assessment);                                                               // Store returned triage output
      setIsResultModalOpen(true);                                                          // Open result modal popup
    } catch (error: any) {
      console.error('Assessment failed', error);
      setApiError(formatUserFriendlyError(error, 'Live AI health assessment is temporarily unavailable. Please try again or seek appropriate professional medical care based on your symptoms.'));
    } finally {
      setIsProcessing(false);                                                              // Clear loading state
    }
  };

  // Navigates patient directly to specialist directory pre-filtered by recommended specialty
  const findSpecialist = () => {
    const specialtyToQuery = result?.specialty || selectedHistoryItem?.specialty || '';   // Identify target specialty
    navigate(`/patient/specialists?specialty=${encodeURIComponent(specialtyToQuery)}`);    // Route to specialist search
  };

  const activeModalItem = result || selectedHistoryItem;                                   // Active item being viewed in popup

  // Look up matched in-system doctor for the recommended specialty
  const matchedDoctorQuery = trpc.patientDiscovery.list.useQuery(
    { specialty: activeModalItem?.specialty },
    {
      enabled: Boolean(
        activeModalItem?.specialty &&
        activeModalItem.specialty !== 'Emergency Care' &&
        activeModalItem.specialty !== 'Error'
      ),
    }
  );
  const matchedDoctor = matchedDoctorQuery.data?.[0];                                      // First matching specialist

  const cardStyle = {
    background: 'var(--color-surface-white)',
    padding: 'clamp(16px, 4vw, 28px)',
    borderRadius: '10px',
    border: '1px solid var(--color-border)',
  };

  return (
    <div className="container" style={{ padding: 0, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
      {/* Header section with icon and title */}
      <header className="mb-4 flex items-center gap-3">
        <div style={{ width: 44, height: 44, borderRadius: '8px', background: 'var(--color-primary-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Activity size={24} color="var(--color-primary)" />
        </div>
        <div>
          <h1 style={{ margin: 0, fontFamily: 'Plus Jakarta Sans, sans-serif', color: 'var(--color-text)', fontSize: '2rem', fontWeight: 700, letterSpacing: '-0.02em' }}>
            AI Health Assessment
          </h1>
          <p className="caption" style={{ color: 'var(--color-text-muted)' }}>
            Enter your symptoms below to get an intelligent preliminary clinical guidance and specialist routing recommendation.
          </p>
        </div>
      </header>

      {/* Main Assessment Card */}
      <Card variant="default" style={cardStyle}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Validation Alert */}
          {apiError && (
            <ValidationMessage message={apiError} type="error" />
          )}

          {/* Symptoms Input */}
          <label htmlFor="ai-assessment-symptoms" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <span style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--color-text)' }}>
              Describe your symptoms <span style={{ color: 'var(--color-semantic-emergency)' }}>*</span>
            </span>
            <textarea 
              id="ai-assessment-symptoms"
              value={symptoms} 
              onChange={(event) => setSymptoms(event.target.value)} 
              placeholder="Describe what you are feeling, when it started, and what makes it better or worse." 
              required 
              rows={4}
              style={{
                width: '100%',
                padding: '14px',
                border: '1px solid var(--color-border)',
                borderRadius: '8px',
                fontSize: '0.92rem',
                fontFamily: 'Plus Jakarta Sans, sans-serif',
                background: 'var(--color-surface-white)',
                color: 'var(--color-text)',
                outline: 'none',
                resize: 'vertical',
              }}
            />
          </label>
          
          {/* Grid: Age & Gender */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: '16px' }}>
            <label htmlFor="ai-assessment-age" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <span style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--color-text)' }}>
                Age (0 – 100) <span style={{ color: 'var(--color-semantic-emergency)' }}>*</span>
              </span>
              <Input 
                id="ai-assessment-age"
                type="number"
                min={0}
                max={100}
                value={age} 
                onChange={(event) => {
                  const val = event.target.value;
                  if (val === '') {
                    setAge('');
                    return;
                  }
                  const num = Number(val);
                  if (!Number.isNaN(num)) {
                    if (num < 0) setAge('0');
                    else if (num > 100) setAge('100');
                    else setAge(val);
                  }
                }} 
                placeholder="e.g. 32"
                required 
                style={{ border: '1px solid var(--color-border)', background: 'var(--color-surface-white)', color: 'var(--color-text)', borderRadius: '8px' }}
              />
            </label>
            
            <label htmlFor="ai-assessment-gender" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <span style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--color-text)' }}>
                Biological Gender <span style={{ color: 'var(--color-semantic-emergency)' }}>*</span>
              </span>
              <select 
                id="ai-assessment-gender"
                aria-label="Biological Gender"
                value={gender} 
                onChange={(event) => setGender(event.target.value)} 
                required 
                style={{
                  height: '42px',
                  padding: '0 12px',
                  border: '1px solid var(--color-border)',
                  borderRadius: '8px',
                  fontSize: '0.92rem',
                  fontFamily: 'Plus Jakarta Sans, sans-serif',
                  background: 'var(--color-surface-white)',
                  color: 'var(--color-text)',
                  outline: 'none',
                }}
              >
                <option value="" disabled>Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </label>
          </div>
          
          {/* Duration & Existing Conditions */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: '16px' }}>
            <label htmlFor="ai-assessment-duration" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <span style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--color-text)' }}>
                Symptom Duration <span style={{ color: 'var(--color-semantic-emergency)' }}>*</span>
              </span>
              <Input 
                id="ai-assessment-duration"
                type="text" 
                value={duration} 
                onChange={(event) => setDuration(event.target.value)} 
                placeholder="e.g. 2 days, 1 week" 
                required 
                style={{ border: '1px solid var(--color-border)', background: 'var(--color-surface-white)', color: 'var(--color-text)', borderRadius: '8px' }} 
              />
            </label>
            
            <label htmlFor="ai-assessment-conditions" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <span style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--color-text)' }}>
                Existing Conditions <span style={{ color: 'var(--color-text-muted)', fontWeight: 400 }}>(optional)</span>
              </span>
              <Input 
                id="ai-assessment-conditions"
                type="text" 
                value={conditions} 
                onChange={(event) => setConditions(event.target.value)} 
                placeholder="e.g. Asthma, Hypertension" 
                style={{ border: '1px solid var(--color-border)', background: 'var(--color-surface-white)', color: 'var(--color-text)', borderRadius: '8px' }} 
              />
            </label>
          </div>
          
          <Button 
            type="submit" 
            variant="primary" 
            className="btn-primary"
            disabled={isProcessing} 
            style={{
              padding: '14px',
              fontSize: '1rem',
              fontWeight: 700,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '8px',
              borderRadius: '8px',
              marginTop: '8px',
            }}
          >
            {isProcessing ? 'Analyzing symptoms…' : 'Analyse Symptoms'} <Stethoscope size={18} />
          </Button>
        </form>
      </Card>

      {/* Saved Assessment History Section */}
      <section aria-labelledby="saved-assessments-heading" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <h2 id="saved-assessments-heading" style={{ fontSize: '1.4rem', fontWeight: 700, margin: 0, color: 'var(--color-text)', fontFamily: 'Plus Jakarta Sans, sans-serif', letterSpacing: '-0.02em' }}>
            Assessment History
          </h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', margin: '2px 0 0' }}>
            Persisted triage records from your previous health assessments.
          </p>
        </div>

        {savedAssessments.isLoading ? (
          <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', fontStyle: 'italic' }}>Loading your assessment history…</p>
        ) : savedAssessments.data && savedAssessments.data.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))', gap: '16px' }}>
            {savedAssessments.data.map((item: any) => {
              const badge = urgencyBadgeStyle(item.urgency);
              return (
                <Card 
                  key={item.id} 
                  style={{
                    background: 'var(--color-surface-white)',
                    padding: '20px',
                    borderRadius: '10px',
                    border: '1px solid var(--color-border)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '12px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>
                      {new Date(item.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    <span
                      style={{
                        padding: '3px 10px',
                        borderRadius: '6px',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        background: badge.bg,
                        color: badge.color,
                        border: badge.border,
                      }}
                    >
                      {item.urgency}
                    </span>
                  </div>

                  <div>
                    <strong style={{ fontSize: '0.95rem', color: 'var(--color-text)', display: 'block', fontWeight: 700 }}>
                      {item.specialty}
                    </strong>
                    <p style={{ margin: '4px 0 0', fontSize: '0.82rem', color: 'var(--color-text-muted)', opacity: 0.85, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {item.symptoms}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedHistoryItem(item);
                      setIsResultModalOpen(true);
                    }}
                    aria-label={`View triage details for assessment from ${new Date(item.createdAt).toLocaleDateString()}`}
                    style={{
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      color: 'var(--color-primary)',
                      background: 'none',
                      border: 'none',
                      padding: 0,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      alignSelf: 'flex-start',
                    }}
                  >
                    View Details <ArrowRight size={12} />
                  </button>
                </Card>
              );
            })}
          </div>
        ) : (
          <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', fontStyle: 'italic' }}>
            No saved assessments yet. Completed assessments will automatically appear here.
          </p>
        )}
      </section>

      {/* Result Popup Modal */}
      <Popup 
        isOpen={isResultModalOpen && Boolean(activeModalItem)} 
        onClose={handleCloseResult} 
        title="AI Assessment Triage Result" 
        maxWidth="600px"
      >
        {activeModalItem && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
            
            {/* Emergency Warning Banner if EMERGENCY */}
            {activeModalItem.urgency === 'EMERGENCY' && (
              <div
                style={{
                  padding: '16px',
                  background: 'rgba(220, 38, 38, 0.08)',
                  border: '1px solid rgba(220, 38, 38, 0.25)',
                  borderLeft: '4px solid var(--color-semantic-emergency)',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                }}
              >
                <ShieldAlert size={26} color="var(--color-semantic-emergency)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-semantic-emergency)', margin: '0 0 4px', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                    Immediate Action Required
                  </h3>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--color-text)' }}>
                    {activeModalItem.guidance}
                  </p>
                </div>
              </div>
            )}

            {/* Urgency Badge & Summary */}
            <div
              style={{
                padding: '16px',
                background: 'var(--color-surface-interactive)',
                borderRadius: '10px',
                border: '1px solid var(--color-border)',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Triage Urgency
                </span>
                <span
                  style={{
                    padding: '4px 12px',
                    borderRadius: '6px',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    ...urgencyBadgeStyle(activeModalItem.urgency),
                  }}
                >
                  {activeModalItem.urgency}
                </span>
              </div>

              <div>
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: '4px' }}>
                  Recommended Specialty
                </span>
                <strong style={{ fontSize: '1rem', color: 'var(--color-text)', fontWeight: 700 }}>
                  {activeModalItem.specialty}
                </strong>
              </div>

              {matchedDoctor && activeModalItem.urgency !== 'EMERGENCY' && activeModalItem.urgency !== 'ERROR' && (
                <div
                  style={{
                    padding: '12px 14px',
                    background: 'rgba(217, 119, 6, 0.08)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px',
                  }}
                >
                  <div>
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block' }}>
                      In-System Specialist Available
                    </span>
                    <strong style={{ fontSize: '0.92rem', color: 'var(--color-text)', display: 'block', marginTop: '2px' }}>
                      {matchedDoctor.name}
                    </strong>
                    <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', display: 'block', marginTop: '2px' }}>
                      📍 Station: {matchedDoctor.station} ({matchedDoctor.railLine} Line)
                    </span>
                  </div>
                  <Button
                    variant="primary"
                    className="btn-primary"
                    style={{
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      padding: '6px 12px',
                      whiteSpace: 'nowrap',
                      flexShrink: 0,
                    }}
                    onClick={() => {
                      handleCloseResult();
                      findSpecialist();
                    }}
                  >
                    View & Book
                  </Button>
                </div>
              )}

              <div>
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: '4px' }}>
                  Clinical Reasoning
                </span>
                <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--color-text)', lineHeight: 1.5 }}>
                  {activeModalItem.reason}
                </p>
              </div>

              {activeModalItem.urgency !== 'EMERGENCY' && (
                <div>
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: '4px' }}>
                    Non-Diagnostic Guidance
                  </span>
                  <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--color-text)', lineHeight: 1.5 }}>
                    {activeModalItem.guidance}
                  </p>
                </div>
              )}
            </div>

            {/* Modal Actions */}
            {activeModalItem.urgency === 'EMERGENCY' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <Button 
                  variant="danger" 
                  style={{ width: '100%', borderRadius: '8px', padding: '12px', fontWeight: 700 }} 
                  onClick={() => {
                    handleCloseResult();
                    navigate('/patient/emergency');
                  }}
                >
                  Open Emergency Assistance Workflow
                </Button>
                <Button 
                  variant="outline" 
                  style={{ width: '100%', borderRadius: '8px', borderColor: 'var(--color-border)', color: 'var(--color-text)' }} 
                  onClick={handleCloseResult}
                >
                  I Understand & Close
                </Button>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <Button 
                  variant="outline" 
                  style={{ flex: 1, borderRadius: '8px', borderColor: 'var(--color-border)', color: 'var(--color-text)' }} 
                  onClick={handleCloseResult}
                >
                  Close
                </Button>
                <Button 
                  variant="primary" 
                  className="btn-primary"
                  style={{ flex: 1, borderRadius: '8px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }} 
                  onClick={() => {
                    handleCloseResult();
                    findSpecialist();
                  }}
                >
                  Find Specialists <ArrowRight size={14} />
                </Button>
              </div>
            )}

          </div>
        )}
      </Popup>

    </div>
  );
};

