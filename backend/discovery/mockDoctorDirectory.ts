/**
 * Controlled Mumbai Doctor Directory.
 * Curated roster of verified Mumbai clinical specialists and General Practitioners
 * located across Western, Central, and Harbour railway corridors.
 */
import { MUMBAI_RAIL_LINES, MUMBAI_RAIL_STATIONS, type MumbaiRailLine } from "@shared/mumbaiRailNetwork";       // Railway lines and stations across Mumbai
import { MUMBAI_STATION_COORDINATES } from "@shared/mumbaiStationCoordinates";                                     // Exact GPS coordinates for map pin placement

// Data model representing a doctor entry in our simulated healthcare directory
export type MockDoctorDirectoryEntry = {
  id: string;                                                                                                      // Unique specialist ID (e.g. mock-central-cardiology-csmt)
  name: string;                                                                                                    // Display name of specialist
  specialty: string;                                                                                               // Medical department / specialty
  hospital: string;                                                                                                // Affiliated healthcare facility
  locality: string;                                                                                                // Station neighborhood
  city: "Mumbai";                                                                                                  // City boundary restriction
  railLine: MumbaiRailLine;                                                                                        // Primary railway corridor
  railLines: readonly MumbaiRailLine[];                                                                            // All intersecting railway corridors
  station: string;                                                                                                 // Closest railway station
  latitude: number;                                                                                                // Map coordinate latitude
  longitude: number;                                                                                               // Map coordinate longitude
  isMock: true;                                                                                                    // Flag marking record as simulated
};

// Filter options accepted by the search and discovery engine
export type MockDoctorDirectoryFilters = {
  city?: "Mumbai";                                                                                                 // Filter by city
  specialty?: string;                                                                                              // Filter by clinical specialty
  railLine?: MumbaiRailLine;                                                                                       // Filter by transit corridor
  station?: string;                                                                                                // Filter by transit station
  locality?: string;                                                                                               // Filter by locality
  query?: string;                                                                                                  // Free-text search query
};

// Internal specification defining each clinician location
type ControlledDirectoryDefinition = {
  id: string;                                                                                                      // Unique identifier
  name: string;                                                                                                    // Physician full name & qualifications
  specialty: string;                                                                                               // Medical discipline
  hospital: string;                                                                                                // Affiliated Mumbai hospital
  station: string;                                                                                                 // Station anchor
  railLine: MumbaiRailLine;                                                                                        // Rail corridor
};

/**
 * Distributed catalog spanning distinct valid stations across the
 * Central, Harbour, and Western references.
 * Every station includes a General Practitioner, and every specialty field has at least 3 specialists.
 */
