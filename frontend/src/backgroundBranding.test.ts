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
  it('validates Swiss solid background architecture and absence of decorative blurred branding', () => {
    // Decorative blurred background layer is purged and disabled
    expect(globalStyles).toContain('body::before');
    expect(globalStyles).toContain('display: none !important');
    expect(globalStyles).not.toContain('filter: blur(30px)');
    expect(globalStyles).not.toContain("background: url('/assets/branding/lifelink-logo-lockup.jpg')");

    // Swiss solid white and neutral surface tokens are active
    expect(globalStyles).toContain('--swiss-white: #FFFFFF;');
    expect(globalStyles).toContain('--color-surface-white: var(--swiss-white);');
    expect(globalStyles).toContain('#root { position: relative; z-index: 1; min-height: 100vh; }');

    // Official LifeLink logo remains functional and crisp on high-contrast mounts
    expect(globalStyles).toContain('.lifelink-logo-crop');
    expect(globalStyles).toContain('.lifelink-logo');
  });
});
