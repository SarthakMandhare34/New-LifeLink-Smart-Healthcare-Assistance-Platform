/**
 * ============================================================================
 * AUTOMATED TEST SUITE: EMERGENCY CONTACT VALIDATION (backend/emergencyContact.validation.test.ts)
 * ============================================================================
 *
 * WHAT THIS TEST VERIFIES:
 * During a medical crisis (e.g., severe accident or cardiac event), doctors and first
 * responders rely on the patient's Emergency Contacts in their Health Passport.
 *
 * CRITICAL TEST OBJECTIVES:
 * 1. Valid Phone Formats: Ensures valid domestic and international phone numbers (e.g. +91 98765 43210)
 *    are accepted without friction.
 * 2. Invalid Input Rejection: Guarantees that blank entries, numbers under 7 digits, or arbitrary
 *    alphabetic text are immediately rejected before saving to MySQL.
 */
import { describe, expect, it } from 'vitest';                                             // Vitest testing framework primitives
import { emergencyContactInput } from './routers/patient';                                 // Zod validation schema for emergency contact creation

describe('emergency contact phone validation', () => {
  // Scenario 1: Realistic international/local format acceptance
  it('accepts a patient-entered local or international contact number', () => {
    expect(emergencyContactInput.parse({
      name: 'Family contact',                                                              // Contact name
      relationship: 'Sibling',                                                             // Kinship / relationship
      phone: '+91 98765 43210',                                                            // Valid E.164-style telephone format
    })).toMatchObject({ phone: '+91 98765 43210' });                                       // Must successfully parse and return object
  });

  // Scenario 2: Prevention of bad data
  it('rejects an empty, too-short, or non-phone emergency contact number', () => {
    expect(() => emergencyContactInput.parse({ name: 'Family contact', relationship: 'Sibling', phone: '' })).toThrow(); // Rejects empty string
    expect(() => emergencyContactInput.parse({ name: 'Family contact', relationship: 'Sibling', phone: '1234' })).toThrow(); // Rejects < 7 digits
    expect(() => emergencyContactInput.parse({ name: 'Family contact', relationship: 'Sibling', phone: 'call-me' })).toThrow(); // Rejects non-numeric text
  });
});