const CONTROLLED_DIRECTORY_DEFINITIONS: readonly ControlledDirectoryDefinition[] = [
  // =========================================================================
  // 1. GENERAL PRACTITIONERS (19 GPs — 1 per station guarantee)
  // =========================================================================
  { id: "mock-central-general-practice-csmt", name: "Dr. Ramesh Kumar, MBBS", specialty: "General Practice", hospital: "St. George & Bombay Hospital Medical Centre, CSMT", station: "CSMT", railLine: "Central" },
  { id: "mock-central-general-practice-ghatkopar", name: "Dr. Arvind Shenoy, MBBS", specialty: "General Practice", hospital: "Zynova Shalby Hospital, Ghatkopar East", station: "Ghatkopar", railLine: "Central" },
  { id: "mock-central-general-practice-bhandup", name: "Dr. Sunita Jagtap, MBBS", specialty: "General Practice", hospital: "Fortis Health Care & Bhandup Clinic, Bhandup", station: "Bhandup", railLine: "Central" },
  { id: "mock-central-general-practice-thane", name: "Dr. Meera Nambiar, MBBS, MD", specialty: "General Practice", hospital: "Currae Specialty Hospital, Thane West", station: "Thane", railLine: "Central" },
  { id: "mock-central-general-practice-mulund", name: "Dr. Shrikant Gokhale, MBBS", specialty: "General Practice", hospital: "Apex Hospitals, Mulund West", station: "Mulund", railLine: "Central" },
  { id: "mock-central-general-practice-diva", name: "Dr. Rameshwar Gaikwad, MBBS", specialty: "General Practice", hospital: "Diva Civic Care Centre, Diva Junction", station: "Diva Junction", railLine: "Central" },
  { id: "mock-central-general-practice-kopar", name: "Dr. Kavita Joshi, MBBS", specialty: "General Practice", hospital: "Kopar Suburban Family Health, Kopar", station: "Kopar", railLine: "Central" },
  { id: "mock-central-general-practice-dombivli", name: "Dr. Nitin Agrawal, MBBS", specialty: "General Practice", hospital: "AIIMS Dombivli Multispeciality Hospital, Dombivli", station: "Dombivli", railLine: "Central" },
  { id: "mock-central-general-practice-thakurli", name: "Dr. Deepa Nair, MBBS", specialty: "General Practice", hospital: "Thakurli Medicare Centre, Thakurli", station: "Thakurli", railLine: "Central" },

  { id: "mock-western-general-practice-churchgate", name: "Dr. Farhan Mehta, MBBS, MD", specialty: "General Practice", hospital: "Saifee Hospital, Marine Lines / Churchgate", station: "Churchgate", railLine: "Western" },
  { id: "mock-western-general-practice-dadar", name: "Dr. Ashok Tendulkar, MBBS", specialty: "General Practice", hospital: "Shushrusha Citizen Co-operative Hospital, Dadar West", station: "Dadar", railLine: "Western" },
  { id: "mock-western-general-practice-andheri", name: "Dr. Swati Bhosale, MBBS", specialty: "General Practice", hospital: "CritiCare Asia Multispecialty Hospital, Andheri West", station: "Andheri", railLine: "Western" },
  { id: "mock-western-general-practice-goregaon", name: "Dr. Shalini Varma, MBBS", specialty: "General Practice", hospital: "SRCC & Lifeline Health Clinic, Goregaon West", station: "Goregaon", railLine: "Western" },
  { id: "mock-western-general-practice-borivali", name: "Dr. Milind Chitnis, MBBS", specialty: "General Practice", hospital: "Karuna Hospital, Borivali West", station: "Borivali", railLine: "Western" },

  { id: "mock-harbour-general-practice-sewri", name: "Dr. Devendra Sawant, MBBS", specialty: "General Practice", hospital: "KEM Affiliated Primary Care, Sewri", station: "Sewri", railLine: "Harbour" },
  { id: "mock-harbour-general-practice-chembur", name: "Dr. Prakash Nair, MBBS", specialty: "General Practice", hospital: "Zen Multi Specialty Hospital, Chembur", station: "Chembur", railLine: "Harbour" },
  { id: "mock-harbour-general-practice-vashi", name: "Dr. Harish Salunkhe, MBBS", specialty: "General Practice", hospital: "Apollo Hospitals Clinic, Vashi Sector 17", station: "Vashi", railLine: "Harbour" },
  { id: "mock-harbour-general-practice-nerul", name: "Dr. Vandana Rao, MBBS", specialty: "General Practice", hospital: "Terna Specialty Hospital, Nerul", station: "Nerul", railLine: "Harbour" },
  { id: "mock-harbour-general-practice-panvel", name: "Dr. Chetan Mahajan, MBBS", specialty: "General Practice", hospital: "Panvel Municipal General Hospital, Panvel", station: "Panvel", railLine: "Harbour" },

  // =========================================================================
  // 2. CARDIOLOGY SPECIALISTS (3 Specialists)
  // =========================================================================
  { id: "mock-central-cardiology-csmt", name: "Dr. Rajesh Sharma, MD, DM (Cardiology)", specialty: "Cardiology", hospital: "Bombay Hospital & Medical Research Centre, CSMT", station: "CSMT", railLine: "Central" },
  { id: "mock-western-cardiology-andheri", name: "Dr. Anil Kumar, MD, DM (Cardiology)", specialty: "Cardiology", hospital: "Kokilaben Dhirubhai Ambani Hospital, Andheri West", station: "Andheri", railLine: "Western" },
  { id: "mock-harbour-cardiology-vashi", name: "Dr. Sanjeev Kulkarni, MD, DM (Cardiology)", specialty: "Cardiology", hospital: "Fortis Hiranandani Hospital, Vashi", station: "Vashi", railLine: "Harbour" },

  // =========================================================================
  // 3. DERMATOLOGY SPECIALISTS (3 Specialists)
  // =========================================================================
  { id: "mock-central-dermatology-ghatkopar", name: "Dr. Ananya Deshmukh, MD (Dermatology, DNB)", specialty: "Dermatology", hospital: "Godrej Memorial Hospital & Derma Clinic, Ghatkopar", station: "Ghatkopar", railLine: "Central" },
  { id: "mock-western-dermatology-churchgate", name: "Dr. Ritu Kapoor, MD (Dermatology)", specialty: "Dermatology", hospital: "Breach Candy Hospital & Wellness Centre, Churchgate", station: "Churchgate", railLine: "Western" },
  { id: "mock-harbour-dermatology-chembur", name: "Dr. Siddharth Merchant, MD (Dermatology)", specialty: "Dermatology", hospital: "Surana Sethia Hospital, Chembur", station: "Chembur", railLine: "Harbour" },

  // =========================================================================
  // 4. ORTHOPEDICS SPECIALISTS (3 Specialists)
  // =========================================================================
  { id: "mock-central-orthopedics-bhandup", name: "Dr. Vikramaditya Patil, MS (Orthopedics)", specialty: "Orthopedics", hospital: "Bhandup Bone & Joint Super Specialty Hospital", station: "Bhandup", railLine: "Central" },
  { id: "mock-western-orthopedics-dadar", name: "Dr. Mahesh Bhide, MS (Orthopedics, MCh)", specialty: "Orthopedics", hospital: "PD Hinduja Hospital & Medical Research Centre, Dadar", station: "Dadar", railLine: "Western" },
  { id: "mock-harbour-orthopedics-panvel", name: "Dr. Sanjay Varma, MS (Orthopedics)", specialty: "Orthopedics", hospital: "MGM Hospital & Medical College, Panvel", station: "Panvel", railLine: "Harbour" },

  // =========================================================================
  // 5. NEUROLOGY SPECIALISTS (3 Specialists)
  // =========================================================================
  { id: "mock-central-neurology-thane", name: "Dr. Sneha Kulkarni, MD, DM (Neurology)", specialty: "Neurology", hospital: "Jupiter Hospital, Thane West", station: "Thane", railLine: "Central" },
  { id: "mock-western-neurology-borivali", name: "Dr. Pankaj Shah, MD, DM (Neurology)", specialty: "Neurology", hospital: "Apex Superspeciality Hospital, Borivali West", station: "Borivali", railLine: "Western" },
  { id: "mock-harbour-neurology-nerul", name: "Dr. Vivek Deshpande, MD, DM (Neurology)", specialty: "Neurology", hospital: "D Y Patil Hospital & Research Centre, Nerul", station: "Nerul", railLine: "Harbour" },

  // =========================================================================
  // 6. PEDIATRICS SPECIALISTS (3 Specialists)
  // =========================================================================
  { id: "mock-western-pediatrics-andheri", name: "Dr. Pooja Chawla, MD (Pediatrics, DCH)", specialty: "Pediatrics", hospital: "Kokilaben Dhirubhai Ambani Hospital, Andheri West", station: "Andheri", railLine: "Western" },
  { id: "mock-central-pediatrics-mulund", name: "Dr. Rohan Mehta, MD (Pediatrics)", specialty: "Pediatrics", hospital: "Fortis Hospital, Mulund West", station: "Mulund", railLine: "Central" },
  { id: "mock-harbour-pediatrics-vashi", name: "Dr. Neha Paranjpe, MD (Pediatrics)", specialty: "Pediatrics", hospital: "MGM Children Health Hospital, Vashi", station: "Vashi", railLine: "Harbour" },

  // =========================================================================
  // 7. OPHTHALMOLOGY SPECIALISTS (3 Specialists)
  // =========================================================================
  { id: "mock-western-ophthalmology-goregaon", name: "Dr. Sameer Merchant, MS (Ophthalmology, FICO)", specialty: "Ophthalmology", hospital: "SRCC Children's & Eye Foundation, Goregaon West", station: "Goregaon", railLine: "Western" },
  { id: "mock-central-ophthalmology-csmt", name: "Dr. Preeti Saxena, MS (Ophthalmology)", specialty: "Ophthalmology", hospital: "Aditya Jyot Eye Hospital & CSMT Vision Care", station: "CSMT", railLine: "Central" },
  { id: "mock-harbour-ophthalmology-chembur", name: "Dr. Alok Pandey, MS (Ophthalmology)", specialty: "Ophthalmology", hospital: "Chembur Eye Institute & Laser Centre, Chembur", station: "Chembur", railLine: "Harbour" },

  // =========================================================================
  // 8. GASTROENTEROLOGY SPECIALISTS (3 Specialists)
  // =========================================================================
  { id: "mock-western-gastroenterology-borivali", name: "Dr. Nitin Agrawal, MD, DM (Gastroenterology)", specialty: "Gastroenterology", hospital: "Apex Superspeciality Hospital, Borivali West", station: "Borivali", railLine: "Western" },
  { id: "mock-central-gastroenterology-thane", name: "Dr. Jayant Bhatt, MD, DM (Gastroenterology)", specialty: "Gastroenterology", hospital: "Horizon Hospital & Gastro Clinic, Thane West", station: "Thane", railLine: "Central" },
  { id: "mock-harbour-gastroenterology-sewri", name: "Dr. Reema Shetty, MD, DM (Gastroenterology)", specialty: "Gastroenterology", hospital: "Global Hospitals & Parel Medical Hub, Sewri", station: "Sewri", railLine: "Harbour" },

  // =========================================================================
  // 9. PSYCHIATRY SPECIALISTS (3 Specialists)
  // =========================================================================
  { id: "mock-harbour-psychiatry-sewri", name: "Dr. Devendra Sawant, MD (Psychiatry, DPM)", specialty: "Psychiatry", hospital: "KEM Affiliated Mind Health Institute, Sewri", station: "Sewri", railLine: "Harbour" },
  { id: "mock-western-psychiatry-dadar", name: "Dr. Harish Shetty, MD (Psychiatry)", specialty: "Psychiatry", hospital: "Hinduja Mind Care Centre, Dadar", station: "Dadar", railLine: "Western" },
  { id: "mock-central-psychiatry-ghatkopar", name: "Dr. Anjali Chhabria, MD (Psychiatry)", specialty: "Psychiatry", hospital: "Mindset Wellness Clinic, Ghatkopar West", station: "Ghatkopar", railLine: "Central" },

  // =========================================================================
  // 10. ENDOCRINOLOGY SPECIALISTS (3 Specialists)
  // =========================================================================
  { id: "mock-harbour-endocrinology-chembur", name: "Dr. Malini Iyer, MD, DM (Endocrinology)", specialty: "Endocrinology", hospital: "Surana Sethia Hospital & Diabetes Care, Chembur", station: "Chembur", railLine: "Harbour" },
  { id: "mock-western-endocrinology-churchgate", name: "Dr. Shashank Joshi, MD, DM (Endocrinology)", specialty: "Endocrinology", hospital: "Lilavati & Saifee Endocrine Clinic, Churchgate", station: "Churchgate", railLine: "Western" },
  { id: "mock-central-endocrinology-bhandup", name: "Dr. Rahul Tambe, MD, DM (Endocrinology)", specialty: "Endocrinology", hospital: "Apex Diabetes & Hormone Care, Bhandup", station: "Bhandup", railLine: "Central" },

  // =========================================================================
  // 11. PULMONOLOGY SPECIALISTS (3 Specialists)
  // =========================================================================
  { id: "mock-harbour-pulmonology-vashi", name: "Dr. Harish Salunkhe, MD, DM (Pulmonology)", specialty: "Pulmonology", hospital: "Fortis Hiranandani Hospital, Vashi", station: "Vashi", railLine: "Harbour" },
  { id: "mock-central-pulmonology-thane", name: "Dr. Lancelot Pinto, MD, DM (Pulmonology)", specialty: "Pulmonology", hospital: "Jupiter Lung & Chest Institute, Thane", station: "Thane", railLine: "Central" },
  { id: "mock-western-pulmonology-andheri", name: "Dr. Zarir Udwadia, MD, FRCP (Pulmonology)", specialty: "Pulmonology", hospital: "Nanavati Super Speciality Hospital, Andheri / Vile Parle", station: "Andheri", railLine: "Western" },

  // =========================================================================
  // 12. GYNECOLOGY SPECIALISTS (3 Specialists)
  // =========================================================================
  { id: "mock-harbour-gynecology-panvel", name: "Dr. Vandana Rao, MD, DGO (Gynecology)", specialty: "Gynecology", hospital: "MGM Hospital & Medical College, Panvel", station: "Panvel", railLine: "Harbour" },
  { id: "mock-western-gynecology-goregaon", name: "Dr. Veena Shinde, MD, DGO (Gynecology)", specialty: "Gynecology", hospital: "Cloudnine Hospital, Goregaon West", station: "Goregaon", railLine: "Western" },
  { id: "mock-central-gynecology-dombivli", name: "Dr. Smita Patil, MD, DGO (Gynecology)", specialty: "Gynecology", hospital: "Dombivli Women Health Clinic, Dombivli", station: "Dombivli", railLine: "Central" },
];

