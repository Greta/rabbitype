import { scoreSession, type Duration, type Mode, type Session } from './session';

export interface Run {
  id: string;
  mode: Mode;
  duration: Duration;
  wpm: number;
  accuracy: number;
  completedAt: string;
}
export interface History {
  version: 1;
  runs: Run[];
  bests: Run[];
}
export const STORAGE_KEY = 'rabbitype.history.v1';
const emptyHistory = (): History => ({ version: 1, runs: [], bests: [] });

function isRun(value: unknown): value is Run {
  if (!value || typeof value !== 'object') return false;
  const run = value as Record<string, unknown>;
  return (
    typeof run.id === 'string' &&
    ['words', 'home-row', 'top-row', 'bottom-row'].includes(run.mode as string) &&
    [30, 60, 120].includes(run.duration as number) &&
    typeof run.wpm === 'number' &&
    Number.isFinite(run.wpm) &&
    run.wpm >= 0 &&
    typeof run.accuracy === 'number' &&
    Number.isFinite(run.accuracy) &&
    run.accuracy >= 0 &&
    run.accuracy <= 100 &&
    typeof run.completedAt === 'string' &&
    Number.isFinite(Date.parse(run.completedAt))
  );
}

export function readHistory(): { history: History; available: boolean } {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { history: emptyHistory(), available: true };
    const parsed = JSON.parse(raw);
    if (parsed?.version !== 1 || !Array.isArray(parsed.runs) || !Array.isArray(parsed.bests)) {
      return { history: emptyHistory(), available: true };
    }
    return {
      history: {
        version: 1,
        runs: parsed.runs.filter(isRun).slice(0, 10),
        bests: parsed.bests.filter(isRun).slice(0, 12),
      },
      available: true,
    };
  } catch {
    return { history: emptyHistory(), available: false };
  }
}

export function recordRun(history: History, run: Run): History {
  if (history.runs.some((existing) => existing.id === run.id)) return history;
  const matches = (existing: Run) =>
    existing.mode === run.mode && existing.duration === run.duration;
  const previous = history.bests.find(matches);
  const isBetter =
    !previous ||
    run.wpm > previous.wpm ||
    (run.wpm === previous.wpm && run.accuracy > previous.accuracy);
  return {
    version: 1,
    runs: [run, ...history.runs].slice(0, 10),
    bests: isBetter
      ? [...history.bests.filter((existing) => !matches(existing)), run]
      : history.bests,
  };
}

export function saveHistory(history: History): boolean {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    return true;
  } catch {
    return false;
  }
}

export function runFromSession(session: Session): Run {
  const { wpm, accuracy } = scoreSession(session);
  return {
    id: session.id,
    ...session.settings,
    wpm,
    accuracy,
    completedAt: new Date().toISOString(),
  };
}
