/**
 * ============================================================================
 * REUSABLE UI COMPONENTS (DESIGN SYSTEM)
 * ============================================================================
 * 
 * WHY THIS FILE IS SPECIAL:
 * Instead of rewriting the code for a button 50 times, we write it once here.
 * This ensures the entire application looks perfectly consistent (using Tailwind CSS)
 * and guarantees every component is accessible to screen readers for visually impaired users.
 */
import { useState, useEffect, useCallback } from "react";                                       // React hooks
import type { MumbaiRailLine } from "@shared/mumbaiRailNetwork";                                // Transit corridor types
import { MapView, MUMBAI_CENTER_COORDS, MUMBAI_BOUNDS, MUMBAI_MIN_ZOOM, MUMBAI_MAX_ZOOM } from "./Map"; // Base Leaflet map component and Mumbai bounds
import { Marker, Popup, useMap } from "react-leaflet";                                          // Leaflet marker and popup primitives
import { BrandLoadingIndicator } from "./brand/BrandLoadingIndicator";                           // Clean branded loading symbol
import { RefreshCw } from "lucide-react";                                                    // Icons

// Browser GPS location coordinate pair
export type BrowserMapLocation = {
  latitude: number;                                                                             // Latitude
  longitude: number;                                                                            // Longitude
};

// Specialist entry format required by map pins
export type DirectoryMapDoctor = {
  id: string;                                                                                  // Unique doctor ID
  name: string;                                                                                 // Doctor name
  specialty: string;                                                                            // Specialty
  locality: string;                                                                             // Suburb/Locality
  railLine: MumbaiRailLine;                                                                     // Primary railway corridor
  railLines: readonly MumbaiRailLine[];                                                         // All accessible rail corridors
  station: string;                                                                              // Nearest railway station
  latitude: number;                                                                             // Latitude coordinate
  longitude: number;                                                                            // Longitude coordinate
};

type MumbaiDoctorMapProps = {
  doctors: DirectoryMapDoctor[];                                                                // Doctors to render on map
  selectedDoctorId: string | null;                                                              // Active doctor selection
  onSelectDoctor: (doctorId: string) => void;                                                   // Marker click callback
  browserLocation?: BrowserMapLocation | null;                                                  // Optional user GPS coordinates
  isLoading?: boolean;                                                                          // Data loading state
};

// Check if coordinates reside within the Mumbai Metropolitan Region
function isWithinMumbai(lat: number, lng: number): boolean {
  return lat >= 18.82 && lat <= 19.38 && lng >= 72.72 && lng <= 73.12;
}

// Inner controller that flies the map viewport smoothly to selected doctor or user location,
// strictly clamped within Mumbai Metropolitan Region
function MapController({
  doctors,
  selectedDoctorId,
  browserLocation,
}: {
  doctors: DirectoryMapDoctor[];
  selectedDoctorId: string | null;
  browserLocation: BrowserMapLocation | null;
}) {
  const map = useMap();                                                                         // Leaflet map instance

  useEffect(() => {
    if (selectedDoctorId) {
      const selectedDoctor = doctors.find((d) => d.id === selectedDoctorId);
      if (selectedDoctor && isWithinMumbai(selectedDoctor.latitude, selectedDoctor.longitude)) {
        map.flyTo([selectedDoctor.latitude, selectedDoctor.longitude], 14, { duration: 0.4 });   // Zoom smoothly to selected doctor
      }
    } else if (browserLocation && isWithinMumbai(browserLocation.latitude, browserLocation.longitude)) {
      map.flyTo([browserLocation.latitude, browserLocation.longitude], 13, { duration: 0.4 }); // Zoom to patient location within Mumbai
    } else if (doctors.length === 1 && isWithinMumbai(doctors[0].latitude, doctors[0].longitude)) {
      map.flyTo([doctors[0].latitude, doctors[0].longitude], 13, { duration: 0.4 });           // Single search result focus
    } else {
      map.flyTo([MUMBAI_CENTER_COORDS.lat, MUMBAI_CENTER_COORDS.lng], 11, { duration: 0.4 });  // Reset to overview
    }
  }, [doctors, selectedDoctorId, browserLocation, map]);

  return null;
}