// Assembles the live doctor directory by joining definitions with railway stations and GPS coordinates
export const mockDoctorDirectory: MockDoctorDirectoryEntry[] = CONTROLLED_DIRECTORY_DEFINITIONS.map((definition) => {
  const station = MUMBAI_RAIL_STATIONS.find((candidate) => candidate.name === definition.station);                  // Find transit station metadata
  const coordinate = MUMBAI_STATION_COORDINATES[definition.station];                                                // Retrieve exact GPS coordinates
  if (!station || !coordinate) throw new Error(`Missing controlled directory reference data for ${definition.station}`); // Ensure valid configuration

  return {
    id: definition.id,                                                                                             // Unique specialist ID
    name: definition.name,                                                                                         // Formatted doctor title with qualifications
    specialty: definition.specialty,                                                                               // Specialty domain
    hospital: definition.hospital,                                                                                 // Affiliated Mumbai hospital
    locality: definition.station,                                                                                  // Station neighborhood
    city: "Mumbai",                                                                                                // Geographical city
    railLine: definition.railLine,                                                                                 // Transit line
    railLines: station.lines,                                                                                      // All intersecting lines
    station: station.name,                                                                                         // Station name
    latitude: coordinate.latitude,                                                                                 // GPS latitude
    longitude: coordinate.longitude,                                                                               // GPS longitude
    isMock: true,                                                                                                  // Controlled account marker
  };
});

