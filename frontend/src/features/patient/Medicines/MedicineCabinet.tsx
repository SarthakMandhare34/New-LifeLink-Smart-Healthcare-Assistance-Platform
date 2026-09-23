/**
 * ============================================================================
 * PATIENT PORTAL UI
 * ============================================================================
 *
 * WHY THIS FILE IS SPECIAL:
 * This manages the everyday user interfaces for patients (Dashboard, Health Passport, Medicines).
 * It uses modern React hooks to keep data perfectly synchronized and responsive.
 */
import React, { useState } from 'react';                                                  // Core React hooks for local component state
import { Card } from '../../../components/ui/Card';                                            // Standard glass/solid card visual container
import { Button } from '../../../components/ui/Button';                                        // Styled touch/click button component
import { Input } from '../../../components/ui/Input';                                          // Styled HTML input field component
import { Badge } from '../../../components/ui/Badge';                                          // Pill badge for medicine status indication
import { Popup } from '../../../components/ui/Popup';                                          // Accessible modal dialog for user confirmations
import { Pill, Plus, Edit2, Trash2 } from 'lucide-react';                                      // Medication and editing icon set
import { trpc } from '../../../lib/trpc';                                                       // Type-safe tRPC client bridge

// Type definition matching medication form data fields entered by the patient
type MedicineForm = {
  name: string;                                                                                 // Commercial or generic medication name
  dosage: string;                                                                               // Prescribed dose strength (e.g., 500mg, 10ml)
  frequency: string;                                                                            // Administration cadence (e.g., Twice daily)
  schedule: string;                                                                             // Specific timing (e.g., After breakfast)
  startDate?: string;                                                                           // Optional therapy commencement date
  endDate?: string;                                                                             // Optional course completion date
  quantity?: number;                                                                            // Remaining pill or liquid container count
  expiry?: string;                                                                              // Packaging expiration date
};

