/**
 * ============================================================================
 * FRONTEND REACT CORE
 * ============================================================================
 * 
 * WHY THIS FILE IS SPECIAL:
 * This is the root configuration of the React application.
 * It sets up the Routing (which URL goes to which page) and global Theme Contexts.
 */
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const globalStyles = readFileSync(new URL('./index.css', import.meta.url), 'utf8');

describe('LifeLink background branding', () => {
  it('uses the official lockup as a subtle, non-interactive blurred background layer', () => {
    expect(globalStyles).toContain("background: url('/assets/branding/lifelink-logo-lockup.jpg')");
    expect(globalStyles).toContain('pointer-events: none');
    expect(globalStyles).toContain('filter: blur(30px)');
    expect(globalStyles).toContain('#root { position: relative; z-index: 1; min-height: 100vh; }');
  });
});