// Helper to sanitize search input strings for case-insensitive matching
function normalized(value?: string) {
  return value?.trim().toLowerCase() ?? "";                                                                        // Clean and lowercase
}

/** Filters only the controlled specialist directory; no external provider data is queried. */
export function filterMockDoctorDirectory(filters: MockDoctorDirectoryFilters = {}) {
  const specialty = normalized(filters.specialty);                                                                 // Target specialty filter
  const locality = normalized(filters.locality);                                                                   // Target locality filter
  const station = normalized(filters.station);                                                                     // Target station filter
  const query = normalized(filters.query);                                                                         // Free-text query

  return mockDoctorDirectory.filter((doctor) => {
    if (filters.city && doctor.city !== filters.city) return false;                                                // Restrict to specified city
    if (filters.railLine && !doctor.railLines.includes(filters.railLine)) return false;                            // Restrict to rail lines
    if (station && doctor.station.toLowerCase() !== station) return false;                                         // Match station name
    if (specialty && doctor.specialty.toLowerCase() !== specialty) return false;                                   // Match clinical specialty
    if (locality && doctor.locality.toLowerCase() !== locality) return false;                                     // Match geographic locality
    if (query && !doctor.specialty.toLowerCase().includes(query) && !doctor.name.toLowerCase().includes(query)) return false; // Match specialty or doctor name
    return true;                                                                                                   // Passes all active filters
  });
}

// Computes unique filter options and dropdown categories available across the directory
export function getMockDoctorDirectoryFacets() {
  const supportedStations = MUMBAI_RAIL_STATIONS.filter((station) => mockDoctorDirectory.some((doctor) => doctor.station === station.name));
  return {
    city: "Mumbai" as const,                                                                                       // City boundary
    specialties: Array.from(new Set(mockDoctorDirectory.map((doctor) => doctor.specialty))).sort(),                // Sorted unique specialties
    localities: Array.from(new Set(mockDoctorDirectory.map((doctor) => doctor.locality))).sort(),                  // Sorted unique localities
    railLines: MUMBAI_RAIL_LINES,                                                                                  // Supported transit lines
    stations: supportedStations,                                                                                   // Supported railway stations
  };
}

// Retrieves a single doctor entry from the directory by ID, or null if not found
export function getMockDoctorById(id: string) {
  return mockDoctorDirectory.find((doctor) => doctor.id === id) ?? null;                                           // Lookup doctor by id
}
