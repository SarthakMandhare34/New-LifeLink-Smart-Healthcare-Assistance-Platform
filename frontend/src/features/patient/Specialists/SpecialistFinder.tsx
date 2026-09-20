/**
 * ============================================================================
 * TRANSIT CLINIC INTERACTIVE MAP (SpecialistFinder)
 * ============================================================================
 * 
 * WHY THIS FILE IS SPECIAL:
 * This file renders the live geographic map using Leaflet and CartoDB CDN tiles.
 * Connects directly to real-time specialist listings across Mumbai railway clinics.
 * Features customizable date selection (pure calendar without browser time wheels)
 * and structured 30-minute consultation slots (10:00–15:00 and 19:00–22:00).
 */
import { useCallback, useEffect, useMemo, useState } from 'react';                          // Core React state, memoization, and callback hooks
import { Card } from '../../../components/ui/Card';                                            // Reusable glass/solid container
import { Input } from '../../../components/ui/Input';                                          // Styled input field component
import { Button } from '../../../components/ui/Button';                                        // Styled button component
import { Badge } from '../../../components/ui/Badge';                                          // Small indicator badge
import { Popup } from '../../../components/ui/Popup';                                          // Modal confirmation dialog
import { ValidationMessage } from '../../../components/ui/ValidationMessage';
import { formatUserFriendlyError } from '../../../lib/errorFormatting';
import { UserCheck, MapPin, Building, Route, TrainFront, AlertCircle, RefreshCw, RotateCcw, CheckCircle, Clock, Sun, Moon } from 'lucide-react'; // Specialist directory and transit icons
import { useNavigate, useSearchParams } from 'react-router-dom';                                 // Navigation and query parameter synchronization hooks
import { trpc } from '../../../lib/trpc';                                                       // Type-safe tRPC client bridge
import { MumbaiDoctorMap } from '../../../components/MumbaiDoctorMap';                          // Interactive OpenStreetMap visualization component
import { BrandLoadingIndicator } from '../../../components/brand/BrandLoadingIndicator';        // Official LifeLink branded loading symbol
import './specialistFinder.css';                                                                // Bespoke responsive styles for discovery grid

// Constant label strings and disclaimers for accessibility and test suite contract stability
const ALL_FILTER = 'all';                                                                       // Sentinel value denoting no specialty filter

// Structured 30-minute appointment slots for morning/afternoon (10:00–15:00) and evening (19:00–22:00)
export const CLINIC_APPOINTMENT_SLOTS = [
  // Morning & Afternoon Clinic: 10:00 AM to 15:00 (3:00 PM) in 30-minute intervals
  { id: "10:00", startTime: "10:00", endTime: "10:30", label: "10:00 – 10:30 AM", session: "morning" as const },
  { id: "10:30", startTime: "10:30", endTime: "11:00", label: "10:30 – 11:00 AM", session: "morning" as const },
  { id: "11:00", startTime: "11:00", endTime: "11:30", label: "11:00 – 11:30 AM", session: "morning" as const },
  { id: "11:30", startTime: "11:30", endTime: "12:00", label: "11:30 AM – 12:00 PM", session: "morning" as const },
  { id: "12:00", startTime: "12:00", endTime: "12:30", label: "12:00 – 12:30 PM", session: "morning" as const },
  { id: "12:30", startTime: "12:30", endTime: "13:00", label: "12:30 – 1:00 PM", session: "morning" as const },
  { id: "13:00", startTime: "13:00", endTime: "13:30", label: "1:00 – 1:30 PM", session: "morning" as const },
  { id: "13:30", startTime: "13:30", endTime: "14:00", label: "1:30 – 2:00 PM", session: "morning" as const },
  { id: "14:00", startTime: "14:00", endTime: "14:30", label: "2:00 – 2:30 PM", session: "morning" as const },
  { id: "14:30", startTime: "14:30", endTime: "15:00", label: "2:30 – 3:00 PM", session: "morning" as const },

  // Evening Clinic: 19:00 (7:00 PM) to 22:00 (10:00 PM) in 30-minute intervals
  { id: "19:00", startTime: "19:00", endTime: "19:30", label: "7:00 – 7:30 PM", session: "evening" as const },
  { id: "19:30", startTime: "19:30", endTime: "20:00", label: "7:30 – 8:00 PM", session: "evening" as const },
  { id: "20:00", startTime: "20:00", endTime: "20:30", label: "8:00 – 8:30 PM", session: "evening" as const },
  { id: "20:30", startTime: "20:30", endTime: "21:00", label: "8:30 – 9:00 PM", session: "evening" as const },
  { id: "21:00", startTime: "21:00", endTime: "21:30", label: "9:00 – 9:30 PM", session: "evening" as const },
  { id: "21:30", startTime: "21:30", endTime: "22:00", label: "9:30 – 10:00 PM", session: "evening" as const },
] as const;

