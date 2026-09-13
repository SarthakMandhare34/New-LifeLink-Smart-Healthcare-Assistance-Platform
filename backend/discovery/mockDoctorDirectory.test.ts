import { describe, expect, it } from "vitest";
import { filterMockDoctorDirectory, getMockDoctorDirectoryFacets, mockDoctorDirectory } from "./mockDoctorDirectory";
import { MUMBAI_RAIL_LINES, getMumbaiRailStation } from "@shared/mumbaiRailNetwork";
import { MUMBAI_STATION_COORDINATES } from "@shared/mumbaiStationCoordinates";

describe("controlled Mumbai specialist directory", () => {
  it("keeps a comprehensive, explicitly controlled catalog with multi-route pediatrician coverage", () => {
    expect(mockDoctorDirectory).toHaveLength(24);
    expect(new Set(mockDoctorDirectory.map((entry) => entry.specialty))).toHaveLength(12);
    mockDoctorDirectory.forEach((entry) => {
      expect(entry.isMock).toBe(true);
      expect(entry.hospital).toBe("LifeLink controlled specialist directory");
      expect(entry.latitude).toBe(MUMBAI_STATION_COORDINATES[entry.station].latitude);
      expect(entry.longitude).toBe(MUMBAI_STATION_COORDINATES[entry.station].longitude);
    });
  });

  it("spreads general practitioners and specialists across distinct Mumbai transit corridors", () => {
    const expectedStations = [
      "CSMT", "Ghatkopar", "Bhandup", "Thane", "Mulund", "Diva Junction", "Kopar", "Dombivli", "Thakurli",
      "Churchgate", "Dadar", "Andheri", "Goregaon", "Borivali",
      "Sewri", "Chembur", "Vashi", "Nerul", "Panvel"
    ];
    expect(new Set(mockDoctorDirectory.map((entry) => entry.station))).toEqual(new Set(expectedStations));

    const gps = filterMockDoctorDirectory({ specialty: "General Practice" });
    expect(gps).toHaveLength(13);

    const pediatricians = filterMockDoctorDirectory({ specialty: "Pediatrics" });
    expect(pediatricians).toHaveLength(1);
    expect(pediatricians[0].station).toBe("Andheri");

    // Verify General Practitioners exist across all 3 major rail corridors
    MUMBAI_RAIL_LINES.forEach((railLine) => {
      const lineGps = gps.filter((doc) => doc.railLine === railLine);
      expect(lineGps.length).toBeGreaterThanOrEqual(3);
    });

    MUMBAI_RAIL_LINES.forEach((railLine) => {
      const primaryEntries = mockDoctorDirectory.filter((entry) => entry.railLine === railLine);
      const specialties = new Set(filterMockDoctorDirectory({ railLine }).map((entry) => entry.specialty));
      expect(primaryEntries.length).toBeGreaterThanOrEqual(6);
      expect(specialties.size).toBeGreaterThanOrEqual(4);
    });
  });

  it("preserves supplied shared-station associations without multiplying the catalog", () => {
    expect(filterMockDoctorDirectory({ station: "CSMT", railLine: "Central" })).toHaveLength(1);
    expect(filterMockDoctorDirectory({ station: "CSMT", railLine: "Harbour" })).toHaveLength(1);
    expect(filterMockDoctorDirectory({ station: "Andheri", railLine: "Western" })).toHaveLength(1);
    expect(filterMockDoctorDirectory({ station: "Andheri", railLine: "Harbour" })).toHaveLength(1);
    expect(getMumbaiRailStation("CSMT")?.lines).toEqual(["Central", "Harbour"]);
    expect(getMumbaiRailStation("Panvel")?.lines).toEqual(["Harbour"]);
  });

  it("publishes supported station facets and specialty-only free-text matching", () => {
    const facets = getMockDoctorDirectoryFacets();
    expect(facets.stations).toHaveLength(19);
    expect(facets).toMatchObject({
      city: "Mumbai",
      specialties: expect.arrayContaining(["Cardiology", "Dermatology", "General Practice", "Pediatrics"]),
      railLines: ["Central", "Harbour", "Western"],
    });
    expect(filterMockDoctorDirectory({ query: "cardio" })).toSatisfy((entries) => entries.length > 0 && entries.every((entry) => entry.specialty === "Cardiology"));
    expect(filterMockDoctorDirectory({ query: "western" })).toEqual([]);
  });
});
