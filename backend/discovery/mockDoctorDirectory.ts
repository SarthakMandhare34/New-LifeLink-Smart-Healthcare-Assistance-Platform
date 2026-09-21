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

// Medical district localities mapping suburban anchors to authentic healthcare enclaves
export const MUMBAI_DISTRICT_LOCALITIES: Readonly<Record<string, string>> = {
  "CSMT": "Fort Medical Enclave",
  "Ghatkopar": "Ghatkopar East Health District",
  "Bhandup": "Bhandup West Medical Park",
  "Thane": "Thane West Civic Medical Hub",
  "Mulund": "Mulund West Wellness Corridor",
  "Diva Junction": "Diva Central Health Enclave",
  "Kopar": "Kopar Civic Care District",
  "Dombivli": "Dombivli East Healthcare Hub",
  "Thakurli": "Thakurli Township Medical Center",
  "Churchgate": "Marine Lines & Churchgate Boulevard",
  "Dadar": "Dadar West Medical Square",
  "Andheri": "Andheri West Healthcare Hub",
  "Goregaon": "Goregaon West Medical Enclave",
  "Borivali": "Borivali West Health Corridor",
  "Sewri": "Sewri Coastal Medical District",
  "Chembur": "Chembur Diamond Garden Sector",
  "Vashi": "Vashi Sector 15 Medical Park",
  "Nerul": "Nerul Palm Beach Healthcare Zone",
  "Panvel": "Panvel City Wellness Hub",
};

// Calibrated clinic GPS coordinates placed 400m–900m into surrounding commercial/civic healthcare zones (off railway tracks)
export const MUMBAI_CLINIC_COORDINATES: Readonly<Record<string, { latitude: number; longitude: number }>> = {
  "CSMT": { latitude: 18.9338, longitude: 72.8315 },
  "Ghatkopar": { latitude: 19.0820, longitude: 72.9145 },
  "Bhandup": { latitude: 19.1495, longitude: 72.9315 },
  "Thane": { latitude: 19.1915, longitude: 72.9702 },
  "Mulund": { latitude: 19.1770, longitude: 72.9505 },
  "Diva Junction": { latitude: 19.1855, longitude: 73.0480 },
  "Kopar": { latitude: 19.2195, longitude: 73.0735 },
  "Dombivli": { latitude: 19.2135, longitude: 73.0925 },
  "Thakurli": { latitude: 19.2255, longitude: 73.1095 },
  "Churchgate": { latitude: 18.9312, longitude: 72.8235 },
  "Dadar": { latitude: 19.0235, longitude: 72.8385 },
  "Andheri": { latitude: 19.1265, longitude: 72.8375 },
  "Goregaon": { latitude: 19.1695, longitude: 72.8415 },
  "Borivali": { latitude: 19.2345, longitude: 72.8510 },
  "Sewri": { latitude: 19.0055, longitude: 72.8505 },
  "Chembur": { latitude: 19.0570, longitude: 72.9055 },
  "Vashi": { latitude: 19.0715, longitude: 72.9930 },
  "Nerul": { latitude: 19.0280, longitude: 73.0135 },
  "Panvel": { latitude: 18.9950, longitude: 73.1160 },
};

// Internal specification defining each clinician location
type ControlledDirectoryDefinition = {
  id: string;                                                                                                      // Unique identifier
  name: string;                                                                                                    // Physician full name & qualifications
  specialty: string;                                                                                               // Medical discipline
  hospital: string;                                                                                                // Affiliated Mumbai hospital
  station: string;                                                                                                 // Station anchor
  railLine: MumbaiRailLine;                                                                                        // Rail corridor
  locality?: string;                                                                                               // Medical district locality
};

/**
 * Distributed catalog spanning distinct valid stations across the
 * Central, Harbour, and Western references.
 * Every station includes a General Practitioner, and every specialty field has at least 3 specialists.
 * All clinician names and clinical facilities are 100% fictional.
 */
