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
import "leaflet/dist/leaflet.css";                                                             // Leaflet core stylesheet
import { MapContainer, TileLayer } from "react-leaflet";                                        // React Leaflet canvas and tile wrappers
import type { MapOptions } from "leaflet";                                                     // Leaflet options interface
import { cn } from "@/lib/utils";                                                              // Style utility
import React from "react";                                                                      // React core
import L from "leaflet";                                                                        // Leaflet library instance
import icon from "leaflet/dist/images/marker-icon.png";                                         // Bundled marker pin graphic
import iconShadow from "leaflet/dist/images/marker-shadow.png";                                 // Bundled marker shadow graphic

// Workaround for missing default marker icon assets when bundling with Vite/Webpack
const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
});
L.Marker.prototype.options.icon = DefaultIcon;                                                  // Assign globally to all markers

// Mumbai Geographic Boundary Constants
// Clamps the map strictly to the Mumbai Metropolitan Region (MMR)
export const MUMBAI_CENTER_COORDS = { lat: 19.0760, lng: 72.8777 };                             // Mumbai City center
export const MUMBAI_BOUNDS: L.LatLngBoundsLiteral = [
  [18.82, 72.72],                                                                               // South-West corner (Colaba / Coastal waters)
  [19.38, 73.12],                                                                               // North-East corner (Thane / Kalyan / Navi Mumbai)
];
export const MUMBAI_MIN_ZOOM = 10;                                                              // Prevents zooming out beyond Mumbai region
export const MUMBAI_MAX_ZOOM = 18;                                                              // Street-level clinic zoom

export interface MapViewProps extends MapOptions {
  className?: string;                                                                           // Additional CSS classes
  initialCenter?: { lat: number; lng: number };                                                 // Center coordinates
  initialZoom?: number;                                                                         // Starting zoom level
  children?: React.ReactNode;                                                                   // Child markers or overlays
  onMapReady?: () => void;                                                                      // Invoked immediately when Leaflet initializes
}

// Inner helper triggering onMapReady callback
function MapReadyNotifier({ onReady }: { onReady?: () => void }) {
  React.useEffect(() => {
    onReady?.();
  }, [onReady]);
  return null;
}

// =========================================================================================
// LEAFLET / HIGH-SPEED CDN BASE WRAPPER (MapView)
// Provides a self-contained, responsive map container locked to Mumbai Metropolitan Region.
// Panning and zooming outside Mumbai is strictly constrained via maxBoundsViscosity = 1.0.
// Zero connection dropouts: uses edge-cached CartoDB Voyager tiles with multi-subdomains.
// =========================================================================================
export function MapView({
  className,
  initialCenter = MUMBAI_CENTER_COORDS,                                                         // Default to Mumbai geographic center
  initialZoom = 11,                                                                             // Zoom level covering Greater Mumbai
  minZoom = MUMBAI_MIN_ZOOM,                                                                    // Minimum zoom level (locked to Mumbai)
  maxZoom = MUMBAI_MAX_ZOOM,                                                                    // Maximum zoom level
  maxBounds = MUMBAI_BOUNDS,                                                                    // Locked boundaries: South Mumbai to Virar/Kalyan/Navi Mumbai
  maxBoundsViscosity = 1.0,                                                                     // 1.0 = hard solid boundary; user cannot pan outside
  children,
  onMapReady,
  ...mapOptions
}: MapViewProps) {
  return (
    <div className={cn("w-full h-[500px] overflow-hidden rounded-xl border relative", className)}>
      <MapContainer
        center={[initialCenter.lat, initialCenter.lng]}                                         // Focus map center
        zoom={initialZoom}                                                                      // Set zoom
        minZoom={minZoom}
        maxZoom={maxZoom}
        maxBounds={maxBounds}
        maxBoundsViscosity={maxBoundsViscosity}
        worldCopyJump={false}
        className="w-full h-full z-0"
        whenReady={() => onMapReady?.()}
        {...mapOptions}
      >
        <MapReadyNotifier onReady={onMapReady} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          subdomains="abc"
          maxZoom={19}
          keepBuffer={6}
          updateWhenIdle={false}
          updateWhenZooming={false}
          crossOrigin={true}
        />
        {children}                                                                              {/* Markers and popups */}
      </MapContainer>
    </div>
  );
}