// =========================================================================================
// SMART MEDICINE CABINET COMPONENT
// Manages patient home medication inventory, daily schedules, dosages, and reminders.
// Provides complete CRUD operations (Create, Read, Update, Delete) synchronized via tRPC.
// =========================================================================================
export const MedicineCabinet = () => {
  const trpcUtils = trpc.useUtils();                                                            // Client cache manager to trigger automatic UI refetches
  const medicinesQuery = trpc.patientMedicine.list.useQuery();                                  // Fetches user's current active medication list
  const createMedicine = trpc.patientMedicine.create.useMutation();                             // API mutation to persist a new medication
  const updateMedicine = trpc.patientMedicine.update.useMutation();                             // API mutation to update an existing medication record
  const removeMedicine = trpc.patientMedicine.remove.useMutation();                             // API mutation to delete a medication from the cabinet

  // Local state for modals, forms, and network flight indicators
  const [showForm, setShowForm] = useState(false);                                              // Controls visibility of add/edit medication drawer
  const [editingId, setEditingId] = useState<number | null>(null);                              // Tracks whether form is in 'Edit' mode (ID set) or 'Add' mode (null)
  const [formData, setFormData] = useState<MedicineForm>({ name: '', dosage: '', frequency: '', schedule: '' }); // Active form input state
  const [isProcessing, setIsProcessing] = useState(false);                                      // Disables form submit button while mutation is running
  const [processingId, setProcessingId] = useState<number | null>(null);                        // Highlights individual card currently being removed
  const [medicineToRemove, setMedicineToRemove] = useState<number | null>(null);                // Target ID for confirmation popup before deletion
  const [mutationError, setMutationError] = useState('');                                       // Displays friendly inline error banner on network failures

  // Render loading skeleton/message while fetching initial medication list
  if (medicinesQuery.isLoading) return <div className="flex items-center justify-center h-full"><p className="caption">Loading medicines…</p></div>;
  const activeMedicines = medicinesQuery.data ?? [];                                            // Fallback to empty array if no medicines returned

  // Open blank form for adding a new medication
  const handleOpenAdd = () => {
    setMutationError('');                                                                       // Clear previous error messages
    setFormData({ name: '', dosage: '', frequency: '', schedule: '' });                         // Reset form inputs to blank defaults
    setEditingId(null);                                                                         // Signal create mode
    setShowForm(true);                                                                          // Reveal the form container
  };

  // Populate form with existing medicine data for editing
  const handleOpenEdit = (med: (typeof activeMedicines)[number]) => {
    setMutationError('');                                                                       // Clear error state
    setFormData({
      name: med.name,                                                                           // Pre-fill name
      dosage: med.dosage,                                                                       // Pre-fill dosage
      frequency: med.frequency,                                                                 // Pre-fill frequency
      schedule: med.schedule,                                                                   // Pre-fill schedule
      startDate: med.startDate ?? undefined,                                                    // Optional start date
      endDate: med.endDate ?? undefined,                                                        // Optional end date
      quantity: med.quantity ?? undefined,                                                      // Optional quantity
      expiry: med.expiry ?? undefined,                                                          // Optional expiry
    });
    setEditingId(med.id);                                                                       // Set active target medication ID
    setShowForm(true);                                                                          // Display the edit form
  };

  // Submit handler for both Create and Update operations
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();                                                                         // Prevent native browser page reload
    setIsProcessing(true);                                                                      // Set in-flight processing state
    setMutationError('');                                                                       // Reset error container
    try {
      if (editingId) {
        await updateMedicine.mutateAsync({ id: editingId, values: formData });                  // Execute update mutation on backend
      } else {
        await createMedicine.mutateAsync(formData);                                             // Execute create mutation on backend
      }
      await trpcUtils.patientMedicine.list.invalidate();                                        // Refresh medicine list cache
      await trpcUtils.patientDashboard.summary.invalidate();                                     // Refresh patient dashboard stats cache
      setShowForm(false);                                                                       // Close form drawer upon success
    } catch (error: unknown) {
      setMutationError(error instanceof Error ? error.message : 'Unable to save this medicine. Please try again.'); // Display server error message
    } finally {
      setIsProcessing(false);                                                                   // Re-enable form interactions
    }
  };

  // Trigger modal confirmation popup before deleting a medicine
  const requestRemove = (id: number) => {
    setMedicineToRemove(id);                                                                    // Open confirmation modal for this medicine ID
  };

  // Confirm and execute medication deletion
  const confirmRemove = async () => {
    if (medicineToRemove === null) return;                                                      // Guard against invalid null ID
    const id = medicineToRemove;                                                                // Snapshot target ID
    setMedicineToRemove(null);                                                                  // Close confirmation dialog
    setProcessingId(id);                                                                        // Mark card as deleting (dimmed)
    setMutationError('');                                                                       // Reset error state
    try {
      await removeMedicine.mutateAsync({ id });                                                 // Send delete request to backend
      await trpcUtils.patientMedicine.list.invalidate();                                        // Invalidate list cache to trigger re-render
      await trpcUtils.patientDashboard.summary.invalidate();                                     // Invalidate dashboard summary counters
    } catch (error: unknown) {
      setMutationError(error instanceof Error ? error.message : 'Unable to remove this medicine. Please try again.'); // Capture error
    } finally {
      setProcessingId(null);                                                                    // Reset processing spinner
    }
  };

  return (
    <div className="container medicine-cabinet-page" style={{ display: 'flex', flexDirection: 'column', gap: '36px', width: '100%', padding: 0 }}>
      {/* Header section with icon, title, and action button */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: 48, height: 48, borderRadius: '4px', background: 'var(--color-primary-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Pill size={24} style={{ color: 'var(--color-primary)' }} />
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: '1.85rem', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--color-text)' }}>Smart Medicine Cabinet</h1>
            <p className="caption" style={{ margin: '4px 0 0', color: 'var(--color-text-muted)' }}>Manage active medications, schedules, and stock alerts.</p>
          </div>
        </div>
        {!showForm && (
          <Button variant="primary" onClick={handleOpenAdd}>
            <Plus size={16} /> Add Medication
          </Button>
        )}
      </header>

      {/* Network or validation error display banner */}
      {mutationError && <div className="alert-panel" style={{ marginBottom: '12px' }}><span className="caption">{mutationError}</span></div>}

      {/* Inline medication entry / edit form */}
      {showForm && (
        <Card style={{ padding: 'clamp(24px, 3.2vw, 32px)' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700, color: 'var(--color-text)' }}>{editingId ? 'Edit Medication Record' : 'Add New Medication'}</h3>
            <div>
              <label htmlFor="medicine-name" style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: 'var(--text-caption)' }}>Medicine Name</label>
              <Input id="medicine-name" type="text" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} required placeholder="E.g., Lisinopril, Amoxicillin..." />
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <div style={{ flex: 1 }}>
                <label htmlFor="medicine-dosage" style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: 'var(--text-caption)' }}>Dosage</label>
                <Input id="medicine-dosage" type="text" value={formData.dosage || ''} onChange={e => setFormData({...formData, dosage: e.target.value})} placeholder="e.g. 10mg" required />
              </div>
              <div style={{ flex: 1 }}>
                <label htmlFor="medicine-schedule" style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: 'var(--text-caption)' }}>Schedule</label>
                <Input id="medicine-schedule" type="text" value={formData.schedule || ''} onChange={e => setFormData({...formData, schedule: e.target.value})} placeholder="e.g. Morning, Daily" required />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <div style={{ flex: 1 }}>
                <label htmlFor="medicine-frequency" style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: 'var(--text-caption)' }}>Frequency</label>
                <Input id="medicine-frequency" type="text" value={formData.frequency || ''} onChange={e => setFormData({...formData, frequency: e.target.value})} placeholder="e.g. Once daily" required />
              </div>
              <div style={{ flex: 1 }}>
                <label htmlFor="medicine-quantity" style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: 'var(--text-caption)' }}>Quantity (units)</label>
                <Input id="medicine-quantity" type="number" min={0} value={formData.quantity ?? ''} onChange={e => setFormData({...formData, quantity: e.target.value ? Number(e.target.value) : undefined})} placeholder="e.g. 30" />
              </div>
              <div style={{ flex: 1 }}>
                <label htmlFor="medicine-expiry" style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: 'var(--text-caption)' }}>Expiry Date</label>
                <Input id="medicine-expiry" type="date" value={formData.expiry || ''} onChange={e => setFormData({...formData, expiry: e.target.value})} />
              </div>
            </div>
            {/* Form action buttons */}
            <div className="flex gap-3 mt-2">
              <Button type="button" variant="outline" onClick={() => setShowForm(false)} disabled={isProcessing}>Cancel</Button>
              <Button type="submit" variant="primary" disabled={isProcessing}>
                {isProcessing ? 'Processing...' : 'Save Medication'}
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Structured Medical Register View */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {activeMedicines.map((med) => (
          <div
            key={med.id}
            className="solid-clinical-surface"
            style={{
              borderLeft: '4px solid var(--color-semantic-success)',
              display: 'flex',
              flexDirection: 'column',
              gap: '18px',
              padding: '22px 28px',
              opacity: processingId === med.id ? 0.5 : 1,
              borderRadius: 'var(--border-radius-md)',
              border: '1px solid var(--color-border)',
              background: 'var(--color-surface-white)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Pill style={{ color: 'var(--color-primary)' }} size={22} />
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 700, color: 'var(--color-text)' }}>{med.name}</h3>
                  <span className="caption" style={{ color: 'var(--color-text-muted)', marginTop: '2px', display: 'block' }}>Registered Clinical Item</span>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Badge status="success">Active</Badge>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleOpenEdit(med)}
                  disabled={processingId === med.id}
                  aria-label={`Edit ${med.name}`}
                >
                  <Edit2 size={14} /> Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => requestRemove(med.id)}
                  disabled={processingId === med.id}
                  aria-label={`Remove ${med.name} from cabinet`}
                >
                  <Trash2 size={14} /> {processingId === med.id ? 'Removing...' : 'Remove'}
                </Button>
              </div>
            </div>

            {/* Medical Register Metadata Row: Medicine, Dosage, Frequency, Schedule, Quantity, Expiry */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 130px), 1fr))',
                gap: '12px',
                background: 'var(--color-surface-interactive)',
                padding: '10px 14px',
                borderRadius: 'var(--border-radius-sm)',
                border: '1px solid var(--color-border)'
              }}
            >
              <div>
                <span className="caption" style={{ textTransform: 'uppercase', fontSize: '10px', fontWeight: 700, color: 'var(--color-text-muted)', letterSpacing: '0.05em' }}>Dosage</span>
                <div style={{ fontWeight: 600, fontSize: '0.9rem', fontVariantNumeric: 'tabular-nums', color: 'var(--color-text)' }}>{med.dosage}</div>
              </div>
              <div>
                <span className="caption" style={{ textTransform: 'uppercase', fontSize: '10px', fontWeight: 700, color: 'var(--color-text-muted)', letterSpacing: '0.05em' }}>Frequency</span>
                <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-text)' }}>{med.frequency}</div>
              </div>
              <div>
                <span className="caption" style={{ textTransform: 'uppercase', fontSize: '10px', fontWeight: 700, color: 'var(--color-text-muted)', letterSpacing: '0.05em' }}>Schedule</span>
                <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-text)' }}>{med.schedule}</div>
              </div>
              <div>
                <span className="caption" style={{ textTransform: 'uppercase', fontSize: '10px', fontWeight: 700, color: 'var(--color-text-muted)', letterSpacing: '0.05em' }}>Quantity</span>
                <div style={{ fontWeight: 600, fontSize: '0.9rem', fontVariantNumeric: 'tabular-nums', color: 'var(--color-text)' }}>
                  {med.quantity != null ? `${med.quantity} units` : '—'}
                </div>
              </div>
              <div>
                <span className="caption" style={{ textTransform: 'uppercase', fontSize: '10px', fontWeight: 700, color: 'var(--color-text-muted)', letterSpacing: '0.05em' }}>Expiry</span>
                <div style={{ fontWeight: 600, fontSize: '0.9rem', fontVariantNumeric: 'tabular-nums', color: 'var(--color-text)' }}>
                  {med.expiry || '—'}
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Empty state message when cabinet has 0 items */}
        {activeMedicines.length === 0 && (
          <Card style={{ textAlign: 'center', padding: 'var(--spacing-8) var(--spacing-4)' }}>
            <Pill size={36} style={{ color: 'var(--color-text-muted)', opacity: 0.5, margin: '0 auto var(--spacing-3)' }} />
            <p style={{ margin: 0, fontWeight: 600, color: 'var(--color-text)' }}>No active medications in cabinet.</p>
            <p className="caption" style={{ margin: '4px 0 0', color: 'var(--color-text-muted)' }}>Add your medications to track schedules, dosages, and reminders.</p>
          </Card>
        )}
      </div>

      {/* Deletion confirmation popup dialog */}
      <Popup isOpen={medicineToRemove !== null} onClose={() => setMedicineToRemove(null)} title="Remove Medicine" maxWidth="400px">
        <div className="flex-col gap-4">
          <p>Are you sure you want to remove this medication from your cabinet?</p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '16px', flexWrap: 'wrap' }}>
            <Button variant="outline" onClick={() => setMedicineToRemove(null)}>Cancel</Button>
            <Button variant="danger" onClick={confirmRemove}>Remove</Button>
          </div>
        </div>
      </Popup>
    </div>
  );
};