const CONTROLLED_DIRECTORY_DEFINITIONS: readonly ControlledDirectoryDefinition[] = [
  // =========================================================================
  // 1. GENERAL PRACTITIONERS (19 GPs — 1 per station guarantee)
  // =========================================================================
  { id: "mock-central-general-practice-csmt", name: "Dr. Aarav N. Kulkarni, MBBS", specialty: "General Practice", hospital: "Fort Heritage Health Pavilion", station: "CSMT", railLine: "Central" },
  { id: "mock-central-general-practice-ghatkopar", name: "Dr. Ishaan M. Deshmukh, MBBS", specialty: "General Practice", hospital: "MetroHealth Family Centre", station: "Ghatkopar", railLine: "Central" },
  { id: "mock-central-general-practice-bhandup", name: "Dr. Ananya P. Joshi, MBBS", specialty: "General Practice", hospital: "Silverline Community Medical Hub", station: "Bhandup", railLine: "Central" },
  { id: "mock-central-general-practice-thane", name: "Dr. Rohan K. Sengupta, MBBS, MD", specialty: "General Practice", hospital: "Apex Horizon Polyclinic", station: "Thane", railLine: "Central" },
  { id: "mock-central-general-practice-mulund", name: "Dr. Tanvi R. Kirloskar, MBBS", specialty: "General Practice", hospital: "Starlight Clinical Centre", station: "Mulund", railLine: "Central" },
  { id: "mock-central-general-practice-diva", name: "Dr. Neil P. Somaiya, MBBS", specialty: "General Practice", hospital: "Beacon Hill Community Care", station: "Diva Junction", railLine: "Central" },
  { id: "mock-central-general-practice-kopar", name: "Dr. Avantika B. Deshmukh, MBBS", specialty: "General Practice", hospital: "Novis Suburban Health Sanctuary", station: "Kopar", railLine: "Central" },
  { id: "mock-central-general-practice-dombivli", name: "Dr. Kabir A. Mahajan, MBBS", specialty: "General Practice", hospital: "Summit Care Medical Centre", station: "Dombivli", railLine: "Central" },
  { id: "mock-central-general-practice-thakurli", name: "Dr. Meera K. Nambiar, MBBS", specialty: "General Practice", hospital: "Crestview Family Health Clinic", station: "Thakurli", railLine: "Central" },

  { id: "mock-western-general-practice-churchgate", name: "Dr. Devendra C. Sawant, MBBS, MD", specialty: "General Practice", hospital: "Meridian Clinical Pavilion", station: "Churchgate", railLine: "Western" },
  { id: "mock-western-general-practice-dadar", name: "Dr. Shalini K. Pillai, MBBS", specialty: "General Practice", hospital: "Zenith Clinical Hub", station: "Dadar", railLine: "Western" },
  { id: "mock-western-general-practice-andheri", name: "Dr. Prakash J. Menon, MBBS", specialty: "General Practice", hospital: "Veritas Primary Care Centre", station: "Andheri", railLine: "Western" },
  { id: "mock-western-general-practice-goregaon", name: "Dr. Chetan R. Varma, MBBS", specialty: "General Practice", hospital: "PulsePoint Health Clinic", station: "Goregaon", railLine: "Western" },
  { id: "mock-western-general-practice-borivali", name: "Dr. Sneha R. Kulkarni, MBBS", specialty: "General Practice", hospital: "Trinity Medical Care Pavilion", station: "Borivali", railLine: "Western" },

  { id: "mock-harbour-general-practice-sewri", name: "Dr. Pankaj D. Shah, MBBS", specialty: "General Practice", hospital: "Solace Primary Health Institute", station: "Sewri", railLine: "Harbour" },
  { id: "mock-harbour-general-practice-chembur", name: "Dr. Vivek N. Deshpande, MBBS", specialty: "General Practice", hospital: "PrimeCare Medical Institute", station: "Chembur", railLine: "Harbour" },
  { id: "mock-harbour-general-practice-vashi", name: "Dr. Rohan T. Bapat, MBBS", specialty: "General Practice", hospital: "Oasis Clinical Pavilion", station: "Vashi", railLine: "Harbour" },
  { id: "mock-harbour-general-practice-nerul", name: "Dr. Preeti S. Saxena, MBBS", specialty: "General Practice", hospital: "Asteria Community Health Center", station: "Nerul", railLine: "Harbour" },
  { id: "mock-harbour-general-practice-panvel", name: "Dr. Alok M. Pandey, MBBS", specialty: "General Practice", hospital: "Pioneer Civic Care Pavilion", station: "Panvel", railLine: "Harbour" },

  // =========================================================================
  // 2. CARDIOLOGY SPECIALISTS (3 Specialists)
  // =========================================================================
  { id: "mock-central-cardiology-csmt", name: "Dr. Rajesh V. Varma, MD, DM (Cardiology)", specialty: "Cardiology", hospital: "Aura Heart & Vascular Pavilion", station: "CSMT", railLine: "Central" },
  { id: "mock-western-cardiology-andheri", name: "Dr. Jayant V. Bhatt, MD, DM (Cardiology)", specialty: "Cardiology", hospital: "Veritas Cardiac & Rhythm Institute", station: "Andheri", railLine: "Western" },
  { id: "mock-harbour-cardiology-vashi", name: "Dr. Reema N. Shetty, MD, DM (Cardiology)", specialty: "Cardiology", hospital: "Oasis Advanced Heart Center", station: "Vashi", railLine: "Harbour" },

  // =========================================================================
  // 3. DERMATOLOGY SPECIALISTS (3 Specialists)
  // =========================================================================
  { id: "mock-central-dermatology-ghatkopar", name: "Dr. Rahul E. Tambe, MD (Dermatology, DNB)", specialty: "Dermatology", hospital: "MetroHealth Derma & Skin Pavilion", station: "Ghatkopar", railLine: "Central" },
  { id: "mock-western-dermatology-churchgate", name: "Dr. Veena M. Shinde, MD (Dermatology)", specialty: "Dermatology", hospital: "Meridian Aesthetic & Skin Institute", station: "Churchgate", railLine: "Western" },
  { id: "mock-harbour-dermatology-chembur", name: "Dr. Smita K. Patil, MD (Dermatology)", specialty: "Dermatology", hospital: "PrimeCare Cutaneous Care Clinic", station: "Chembur", railLine: "Harbour" },

  // =========================================================================
  // 4. ORTHOPEDICS SPECIALISTS (3 Specialists)
  // =========================================================================
  { id: "mock-central-orthopedics-bhandup", name: "Dr. Arvind N. Shenoy, MS (Orthopedics)", specialty: "Orthopedics", hospital: "Silverline Joint & Spine Institute", station: "Bhandup", railLine: "Central" },
  { id: "mock-western-orthopedics-dadar", name: "Dr. Sunita K. Jagtap, MS (Orthopedics, MCh)", specialty: "Orthopedics", hospital: "Zenith Orthopedic & Trauma Centre", station: "Dadar", railLine: "Western" },
  { id: "mock-harbour-orthopedics-panvel", name: "Dr. Shrikant R. Gokhale, MS (Orthopedics)", specialty: "Orthopedics", hospital: "Pioneer Bone & Joint Pavilion", station: "Panvel", railLine: "Harbour" },

  // =========================================================================
  // 5. NEUROLOGY SPECIALISTS (3 Specialists)
  // =========================================================================
  { id: "mock-central-neurology-thane", name: "Dr. Rameshwar T. Gaikwad, MD, DM (Neurology)", specialty: "Neurology", hospital: "Apex Horizon Neuro-Care Institute", station: "Thane", railLine: "Central" },
  { id: "mock-western-neurology-borivali", name: "Dr. Kavita M. Joshi, MD, DM (Neurology)", specialty: "Neurology", hospital: "Trinity Brain & Spine Center", station: "Borivali", railLine: "Western" },
  { id: "mock-harbour-neurology-nerul", name: "Dr. Nitin H. Agrawal, MD, DM (Neurology)", specialty: "Neurology", hospital: "Asteria Neuro-Sciences Pavilion", station: "Nerul", railLine: "Harbour" },

  // =========================================================================
  // 6. PEDIATRICS SPECIALISTS (3 Specialists)
  // =========================================================================
  { id: "mock-western-pediatrics-andheri", name: "Dr. Deepa V. Nair, MD (Pediatrics, DCH)", specialty: "Pediatrics", hospital: "Veritas Child Health & Neonatal Care", station: "Andheri", railLine: "Western" },
  { id: "mock-central-pediatrics-mulund", name: "Dr. Farhan K. Mehta, MD (Pediatrics)", specialty: "Pediatrics", hospital: "Starlight Pediatric Specialty Center", station: "Mulund", railLine: "Central" },
  { id: "mock-harbour-pediatrics-vashi", name: "Dr. Swati P. Bhosale, MD (Pediatrics)", specialty: "Pediatrics", hospital: "Oasis Children's Healthcare Pavilion", station: "Vashi", railLine: "Harbour" },

  // =========================================================================
  // 7. OPHTHALMOLOGY SPECIALISTS (3 Specialists)
  // =========================================================================
  { id: "mock-western-ophthalmology-goregaon", name: "Dr. Milind S. Chitnis, MS (Ophthalmology, FICO)", specialty: "Ophthalmology", hospital: "PulsePoint Eye Care Institute", station: "Goregaon", railLine: "Western" },
  { id: "mock-central-ophthalmology-csmt", name: "Dr. Harish D. Salunkhe, MS (Ophthalmology)", specialty: "Ophthalmology", hospital: "Fort Heritage Vision & Eye Centre", station: "CSMT", railLine: "Central" },
  { id: "mock-harbour-ophthalmology-chembur", name: "Dr. Vandana S. Rao, MS (Ophthalmology)", specialty: "Ophthalmology", hospital: "PrimeCare Advanced Eye Center", station: "Chembur", railLine: "Harbour" },

  // =========================================================================
  // 8. GASTROENTEROLOGY SPECIALISTS (3 Specialists)
  // =========================================================================
  { id: "mock-western-gastroenterology-borivali", name: "Dr. Anil M. Kumar, MD, DM (Gastroenterology)", specialty: "Gastroenterology", hospital: "Trinity Digestive Health Centre", station: "Borivali", railLine: "Western" },
  { id: "mock-central-gastroenterology-thane", name: "Dr. Sanjeev B. Kulkarni, MD, DM (Gastroenterology)", specialty: "Gastroenterology", hospital: "Apex Horizon Gastro & Liver Care", station: "Thane", railLine: "Central" },
  { id: "mock-harbour-gastroenterology-sewri", name: "Dr. Ritu G. Kapoor, MD, DM (Gastroenterology)", specialty: "Gastroenterology", hospital: "Solace Digestive Diseases Pavilion", station: "Sewri", railLine: "Harbour" },

  // =========================================================================
  // 9. PSYCHIATRY SPECIALISTS (3 Specialists)
  // =========================================================================
  { id: "mock-harbour-psychiatry-sewri", name: "Dr. Siddharth P. Merchant, MD (Psychiatry, DPM)", specialty: "Psychiatry", hospital: "Solace Mind Wellness Institute", station: "Sewri", railLine: "Harbour" },
  { id: "mock-western-psychiatry-dadar", name: "Dr. Mahesh A. Bhide, MD (Psychiatry)", specialty: "Psychiatry", hospital: "Zenith Behavioral Health Center", station: "Dadar", railLine: "Western" },
  { id: "mock-central-psychiatry-ghatkopar", name: "Dr. Sanjay D. Varma, MD (Psychiatry)", specialty: "Psychiatry", hospital: "MetroHealth Mind & Wellbeing Pavilion", station: "Ghatkopar", railLine: "Central" },

  // =========================================================================
  // 10. ENDOCRINOLOGY SPECIALISTS (3 Specialists)
  // =========================================================================
  { id: "mock-harbour-endocrinology-chembur", name: "Dr. Pooja S. Chawla, MD, DM (Endocrinology)", specialty: "Endocrinology", hospital: "PrimeCare Diabetes & Hormone Institute", station: "Chembur", railLine: "Harbour" },
  { id: "mock-western-endocrinology-churchgate", name: "Dr. Rohan M. Kirloskar, MD, DM (Endocrinology)", specialty: "Endocrinology", hospital: "Meridian Metabolic Health Center", station: "Churchgate", railLine: "Western" },
  { id: "mock-central-endocrinology-bhandup", name: "Dr. Neha V. Paranjpe, MD, DM (Endocrinology)", specialty: "Endocrinology", hospital: "Silverline Endocrine & Thyroid Pavilion", station: "Bhandup", railLine: "Central" },

  // =========================================================================
  // 11. PULMONOLOGY SPECIALISTS (3 Specialists)
  // =========================================================================
  { id: "mock-harbour-pulmonology-vashi", name: "Dr. Sameer K. Merchant, MD, DM (Pulmonology)", specialty: "Pulmonology", hospital: "Oasis Respiratory & Chest Institute", station: "Vashi", railLine: "Harbour" },
  { id: "mock-central-pulmonology-thane", name: "Dr. Malini S. Iyer, MD, DM (Pulmonology)", specialty: "Pulmonology", hospital: "Apex Horizon Pulmonary Care Centre", station: "Thane", railLine: "Central" },
  { id: "mock-western-pulmonology-andheri", name: "Dr. Vikramaditya S. Sengupta, MD, FCCP (Pulmonology)", specialty: "Pulmonology", hospital: "Veritas Chest & Lung Sanctuary", station: "Andheri", railLine: "Western" },

  // =========================================================================
  // 12. GYNECOLOGY SPECIALISTS (3 Specialists)
  // =========================================================================
  { id: "mock-harbour-gynecology-panvel", name: "Dr. Tarun K. Bansal, MD, DGO (Gynecology)", specialty: "Gynecology", hospital: "Pioneer Women Health & Maternity Hospital", station: "Panvel", railLine: "Harbour" },
  { id: "mock-western-gynecology-goregaon", name: "Dr. Gauri N. Tendulkar, MD, DGO (Gynecology)", specialty: "Gynecology", hospital: "PulsePoint Women's Health Pavilion", station: "Goregaon", railLine: "Western" },
  { id: "mock-central-gynecology-dombivli", name: "Dr. Priya R. Nadkarni, MD, DGO (Gynecology)", specialty: "Gynecology", hospital: "Summit Care Women & Child Hospital", station: "Dombivli", railLine: "Central" },
];

