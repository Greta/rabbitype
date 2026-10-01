export type Mode = 'words' | 'home-row' | 'top-row' | 'bottom-row';
export type Duration = 30 | 60 | 120;
export interface Settings {
  mode: Mode;
  duration: Duration;
}
export type Phase = 'ready' | 'running' | 'paused' | 'finished';

export interface Session {
  id: string;
  settings: Settings;
  passage: string;
  value: string;
  phase: Phase;
  elapsedMs: number;
  clockAt: number | null;
  attempts: number;
  correctAttempts: number;
}

export type Action =
  | { type: 'input'; value: string; now: number }
  | { type: 'tick' | 'pause' | 'resume'; now: number }
  | { type: 'reset'; session: Session };

export function createSession(settings: Settings, passage: string, id: string): Session {
  return {
    id,
    settings,
    passage,
    value: '',
    phase: 'ready',
    elapsedMs: 0,
    clockAt: null,
    attempts: 0,
    correctAttempts: 0,
  };
}

function timeAt(session: Session, now: number) {
  return Math.min(
    session.settings.duration * 1000,
    session.elapsedMs + (session.clockAt === null ? 0 : Math.max(0, now - session.clockAt)),
  );
}

export function sessionReducer(session: Session, action: Action): Session {
  if (action.type === 'reset') return action.session;
  if (action.type === 'resume') {
    return session.phase === 'paused'
      ? { ...session, phase: 'running', clockAt: action.now }
      : session;
  }
  if (session.phase === 'finished' || session.phase === 'paused') return session;
  const elapsedMs = timeAt(session, action.now);
  if (session.phase === 'running' && elapsedMs >= session.settings.duration * 1000) {
    return { ...session, phase: 'finished', elapsedMs, clockAt: null };
  }
  if (action.type === 'pause') {
    return session.phase === 'running'
      ? { ...session, phase: 'paused', elapsedMs, clockAt: null }
      : session;
  }
  if (action.type === 'tick') {
    return session.phase === 'running' ? { ...session, elapsedMs, clockAt: action.now } : session;
  }
  if (action.type !== 'input') return session;
  const value = action.value.replace(/[\r\n]/g, ' ').slice(0, session.passage.length);
  if (value === session.value || (session.phase === 'ready' && !value)) return session;

  // Count inserted characters, including replacements, without counting deletions twice.
  let prefix = 0;
  while (
    prefix < value.length &&
    prefix < session.value.length &&
    value[prefix] === session.value[prefix]
  )
    prefix++;
  let suffix = 0;
  while (
    suffix < value.length - prefix &&
    suffix < session.value.length - prefix &&
    value[value.length - 1 - suffix] === session.value[session.value.length - 1 - suffix]
  )
    suffix++;
  const inserted = value.slice(prefix, value.length - suffix);
  const correct = [...inserted].filter(
    (character, index) => character === session.passage[prefix + index],
  ).length;
  const finished = value.length === session.passage.length;
  return {
    ...session,
    value,
    elapsedMs,
    phase: finished ? 'finished' : 'running',
    clockAt: finished ? null : action.now,
    attempts: session.attempts + inserted.length,
    correctAttempts: session.correctAttempts + correct,
  };
}

export function scoreSession(session: Session) {
  const correctCharacters = [...session.value].filter(
    (character, index) => character === session.passage[index],
  ).length;
  return {
    wpm:
      session.elapsedMs > 0 ? Math.round(correctCharacters / 5 / (session.elapsedMs / 60000)) : 0,
    accuracy: session.attempts
      ? Math.round((session.correctAttempts / session.attempts) * 100)
      : 100,
    mistakes: session.attempts - session.correctAttempts,
    correctCharacters,
  };
}