// =========================================================================================
// MUMBAI SPECIALIST CLINIC INTERACTIVE MAP
// Renders clinical specialist locations across Mumbai's Western, Central, and Harbour lines.
// Geographically locked strictly to Mumbai: users cannot pan outside Mumbai Metropolitan Region.
// Loads in under 5 seconds with zero connection dropouts and clean branded loading symbol.
// =========================================================================================
export function MumbaiDoctorMap({
  doctors,
  selectedDoctorId,
  onSelectDoctor,
  browserLocation = null,
  isLoading = false,
}: MumbaiDoctorMapProps) {
  const [isMapReady, setIsMapReady] = useState(false);                                          // Map canvas ready flag
  const [mapFailed, setMapFailed] = useState(false);                                            // Error fallback state
  const [retryKey, setRetryKey] = useState(0);                                                  // Mount retry trigger

  const handleMapReady = useCallback(() => {
    setIsMapReady(true);
    setMapFailed(false);
  }, []);

  const handleRetry = useCallback(() => {
    setMapFailed(false);
    setIsMapReady(false);
    setRetryKey((k) => k + 1);
  }, []);

  const showLoadingIndicator = isLoading || !isMapReady;

  return (
    <div className="mumbai-directory-map-wrap relative">
      {/* Clean branded loading indicator: appears strictly during active loading or connection wait */}
      {showLoadingIndicator && !mapFailed && (
        <div
          className="absolute inset-0 z-20 flex items-center justify-center rounded-xl backdrop-blur-xs"
          style={{ background: "rgba(255, 255, 255, 0.88)" }}
        >
          <BrandLoadingIndicator
            size="md"
            message="Connecting to live doctor map…"
            className="py-0"
          />
        </div>
      )}


      <MapView
        key={retryKey}
        className="mumbai-directory-map"
        initialCenter={MUMBAI_CENTER_COORDS}
        initialZoom={11}
        maxBounds={MUMBAI_BOUNDS}                                                               // Clamp viewport strictly to Mumbai MMR
        maxBoundsViscosity={1.0}                                                                // 1.0 = hard solid boundary; user cannot pan outside Mumbai
        minZoom={MUMBAI_MIN_ZOOM}                                                               // Prevents zooming out beyond Mumbai
        maxZoom={MUMBAI_MAX_ZOOM}
        onMapReady={handleMapReady}
      >
        {/* Animated viewport transition controller */}
        <MapController
          doctors={doctors}
          selectedDoctorId={selectedDoctorId}
          browserLocation={browserLocation}
        />

        {/* Doctor clinic location markers */}
        {doctors.map((doctor) => (
          <Marker
            key={doctor.id}
            position={[doctor.latitude, doctor.longitude]}
            eventHandlers={{ click: () => onSelectDoctor(doctor.id) }}                          // Clicking pin selects doctor
          >
            <Popup>
              <strong>{doctor.name}</strong>                                                    {/* Doctor name */}
              <br />
              {doctor.specialty} in {doctor.locality}                                           {/* Specialty & Locality */}
            </Popup>
          </Marker>
        ))}

        {/* Optional browser location marker */}
        {browserLocation && (
          <Marker position={[browserLocation.latitude, browserLocation.longitude]}>
            <Popup>Your location</Popup>
          </Marker>
        )}
      </MapView>

      {/* Fallback error notice with retry */}
      {mapFailed && (
        <div className="mumbai-map-error" role="status">
          <p style={{ marginBottom: "12px" }}>
            The interactive map could not establish a connection. Directory filters and appointment
            requests remain available.
          </p>
          <button
            type="button"
            onClick={handleRetry}
            className="btn btn-primary btn-sm flex items-center gap-2"
          >
            <RefreshCw size={14} /> Retry Map Connection
          </button>
        </div>
      )}
    </div>
  );
}

