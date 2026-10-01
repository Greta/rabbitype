import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Duration, Mode } from './session';
import {
  readHistory,
  recordRun,
  saveHistory,
  STORAGE_KEY,
  type History,
  type Run,
} from './history';

const empty = (): History => ({ version: 1, runs: [], bests: [] });
const run = (overrides: Partial<Run> = {}): Run => ({
  id: 'one',
  mode: 'words',
  duration: 30,
  wpm: 50,
  accuracy: 95,
  completedAt: '2026-10-01T12:00:00.000Z',
  ...overrides,
});
beforeEach(() => localStorage.clear());

describe('local progress', () => {
  it('keeps independent personal bests for every mode and duration', () => {
    let history = recordRun(empty(), run());
    history = recordRun(history, run({ id: 'two', mode: 'home-row', wpm: 60 }));
    history = recordRun(history, run({ id: 'three', duration: 60, wpm: 40 }));
    history = recordRun(history, run({ id: 'four', wpm: 45 }));
    expect(history.bests).toHaveLength(3);
    expect(history.bests.find((best) => best.mode === 'words' && best.duration === 30)?.id).toBe(
      'one',
    );
  });

  it('breaks a tied speed by accuracy and does not duplicate a completed session', () => {
    let history = recordRun(empty(), run());
    history = recordRun(history, run({ id: 'two', accuracy: 99 }));
    expect(history.bests[0].id).toBe('two');
    expect(recordRun(history, run({ id: 'two', accuracy: 99 }))).toBe(history);
  });

  it('retains the best even after it leaves the 10 most recent sessions', () => {
    let history = recordRun(empty(), run({ wpm: 100 }));
    for (let index = 0; index < 12; index++)
      history = recordRun(history, run({ id: String(index), wpm: 20 }));
    expect(history.runs).toHaveLength(10);
    expect(history.runs.some((item) => item.id === 'one')).toBe(false);
    expect(history.bests[0].id).toBe('one');
  });

  it('round-trips saved progress and discards malformed records', () => {
    const history = recordRun(empty(), run());
    expect(saveHistory(history)).toBe(true);
    expect(readHistory().history).toEqual(history);
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ ...history, runs: [{ ...run(), wpm: -1 }, run()] }),
    );
    expect(readHistory().history.runs).toEqual([run()]);
  });

  it('preserves all twelve mode and duration bests across reloads', () => {
    let history = empty();
    const modes: Mode[] = ['words', 'home-row', 'top-row', 'bottom-row'];
    const durations: Duration[] = [30, 60, 120];
    for (const mode of modes) {
      for (const duration of durations) {
        history = recordRun(history, run({ id: `${mode}-${duration}`, mode, duration }));
      }
    }
    expect(saveHistory(history)).toBe(true);
    const restored = readHistory().history;
    expect(restored.bests).toHaveLength(12);
    expect(restored.bests).toEqual(history.bests);
    expect(restored.runs).toEqual(history.runs);
  });

  it('recovers from invalid JSON and handles disabled storage', () => {
    localStorage.setItem(STORAGE_KEY, '{bad json');
    expect(readHistory().history).toEqual(empty());
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('Storage blocked');
    });
    expect(saveHistory(empty())).toBe(false);
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('Storage blocked');
    });
    expect(readHistory()).toEqual({ history: empty(), available: false });
  });
});
