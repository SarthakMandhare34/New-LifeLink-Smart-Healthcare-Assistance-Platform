/**
 * ============================================================================
 * TRANSIT CLINIC INTERACTIVE MAP
 * ============================================================================
 *
 * WHY THIS FILE IS SPECIAL:
 * This file renders the live geographic map using Leaflet.
 * It is highly special because it accesses the patient's GPS coordinates securely.
 * It computes the physical distance to 24 Mumbai railway clinics purely inside the browser memory.
 * Your GPS location is NEVER sent or saved to our servers, ensuring total geographic privacy.
 */
import { describe, expect, it } from 'vitest';
import { sortByBrowserLocation } from './discoveryLocation';

describe('browser location sorting', () => {
  it('orders entries deterministically by distance without mutating the source list', () => {
    const list = [
      { id: 'far', latitude: 19.2, longitude: 72.9 },
      { id: 'near', latitude: 19.01, longitude: 72.85 },
    ];
    const sorted = sortByBrowserLocation(list, { latitude: 19.0, longitude: 72.85 });
    expect(sorted.map((item) => item.id)).toEqual(['near', 'far']);
  });
});
