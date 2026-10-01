import { describe, expect, it } from 'vitest';
import { generatePassage } from './passages';

describe('keyboard row practice', () => {
  it.each([
    { mode: 'home-row' as const, allowed: /^[asdfghjkl ]+$/ },
    { mode: 'top-row' as const, allowed: /^[qwertyuiop ]+$/ },
    { mode: 'bottom-row' as const, allowed: /^[zxcvbnm ]+$/ },
  ])('only includes letters from $mode', ({ mode, allowed }) => {
    let draw = 0;
    // Sweep the random range to exercise the whole bank, not one lucky sample.
    const passage = generatePassage({ mode, duration: 30 }, () => draw++ / 180);
    expect(passage).toMatch(allowed);
    expect(new Set(passage.split(' ')).size).toBeGreaterThan(10);
  });
});
