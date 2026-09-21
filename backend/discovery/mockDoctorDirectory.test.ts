import { describe, expect, it } from "vitest";
import { filterMockDoctorDirectory, getMockDoctorDirectoryFacets, mockDoctorDirectory, type MockDoctorDirectoryEntry } from "./mockDoctorDirectory";
import { getMumbaiRailStation } from "../../shared/mumbaiRailNetwork";
import { MUMBAI_STATION_COORDINATES } from "../../shared/mumbaiStationCoordinates";

describe("controlled Mumbai specialist directory", () => {
  it("keeps a comprehensive, explicitly controlled catalog with fictional Indian doctors, hospital affiliations, and off-rail clinic locations", () => {
    expect(mockDoctorDirectory).toHaveLength(52);
    expect(new Set(mockDoctorDirectory.map((entry) => entry.specialty))).toHaveLength(12);
    expect(new Set(mockDoctorDirectory.map((entry) => entry.name)).size).toBe(52);                               // All 52 doctor names must be completely unique

    mockDoctorDirectory.forEach((entry) => {
      expect(entry.isMock).toBe(true);
      expect(entry.name).toMatch(/^Dr\.\s/);                                                                     // Must start with "Dr. "
      expect(entry.hospital.length).toBeGreaterThan(5);                                                          // Fictional clinical facility affiliation
      expect(entry.locality.length).toBeGreaterThan(3);                                                          // Authentic medical district locality
      // Verifies clinic coordinates reside safely within the Mumbai Metropolitan Region
      expect(entry.latitude).toBeGreaterThanOrEqual(18.82);
      expect(entry.latitude).toBeLessThanOrEqual(19.38);
      expect(entry.longitude).toBeGreaterThanOrEqual(72.72);
      expect(entry.longitude).toBeLessThanOrEqual(73.12);
      // Verifies clinic coordinates are placed in surrounding medical avenues rather than directly on railway platform tracks
      const stationCoord = MUMBAI_STATION_COORDINATES[entry.station];
      expect(entry.latitude !== stationCoord.latitude || entry.longitude !== stationCoord.longitude).toBe(true);
    });
  });

  it("guarantees a General Practitioner at EVERY station and at least 3 specialists per department field", () => {
    const expectedStations = [
      "CSMT", "Ghatkopar", "Bhandup", "Thane", "Mulund", "Diva Junction", "Kopar", "Dombivli", "Thakurli",
      "Churchgate", "Dadar", "Andheri", "Goregaon", "Borivali",
      "Sewri", "Chembur", "Vashi", "Nerul", "Panvel"
    ];
    expect(new Set(mockDoctorDirectory.map((entry) => entry.station))).toEqual(new Set(expectedStations));

    // Verify 19 General Practitioners — 1 per station
    const gps = filterMockDoctorDirectory({ specialty: "General Practice" });
    expect(gps).toHaveLength(19);
    expectedStations.forEach((stationName) => {
      const stationGps = gps.filter((doc) => doc.station === stationName);
      expect(stationGps.length).toBeGreaterThanOrEqual(1);
    });

    // Verify every specialty department field has AT LEAST 3 specialists
    const specialties = Array.from(new Set(mockDoctorDirectory.map((entry) => entry.specialty)));
    specialties.forEach((specialtyName) => {
      const fieldDoctors = filterMockDoctorDirectory({ specialty: specialtyName });
      expect(fieldDoctors.length).toBeGreaterThanOrEqual(3);
    });
  });

  it("preserves supplied shared-station associations without multiplying the catalog", () => {
    expect(filterMockDoctorDirectory({ station: "CSMT", railLine: "Central" })).toSatisfy((list: MockDoctorDirectoryEntry[]) => list.length >= 1);
    expect(filterMockDoctorDirectory({ station: "Andheri", railLine: "Western" })).toSatisfy((list: MockDoctorDirectoryEntry[]) => list.length >= 1);
    expect(getMumbaiRailStation("CSMT")?.lines).toEqual(["Central", "Harbour"]);
    expect(getMumbaiRailStation("Panvel")?.lines).toEqual(["Harbour"]);
  });

  it("publishes supported station facets and specialty/doctor-name search matching", () => {
    const facets = getMockDoctorDirectoryFacets();
    expect(facets.stations).toHaveLength(19);
    expect(facets).toMatchObject({
      city: "Mumbai",
      specialties: expect.arrayContaining(["Cardiology", "Dermatology", "General Practice", "Pediatrics"]),
      railLines: ["Central", "Harbour", "Western"],
    });
    expect(filterMockDoctorDirectory({ query: "cardio" })).toSatisfy((entries: MockDoctorDirectoryEntry[]) => entries.length >= 3 && entries.every((entry: MockDoctorDirectoryEntry) => entry.specialty === "Cardiology"));
    expect(filterMockDoctorDirectory({ query: "Rajesh" })).toSatisfy((entries: MockDoctorDirectoryEntry[]) => entries.length >= 1 && entries.some((entry: MockDoctorDirectoryEntry) => entry.name.includes("Rajesh")));
  });
});
