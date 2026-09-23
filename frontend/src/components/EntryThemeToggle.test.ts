/**
 * ============================================================================
 * REUSABLE UI COMPONENTS (DESIGN SYSTEM)
 * ============================================================================
 *
 * WHY THIS FILE IS SPECIAL:
 * Instead of rewriting the code for a button 50 times, we write it once here.
 * This ensures the entire application looks perfectly consistent (using Tailwind CSS)
 * and guarantees every component is accessible to screen readers for visually impaired users.
 */
import { describe, expect, it } from 'vitest';
import { getEntryThemeToggleCopy } from './EntryThemeToggle';

describe('entry theme toggle copy', () => {
  it('describes the alternate theme rather than the active theme', () => {
    expect(getEntryThemeToggleCopy('light')).toEqual({
      action: 'Switch to dark mode',
      label: 'Dark mode',
    });
    expect(getEntryThemeToggleCopy('dark')).toEqual({
      action: 'Switch to light mode',
      label: 'Light mode',
    });
  });
});
