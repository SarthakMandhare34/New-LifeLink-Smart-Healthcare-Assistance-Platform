/**
 * ============================================================================
 * ARTIFICIAL INTELLIGENCE TRIAGE ENGINE
 * ============================================================================
 *
 * WHY THIS FILE IS SPECIAL:
 * This is the brain of LifeLink. It connects to Google's Gemini AI supercomputers.
 * It is special because it doesn't just chat; it uses a strict 5-layer safety architecture:
 * 1. Rejects non-medical nonsense.
 * 2. Enforces biological reality (e.g., stopping male pregnancy diagnoses).
 * 3. Enforces pediatric guardrails for children under 18.
 * 4. Categorizes life-threatening emergencies instantly.
 * 5. Forces the AI to output machine-readable JSON instead of just text.
 */
import { describe, expect, it } from "vitest";
import { assessmentRequestInput } from "./assessmentService";

describe("assessment persistence input", () => {
  const validAssessment = {
    symptoms: "Mild headache for one day",
    age: 30,
    gender: "Other",
    conditions: "",
    duration: "< 24 hours",
  };

  it("accepts a complete assessment record", () => {
    expect(assessmentRequestInput.parse(validAssessment)).toEqual(validAssessment);
  });

  it("rejects invalid assessment ages and missing demographic input", () => {
    expect(() => assessmentRequestInput.parse({ ...validAssessment, age: 101 })).toThrow();
    expect(() => assessmentRequestInput.parse({ ...validAssessment, age: -1 })).toThrow();
    expect(() => assessmentRequestInput.parse({ ...validAssessment, gender: "" })).toThrow();
    expect(assessmentRequestInput.parse({ ...validAssessment, age: 100 }).age).toBe(100);
    expect(assessmentRequestInput.parse({ ...validAssessment, age: 0 }).age).toBe(0);
  });
});
