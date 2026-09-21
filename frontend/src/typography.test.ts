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

const documentSource = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const globalStyles = readFileSync(new URL('./index.css', import.meta.url), 'utf8');

describe('LifeLink typography', () => {
  it('loads Plus Jakarta Sans and applies it to the global body and heading hierarchy', () => {
    expect(documentSource).toContain('family=Plus+Jakarta+Sans');
    expect(globalStyles).toContain("font-family: 'Plus Jakarta Sans'");
    expect(globalStyles).toContain(".app-mobile-brand { display: none; align-items: center; gap: 7px; min-width: 0; color: var(--color-text); font-family: 'Plus Jakarta Sans'");
  });

  it('verifies that Oxanium and Outfit fonts are purged from index.css', () => {
    expect(globalStyles).not.toContain("'Outfit'");
    expect(globalStyles).not.toContain("'Oxanium'");
  });
});