// Assembles the live doctor directory by joining definitions with medical districts and off-rail clinic GPS coordinates
export const mockDoctorDirectory: MockDoctorDirectoryEntry[] = CONTROLLED_DIRECTORY_DEFINITIONS.map((definition) => {
  const station = MUMBAI_RAIL_STATIONS.find((candidate) => candidate.name === definition.station);                  // Find transit station metadata
  const clinicCoord = MUMBAI_CLINIC_COORDINATES[definition.station] ?? MUMBAI_STATION_COORDINATES[definition.station]; // Retrieve off-rail clinic GPS coordinates
  const locality = definition.locality ?? MUMBAI_DISTRICT_LOCALITIES[definition.station] ?? definition.station;      // Retrieve authentic medical district
  if (!station || !clinicCoord) throw new Error(`Missing controlled directory reference data for ${definition.station}`); // Ensure valid configuration

  return {
    id: definition.id,                                                                                             // Unique specialist ID
    name: definition.name,                                                                                         // Formatted doctor title with qualifications
    specialty: definition.specialty,                                                                               // Specialty domain
    hospital: definition.hospital,                                                                                 // Affiliated fictional healthcare facility
    locality,                                                                                                      // Medical district locality
    city: "Mumbai",                                                                                                // Geographical city
    railLine: definition.railLine,                                                                                 // Transit line
    railLines: station.lines,                                                                                      // All intersecting lines
    station: station.name,                                                                                         // Station anchor
    latitude: clinicCoord.latitude,                                                                                // Off-rail clinic latitude
    longitude: clinicCoord.longitude,                                                                              // Off-rail clinic longitude
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