export const STANDARD_SLOTS = CLINIC_APPOINTMENT_SLOTS.map((s) => s.startTime);

export const RESIDENCE_CORRIDOR_LABEL = 'Which part of Mumbai do you live in?';                 // Label for geographic corridor selection
export const RESIDENCE_STATION_LABEL = 'Which station is closest to where you live?';           // Label for local rail station selection
export const BROWSER_LOCATION_TITLE = 'Optional browser location';                              // Section title for device geolocation
export const BROWSER_LOCATION_PRIVACY = 'Optional: use your browser location to order only the visible controlled specialist entries. Your location is not stored or sent to LifeLink.'; // Privacy guarantee
export const SPECIALTY_SEARCH_GUIDANCE = 'Free-text search matches specialties only. Use the Mumbai area and station filters below for where you live.'; // User search hint
export const SPECIALIST_LOAD_ERROR_TITLE = 'We couldn’t load the specialist directory';          // Error title
export const SPECIALIST_LOAD_ERROR_MESSAGE = 'Please check your connection and try again. Your filters will stay unchanged.'; // Error guidance

// Formats today's date in YYYY-MM-DD
function getTodayDateString(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Formats tomorrow's date in YYYY-MM-DD
function getTomorrowDateString(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// =========================================================================================
// SPECIALIST FINDER & TRANSIT DISCOVERY COMPONENT
// Enables patients to browse in-system clinical specialties across Mumbai's transit corridors,
// view clinic locations on an interactive Leaflet canvas, and request appointments in real time.
// =========================================================================================
export const SpecialistFinder = () => {
  const trpcUtils = trpc.useUtils();                                                            // Client cache invalidator
  const [searchParams, setSearchParams] = useSearchParams();                                    // URL search params reader and writer
  const initialSpecialty = searchParams.get('specialty') || ALL_FILTER;                          // Initialize specialty from URL query if present
  const [specialty, setSpecialty] = useState(initialSpecialty);                                  // Active specialty filter state
  
  // Memoize filter object passed to tRPC query to avoid redundant network refetches
  const discoveryFilters = useMemo(() => ({
    city: 'Mumbai' as const,                                                                    // Locked to Mumbai clinical operational radius
    specialty: specialty === ALL_FILTER ? undefined : specialty,                                // Filter by selected specialty
  }), [specialty]);

  const directoryQuery = trpc.patientDiscovery.list.useQuery(discoveryFilters);                 // Query to fetch doctors matching filters
  const facetsQuery = trpc.patientDiscovery.facets.useQuery();                                  // Query to fetch available specialties and localities
  const requestMutation = trpc.patientAppointment.request.useMutation();                       // Mutation to submit appointment booking request
  const navigate = useNavigate();                                                               // Page navigation controller

  // Local booking form: Pure date selection (no browser time wheel) & half-hour slots
  const [selectedDate, setSelectedDate] = useState(getTodayDateString());                       // Calendar date chosen by patient
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);                   // Selected 30-minute slot (e.g. "10:00")
  const [appointmentReason, setAppointmentReason] = useState('');                               // Chief complaint or medical reason
  const [requestedDocId, setRequestedDocId] = useState<string | null>(null);                    // Tracks doctor successfully booked
  const [processingId, setProcessingId] = useState<string | null>(null);                        // Disables request button while booking is in flight
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);                      // Highlights selected doctor marker on map
  const [requestError, setRequestError] = useState('');                                         // Inline error message for appointment validation
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);                              // Modal confirmation popup visibility

  // Full timestamp for backwards compatibility
  const requestedAt = selectedSlotId ? `${selectedDate}T${selectedSlotId}` : selectedDate;

  // Synchronize URL specialty parameter with component state
  useEffect(() => {
    const requestedSpecialty = searchParams.get('specialty') || ALL_FILTER;
    if (requestedSpecialty !== specialty) setSpecialty(requestedSpecialty);
  }, [searchParams, specialty]);

  // Deselect doctor if filtered list no longer contains the currently selected doctor
  useEffect(() => {
    if (selectedDocId && !directoryQuery.data?.some((doctor) => doctor.id === selectedDocId)) setSelectedDocId(null);
  }, [directoryQuery.data, selectedDocId]);

  // Update specialty filter in both React state and URL query string
  const updateSpecialty = (nextSpecialty: string) => {
    setSpecialty(nextSpecialty);
    setSearchParams((current) => {
      const next = new URLSearchParams(current);
      if (nextSpecialty === ALL_FILTER) next.delete('specialty');
      else next.set('specialty', nextSpecialty);
      return next;
    }, { replace: true });
  };

  // Select a doctor on both list and map
  const selectDoctor = useCallback((doctorId: string) => {
    setSelectedDocId(doctorId);
    setRequestError('');
  }, []);

  // Clear all filters
  const clearFilters = () => {
    updateSpecialty(ALL_FILTER);
    setRequestError('');
  };

  // Refetch directory queries on error retry
  const retryDirectory = () => {
    void directoryQuery.refetch();
    void facetsQuery.refetch();
  };

  // Submit appointment booking request
  const handleRequest = async (doctorId: string, event: React.MouseEvent) => {
    event.stopPropagation();                                                                    // Prevent triggering doctor selection click
    // Auto-scroll upward immediately so pop-up and status are instantly visible without manual scrolling
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (!selectedDate) {
      setRequestError('Please select a date for your appointment.');
      return;
    }

    if (!selectedSlotId) {
      setRequestError('Please select an available 30-minute appointment time slot.');
      return;
    }

    const bookingDate = new Date(`${selectedDate}T${selectedSlotId}:00`);
    if (isNaN(bookingDate.getTime()) || bookingDate.getTime() <= Date.now()) {
      setRequestError('Invalid date or time. Please select a future date and time for your appointment.');
      return;
    }

    if (appointmentReason.trim().length < 3) {
      setRequestError('Briefly tell the assigned specialist why you are requesting this appointment.');
      return;
    }

    setProcessingId(doctorId);                                                                  // Engage in-flight button spinner
    setRequestError('');
    try {
      await requestMutation.mutateAsync({ doctorId, scheduledAt: bookingDate, reason: appointmentReason.trim() }); // Dispatch booking
      await trpcUtils.patientAppointment.list.invalidate();                                     // Refresh patient appointments list
      await trpcUtils.patientDashboard.summary.invalidate();                                     // Refresh summary cards
      await trpcUtils.patientNotification.list.invalidate();                                     // Refresh notification bell
      await trpcUtils.patientAppointment.getDoctorAvailability.invalidate();                    // Refresh availability slots in real time
      setRequestedDocId(doctorId);                                                              // Mark as requested
      setShowSuccessPopup(true);                                                                // Open confirmation modal
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error: unknown) {
      setRequestError(formatUserFriendlyError(error, 'Unable to submit the appointment request.'));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setProcessingId(null);
    }
  };

  const targetDoctorId = selectedDocId || (directoryQuery.data?.[0]?.id ?? '');

  // Query real-time availability for selected date and doctor
  const availabilityQuery = trpc.patientAppointment.getDoctorAvailability.useQuery(
    { doctorId: targetDoctorId, date: selectedDate },
    { enabled: Boolean(targetDoctorId && selectedDate) }
  );

  const bookedSlots = availabilityQuery.data?.bookedSlots ?? [];

  // Slot availability and past checks
  const isSlotBooked = (slotStartTime: string) => {
    const slotTimestamp = new Date(`${selectedDate}T${slotStartTime}:00`).getTime();
    return bookedSlots.some((b) => {
      const bookedTimestamp = new Date(b).getTime();
      return Math.abs(bookedTimestamp - slotTimestamp) < 29 * 60 * 1000;
    });
  };

  const isSlotPast = (slotStartTime: string) => {
    const slotTimestamp = new Date(`${selectedDate}T${slotStartTime}:00`).getTime();
    return slotTimestamp <= Date.now();
  };

  const handleDateChange = (val: string) => {
    setSelectedDate(val);
    setRequestError('');
    // If the currently selected slot is past or booked on the new date, clear slot
    if (selectedSlotId) {
      const newSlotTime = new Date(`${val}T${selectedSlotId}:00`).getTime();
      if (newSlotTime <= Date.now()) {
        setSelectedSlotId(null);
      }
    }
  };

  const handleSlotSelect = (slotId: string) => {
    setSelectedSlotId(slotId);
    setRequestError('');
  };

  useEffect(() => {
    if (showSuccessPopup) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [showSuccessPopup]);

  // Compute displayed doctors
  const displayedDoctors = directoryQuery.data ?? [];
  const activeFilterCount = [specialty !== ALL_FILTER].filter(Boolean).length;
  const selectedSlotDef = CLINIC_APPOINTMENT_SLOTS.find((s) => s.id === selectedSlotId);

  // Clean branded loading indicator: appears strictly while actual data fetching is active and vanishes immediately when ready
  if (directoryQuery.isLoading || facetsQuery.isLoading) {
    return (
      <div className="container" style={{ padding: 0 }}>
        <BrandLoadingIndicator
          size="lg"
          message="Loading Mumbai specialist network…"
          className="min-h-[420px]"
        />
      </div>
    );
  }

  // Error boundary state
  if (directoryQuery.isError || facetsQuery.isError) return (
    <div className="container" style={{ padding: 0 }}>
      <div role="alert"><Card variant="glass" className="discovery-load-error">
        <div className="discovery-load-error-icon"><AlertCircle size={24} aria-hidden="true" /></div>
        <div>
          <h1>{SPECIALIST_LOAD_ERROR_TITLE}</h1>
          <p className="caption">{SPECIALIST_LOAD_ERROR_MESSAGE}</p>
          <Button type="button" variant="primary" onClick={retryDirectory} disabled={directoryQuery.isFetching || facetsQuery.isFetching}>
            <RefreshCw size={16} aria-hidden="true" /> {directoryQuery.isFetching || facetsQuery.isFetching ? 'Trying again…' : 'Try again'}
          </Button>
        </div>
      </Card></div>
    </div>
  );

  const facets = facetsQuery.data;

  return (
    <div className="container" style={{ padding: 0, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      {/* Page header */}
      <header className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div style={{ width: 44, height: 44, borderRadius: '14px', background: 'var(--color-primary-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <UserCheck size={24} color="var(--color-primary)" />                                               {/* Specialist finder icon */}
          </div>
          <div>
            <h1 style={{ margin: 0, fontFamily: "'Outfit', sans-serif", color: 'var(--color-text)', fontSize: '2rem' }}>Specialist Finder</h1>
            <p className="caption" style={{ color: 'var(--color-text-muted)' }}>Browse available Mumbai specialists by clinical specialty, view clinics on the live map, and request appointments in real time.</p>
          </div>
        </div>

        {/* Real-time sync badge: appears only during in-flight background query refetching */}
        {directoryQuery.isFetching && !directoryQuery.isLoading && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-teal-200 bg-teal-50 text-teal-700 text-xs font-semibold animate-pulse">
            <RefreshCw size={12} className="animate-spin" /> Updating live…
          </div>
        )}
      </header>

      {/* Filter and appointment parameters card */}
      <Card variant="glass" className="discovery-refinement-card mb-4">
        <div className="discovery-refinement-content">
          {/* Specialty dropdown filter */}
          <div className="discovery-filter-grid" style={{ gridTemplateColumns: '1fr' }}>
            <div>
              <label className="discovery-filter-label" htmlFor="specialty-filter">Specialty</label>
              <select id="specialty-filter" className="discovery-filter-select" value={specialty} onChange={(event) => updateSpecialty(event.target.value)}>
                <option value={ALL_FILTER}>All specialties</option>
                {facets?.specialties.map((value) => <option key={value} value={value}>{value}</option>)}
              </select>
            </div>
          </div>

          {/* Appointment date and complaint reason input fields */}
          <div className="discovery-request-grid">
            <div className="discovery-request-field">
              {/* Date Header with Custom Shortcuts */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <label className="discovery-filter-label" htmlFor="requested-visit-at" style={{ margin: 0 }}>
                  Appointment Date (Customizable)
                </label>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button
                    type="button"
                    onClick={() => handleDateChange(getTodayDateString())}
                    style={{
                      padding: '3px 8px',
                      fontSize: '0.75rem',
                      borderRadius: '6px',
                      border: '1px solid var(--color-border)',
                      background: selectedDate === getTodayDateString() ? 'var(--color-primary-muted)' : 'var(--color-surface-white)',
                      color: selectedDate === getTodayDateString() ? 'var(--color-primary)' : 'var(--color-text)',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Today
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDateChange(getTomorrowDateString())}
                    style={{
                      padding: '3px 8px',
                      fontSize: '0.75rem',
                      borderRadius: '6px',
                      border: '1px solid var(--color-border)',
                      background: selectedDate === getTomorrowDateString() ? 'var(--color-primary-muted)' : 'var(--color-surface-white)',
                      color: selectedDate === getTomorrowDateString() ? 'var(--color-primary)' : 'var(--color-text)',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Tomorrow
                  </button>
                </div>
              </div>

              {/* Pure Date Picker (no browser time wheel) */}
              <Input
                id="requested-visit-at"
                type="date"
                min={getTodayDateString()}
                value={selectedDate}
                onChange={(event) => handleDateChange(event.target.value)}
              />

              {/* Available 30-Minute Consultation Slots */}
              <div style={{ marginTop: '16px' }}>
                {selectedSlotDef && (
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
                    <Badge status="success">
                      ✓ {selectedSlotDef.label}
                    </Badge>
                  </div>
                )}

                {/* Morning & Afternoon Session: 10:00 to 15:00 */}
                <div style={{ marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                    <Sun size={14} color="#D97706" />
                    <span style={{ fontSize: '0.76rem', fontWeight: 700, color: '#B45309', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      Morning & Afternoon Session (10:00 AM – 3:00 PM)
                    </span>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {CLINIC_APPOINTMENT_SLOTS.filter((s) => s.session === 'morning').map((slot) => {
                      const isPast = isSlotPast(slot.startTime);
                      const isBooked = isSlotBooked(slot.startTime);
                      const isUnavailable = isPast || isBooked;
                      const isSelected = selectedSlotId === slot.id;

                      return (
                        <button
                          key={slot.id}
                          type="button"
                          disabled={isUnavailable}
                          onClick={() => handleSlotSelect(slot.id)}
                          style={{
                            padding: '7px 11px',
                            borderRadius: '8px',
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            border: '1px solid',
                            borderColor: isSelected
                              ? 'var(--color-primary)'
                              : isUnavailable
                              ? 'var(--color-border)'
                              : 'var(--color-border)',
                            background: isSelected
                              ? 'var(--color-primary)'
                              : isUnavailable
                              ? 'rgba(0, 0, 0, 0.04)'
                              : 'var(--color-surface-white)',
                            color: isSelected
                              ? '#FFFFFF'
                              : isUnavailable
                              ? 'var(--color-text-muted)'
                              : 'var(--color-text)',
                            cursor: isUnavailable ? 'not-allowed' : 'pointer',
                            opacity: isUnavailable ? 0.55 : 1,
                            textDecoration: isUnavailable ? 'line-through' : 'none',
                            boxShadow: isSelected ? '0 2px 8px rgba(13, 148, 136, 0.3)' : 'none',
                            transition: 'all 0.15s ease',
                          }}
                          title={isBooked ? 'Slot already booked' : isPast ? 'Past time' : `Book ${slot.label}`}
                        >
                          {slot.label} {isBooked ? '(Booked)' : ''}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Evening Session: 19:00 to 22:00 */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                    <Moon size={14} color="#6366F1" />
                    <span style={{ fontSize: '0.76rem', fontWeight: 700, color: '#4F46E5', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      Evening Session (7:00 PM – 10:00 PM)
                    </span>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {CLINIC_APPOINTMENT_SLOTS.filter((s) => s.session === 'evening').map((slot) => {
                      const isPast = isSlotPast(slot.startTime);
                      const isBooked = isSlotBooked(slot.startTime);
                      const isUnavailable = isPast || isBooked;
                      const isSelected = selectedSlotId === slot.id;

                      return (
                        <button
                          key={slot.id}
                          type="button"
                          disabled={isUnavailable}
                          onClick={() => handleSlotSelect(slot.id)}
                          style={{
                            padding: '7px 11px',
                            borderRadius: '8px',
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            border: '1px solid',
                            borderColor: isSelected
                              ? 'var(--color-primary)'
                              : isUnavailable
                              ? 'var(--color-border)'
                              : 'var(--color-border)',
                            background: isSelected
                              ? 'var(--color-primary)'
                              : isUnavailable
                              ? 'rgba(0, 0, 0, 0.04)'
                              : 'var(--color-surface-white)',
                            color: isSelected
                              ? '#FFFFFF'
                              : isUnavailable
                              ? 'var(--color-text-muted)'
                              : 'var(--color-text)',
                            cursor: isUnavailable ? 'not-allowed' : 'pointer',
                            opacity: isUnavailable ? 0.55 : 1,
                            textDecoration: isUnavailable ? 'line-through' : 'none',
                            boxShadow: isSelected ? '0 2px 8px rgba(13, 148, 136, 0.3)' : 'none',
                            transition: 'all 0.15s ease',
                          }}
                          title={isBooked ? 'Slot already booked' : isPast ? 'Past time' : `Book ${slot.label}`}
                        >
                          {slot.label} {isBooked ? '(Booked)' : ''}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {selectedSlotDef ? (
                <p className="caption" style={{ marginTop: '10px', color: 'var(--color-primary)', fontWeight: 600 }}>
                  Selected: {selectedDate} at {selectedSlotDef.label}
                </p>
              ) : (
                <p className="caption" style={{ marginTop: '10px' }}>
                  Please click an available 30-minute consultation slot above.
                </p>
              )}

              {requestError && (
                <ValidationMessage message={requestError} type="error" style={{ marginTop: '8px' }} />
              )}
            </div>

            <div className="discovery-request-field discovery-appointment-reason">
              <label className="discovery-filter-label" htmlFor="appointment-reason">Reason for this appointment</label>
              <textarea
                id="appointment-reason"
                value={appointmentReason}
                onChange={(event) => setAppointmentReason(event.target.value)}
                maxLength={1000}
                rows={4}
                placeholder="Briefly describe what you would like the specialist to review."
              />
              <p className="caption">This reason is visible only to you and the assigned clinician workspace.</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Main workspace: full-width map → directory heading → doctor card grid */}
      <div className="discovery-workspace">
        {/* Full-width interactive map */}
        <aside className="discovery-map-pane">
          <Card variant="glass" className="directory-map-card">
            <div className="flex items-center gap-2 mb-3">
              <Route size={20} color="var(--color-accent)" />
              <div><h2 style={{ margin: 0, fontSize: '1.2rem', fontFamily: "'Outfit', sans-serif", color: 'var(--color-text)' }}>Mumbai Specialists Live Map</h2><p className="caption" style={{ color: 'var(--color-text-muted)' }}>Geographically locked to Mumbai Metropolitan Region (MMR). High-speed live clinic locations.</p></div>
            </div>
            <MumbaiDoctorMap
              doctors={displayedDoctors}
              selectedDoctorId={selectedDocId}
              onSelectDoctor={selectDoctor}
              isLoading={directoryQuery.isFetching}
            />
          </Card>
        </aside>

        {/* Directory heading below map */}
        <div className="discovery-results-heading">
          <div>
            <h2 style={{ fontSize: '1.4rem', margin: 0, fontFamily: "'Outfit', sans-serif", color: 'var(--color-text)' }}>Mumbai Specialist Directory</h2>
            <p className="caption" style={{ color: 'var(--color-text-muted)' }}>{displayedDoctors.length} {displayedDoctors.length === 1 ? 'specialist' : 'specialists'} available in Mumbai.</p>
          </div>
          <Badge status="neutral">Live Directory</Badge>
        </div>

        {/* Full-width doctor card grid */}
        <section className="discovery-cards-section">
          <div className="responsive-list-grid discovery-full-grid">
            {displayedDoctors.map((doctor) => {
              const isSelected = selectedDocId === doctor.id;
              return (
                  <Card key={doctor.id} variant="glass" interactive selected={isSelected} className="h-full flex-col justify-between" onClick={() => selectDoctor(doctor.id)}>
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 style={{ margin: 0, color: 'var(--color-text)', fontFamily: "'Outfit', sans-serif", fontSize: '1.1rem' }}>{doctor.name}</h3>
                          <p style={{ color: 'var(--color-primary)', fontWeight: 700, margin: '2px 0 0 0', fontSize: '0.9rem' }}>{doctor.specialty}</p>
                        </div>
                        <Badge status="neutral">Controlled directory</Badge>
                      </div>
                      <div className="flex-col gap-1 mt-2">
                        <div className="caption flex items-center gap-1" style={{ color: 'var(--color-text-muted)' }}><Building size={14} /> {doctor.hospital}</div>
                        <div className="caption flex items-center gap-1" style={{ color: 'var(--color-text-muted)' }}><MapPin size={14} /> {doctor.locality}, {doctor.city} • {doctor.station} station</div>
                        <div className="caption flex items-center gap-1" style={{ color: 'var(--color-text-muted)' }}><TrainFront size={14} /> {doctor.railLines.join(" + ")} connectivity</div>
                      </div>
                    </div>
                    <div style={{ marginTop: 'var(--spacing-4)', paddingTop: 'var(--spacing-3)', borderTop: '1px solid var(--color-border)' }}>
                      {requestedDocId === doctor.id ? (
                        <Button variant="secondary" className="w-full" disabled>Requested!</Button>
                      ) : (
                        <Button
                          variant="primary"
                          className="w-full"
                          onClick={(event) => handleRequest(doctor.id, event)}
                          disabled={processingId === doctor.id}
                          aria-label={`Request appointment with ${doctor.name}`}
                        >
                          {processingId === doctor.id ? 'Requesting Appointment…' : 'Request Appointment'}
                        </Button>
                      )}
                    </div>
                  </Card>
              );
            })}

            {/* Empty state when 0 doctors match filter */}
            {displayedDoctors.length === 0 && (
                <Card variant="glass" className="discovery-empty-state" style={{ textAlign: 'center', padding: 'var(--spacing-6)' }}><p className="text-muted" style={{ margin: 0 }}>No specialist entries match the selected filter.</p>{activeFilterCount > 0 && <Button type="button" variant="outline" size="sm" onClick={clearFilters}><RotateCcw size={15} aria-hidden="true" /> Reset filters</Button>}</Card>
            )}
          </div>
        </section>
      </div>

      {/* Booking confirmation popup dialog */}
      <Popup isOpen={showSuccessPopup} onClose={() => navigate('/patient/appointments')} title="Appointment Requested" maxWidth="400px">
        <div style={{ textAlign: 'center', padding: '16px 0', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          <CheckCircle size={48} color="var(--color-primary)" style={{ margin: '0 auto 16px' }} />
          <h3 style={{ margin: '0 0 8px', color: 'var(--color-text)', fontFamily: "'Outfit', sans-serif", fontSize: '1.2rem' }}>Request Sent</h3>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: '24px' }}>
            Your appointment request has been submitted to the assigned specialist workspace successfully.
          </p>
          <Button variant="primary" className="w-full" onClick={() => navigate('/patient/appointments')}>
            View My Appointments
          </Button>
        </div>
      </Popup>
    </div>
  );
};
