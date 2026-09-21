import { mockDoctorDirectory, type MockDoctorDirectoryEntry } from "../backend/discovery/mockDoctorDirectory";

const shortSlugs: Record<string, string> = {
  cardiology: "cardio",
  orthopedics: "ortho",
  dermatology: "derma",
  neurology: "neuro",
  pediatrics: "pedia",
  generalpractice: "general",
  ophthalmology: "ophthal",
  gastroenterology: "gastro",
  psychiatry: "psych",
  endocrinology: "endo",
  pulmonology: "pulmo",
  gynecology: "gynae",
};

console.log("| # | Doctor Name | Specialty | Medical Facility & Locality | Doctor Email | Primary Password | Quick Easy Password |");
console.log("|---|---|---|---|---|---|---|");

mockDoctorDirectory.forEach((d: MockDoctorDirectoryEntry, i: number) => {
  const specSlug = d.specialty.toLowerCase().replace(/[^a-z]/g, "");
  const stationSlug = d.station.toLowerCase().replace(/[^a-z]/g, "");
  const short = shortSlugs[specSlug] || specSlug;
  const email = `${d.id.replace("mock-", "")}@lifelink.com`;
  const primaryPassword = `${specSlug}.${stationSlug}@lifelink`;
  const easyPassword = `${short}@lifelink`;

  console.log(`| ${i + 1} | **${d.name}** | ${d.specialty} | ${d.hospital} (${d.locality}) | \`${email}\` | \`${primaryPassword}\` | \`${easyPassword}\` |`);
});
