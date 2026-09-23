/**
 * ============================================================================
 * CUSTOM REACT HOOKS (usePatientRealtime)
 * ============================================================================
 *
 * WHY THIS FILE IS SPECIAL:
 * These files contain isolated, reusable behavior.
 * For example, the auto-logout hook lives here. It constantly monitors mouse movement,
 * and if a doctor leaves their computer for 5 minutes, it logs them out to protect patient data.
 */
import { useEffect, useState } from "react";                                                    // React hooks
import { trpc } from "../lib/trpc";                                                             // Type-safe client tRPC bridge

// Real-time notification payload received by patient SSE listener
type PatientRealtimePayload = {
  id: number;                                                                                   // Event sequence ID
  type: "PROFILE_UPDATED" | "APPOINTMENT_UPDATED" | "PRESCRIPTION_CREATED" | "ASSESSMENT_COMPLETED" | "MEDICINE_UPDATED"; // Event type
  entityId: string | null;                                                                      // Associated primary key
  createdAt: string;                                                                            // Event timestamp
};

export type RealtimeConnectionStatus = "connecting" | "connected" | "disconnected";

// =========================================================================================
// REAL-TIME SERVER-SENT EVENTS (SSE) HOOK FOR PATIENT PORTAL
// Establishes a persistent SSE stream to `/api/patient-events`.
// Eliminates connection dropouts: listens for reconnects and instantly re-syncs
// doctor availability, appointment slots, and map discovery in true real-time.
// =========================================================================================
export function usePatientRealtime(enabled: boolean) {
  const utils = trpc.useUtils();                                                                // tRPC cache manager
  const [status, setStatus] = useState<RealtimeConnectionStatus>("connecting");

  useEffect(() => {
    // Guard against SSR or disabled state
    if (!enabled || typeof window === "undefined" || !("EventSource" in window)) return;

    setStatus("connecting");
    const source = new EventSource("/api/patient-events");                                      // Open same-origin SSE connection

    // Reconnection and connection established handler: eliminates stale data after network dropouts
    source.onopen = () => {
      setStatus("connected");
      void utils.patientDashboard.summary.invalidate();
      void utils.patientNotification.list.invalidate();
      void utils.patientAppointment.list.invalidate();
      void utils.patientAppointment.getDoctorAvailability.invalidate();
      void utils.patientDiscovery.list.invalidate();
    };

    source.onerror = () => {
      setStatus("disconnected");
    };

    // Granular cache invalidation dispatcher matching received event domain
    const refreshForEvent = (type: PatientRealtimePayload["type"]) => {
      void utils.patientDashboard.summary.invalidate();                                         // Refresh aggregate dashboard
      void utils.patientNotification.list.invalidate();                                        // Refresh notification bell
      switch (type) {
        case "PROFILE_UPDATED":
          void utils.patientProfile.get.invalidate();                                           // Refresh profile
          break;
        case "APPOINTMENT_UPDATED":
          void utils.patientAppointment.list.invalidate();                                      // Refresh appointments
          void utils.patientAppointment.getDoctorAvailability.invalidate();                     // Refresh live slot availability
          void utils.patientDiscovery.list.invalidate();                                        // Refresh doctor map and directory
          break;
        case "PRESCRIPTION_CREATED":
          void utils.patientPrescription.list.invalidate();                                     // Refresh prescriptions
          break;
        case "ASSESSMENT_COMPLETED":
          void utils.assessment.list.invalidate();                                              // Refresh assessments
          break;
        case "MEDICINE_UPDATED":
          void utils.patientMedicine.list.invalidate();                                         // Refresh medicine cabinet
          break;
      }
    };

    // Message handler
    const onPatientEvent = (message: Event) => {
      try {
        const payload = JSON.parse((message as MessageEvent<string>).data) as PatientRealtimePayload; // Parse event payload
        refreshForEvent(payload.type);                                                          // Trigger cache updates
      } catch {
        // Ignore malformed stream messages; EventSource will automatically reconnect
      }
    };

    source.addEventListener("patient-event", onPatientEvent);                                   // Register listener

    // Teardown stream on unmount
    return () => {
      source.removeEventListener("patient-event", onPatientEvent);                              // Remove listener
      source.close();                                                                           // Close stream
    };
  }, [enabled, utils]);

  return { status };
}
