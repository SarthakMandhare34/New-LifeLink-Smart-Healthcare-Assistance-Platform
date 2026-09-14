import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const globalStyles = readFileSync(new URL('./index.css', import.meta.url), 'utf8');
const discoveryStyles = readFileSync(new URL('./features/patient/Specialists/specialistFinder.css', import.meta.url), 'utf8');

describe('multi-display responsive layout system', () => {
  it('defines wide desktop, laptop/tablet, mobile, and compact touch-screen layout rules', () => {
    expect(globalStyles).toContain('@media (min-width: 1280px)');
    expect(globalStyles).toContain('@media (min-width: 769px) and (max-width: 1024px)');
    expect(globalStyles).toContain('@media (max-width: 768px)');
    expect(globalStyles).toContain('@media (max-width: 480px)');
    expect(globalStyles).toContain('min-height: 44px');
  });

  it('keeps the Specialist Finder map and filters responsive from tablet to compact mobile', () => {
    expect(discoveryStyles).toContain('grid-template-columns: repeat(2, minmax(0, 1fr))');
    expect(discoveryStyles).toContain('grid-template-columns: 1fr;');
    expect(discoveryStyles).toContain('height: clamp(280px, 62vw, 360px)');
    expect(discoveryStyles).toContain('@media (max-width: 640px)');
    expect(discoveryStyles).toContain('min-height: 52px');
    expect(discoveryStyles).toContain('touch-action: manipulation');
    expect(discoveryStyles).toContain('outline: 3px solid');
  });

  it('keeps the mobile drawer compact with its official brand first and every navigation label readable', () => {
    expect(globalStyles).toContain('width: min(276px, calc(100vw - 72px))');
    expect(globalStyles).toContain('flex-direction: column;');
    expect(globalStyles).toContain('.app-sidebar-header .lifelink-logo-sidebar');
    expect(globalStyles).toContain('overflow-x: hidden');
    expect(globalStyles).toContain('display: inline !important');
    expect(globalStyles).toContain('overflow-wrap: anywhere');
  });

  it('defines aligned care shortcuts and a responsive circular profile-photo control', () => {
    expect(globalStyles).toContain('.dashboard-quick-action');
    expect(globalStyles).toContain('grid-template-columns: minmax(0, 1fr) auto');
    expect(globalStyles).toContain('.patient-profile-avatar');
    expect(globalStyles).toContain('object-fit: cover');
  });

  it('covers the complete multi-device matrix from small phones up to 4K ultra-wide screens', () => {
    // Phones (320px, 360px, 390px, 430px, 480px)
    expect(globalStyles).toContain('@media (max-width: 320px)');
    expect(globalStyles).toContain('@media (max-width: 360px)');
    expect(globalStyles).toContain('@media (max-width: 390px)');
    expect(globalStyles).toContain('@media (max-width: 430px)');
    expect(globalStyles).toContain('@media (max-width: 480px)');

    // Tablets (600px, 768px, 834px-1024px)
    expect(globalStyles).toContain('@media (min-width: 600px) and (max-width: 768px)');
    expect(globalStyles).toContain('@media (max-width: 768px)');
    expect(globalStyles).toContain('@media (min-width: 769px) and (max-width: 1024px)');

    // Laptops (1025px, 1280px, 1366px, 1440px)
    expect(globalStyles).toContain('@media (min-width: 1025px) and (max-width: 1279px)');
    expect(globalStyles).toContain('@media (min-width: 1280px)');
    expect(globalStyles).toContain('@media (min-width: 1366px) and (max-width: 1439px)');
    expect(globalStyles).toContain('@media (min-width: 1440px) and (max-width: 1535px)');

    // Desktop monitors & Ultra-wide/4K displays (1536px, 1920px, 2560px, 3840px)
    expect(globalStyles).toContain('@media (min-width: 1536px) and (max-width: 1919px)');
    expect(globalStyles).toContain('@media (min-width: 1920px) and (max-width: 2559px)');
    expect(globalStyles).toContain('@media (min-width: 2560px) and (max-width: 3839px)');
    expect(globalStyles).toContain('@media (min-width: 3840px)');
  });

  it('guarantees the official LifeLink logo is rendered on high-contrast mounted plates and visible on mobile auth cards', () => {
    // Logo plate styling in global styles
    expect(globalStyles).toContain('.lifelink-logo-crop');
    expect(globalStyles).toContain('background: #FAF7F2;');
    expect(globalStyles).toContain('border: 1px solid #E0D8CE;');
    expect(globalStyles).toContain('.auth-card-mobile-logo-wrap');
    expect(globalStyles).toContain('.auth-card-mobile-logo');

    // Verify all four auth entry components contain the mobile logo mount
    const patientLoginSrc = readFileSync(new URL('./features/entry/Login.tsx', import.meta.url), 'utf8');
    const patientRegisterSrc = readFileSync(new URL('./features/entry/Register.tsx', import.meta.url), 'utf8');
    const doctorLoginSrc = readFileSync(new URL('./features/doctor/Login.tsx', import.meta.url), 'utf8');
    const doctorResetSrc = readFileSync(new URL('./features/doctor/ResetPassword.tsx', import.meta.url), 'utf8');

    expect(patientLoginSrc).toContain('auth-card-mobile-logo');
    expect(patientRegisterSrc).toContain('auth-card-mobile-logo');
    expect(doctorLoginSrc).toContain('auth-card-mobile-logo');
    expect(doctorResetSrc).toContain('auth-card-mobile-logo');
  });
});
