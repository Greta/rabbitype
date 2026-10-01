import { useEffect, useReducer, useRef, useState } from 'react';
import { Passage } from './Passage';
import { Rabbit } from './Rabbit';
import { readHistory, recordRun, runFromSession, saveHistory } from './history';
import { generatePassage } from './passages';
import {
  createSession,
  scoreSession,
  sessionReducer,
  type Duration,
  type Mode,
  type Settings,
} from './session';

const DEFAULT_SETTINGS: Settings = { mode: 'words', duration: 30 };
const MODES: { value: Mode; label: string }[] = [
  { value: 'words', label: 'Everyday words' },
  { value: 'home-row', label: 'Home row' },
];
const DURATIONS: Duration[] = [30, 60, 120];
const modeName = (mode: Mode) => MODES.find((item) => item.value === mode)!.label;
const freshSession = (settings: Settings) =>
  createSession(settings, generatePassage(settings), crypto.randomUUID());

export default function App() {
  const [session, dispatch] = useReducer(sessionReducer, DEFAULT_SETTINGS, freshSession);
  const [saved, setSaved] = useState(readHistory);
  const [notice, setNotice] = useState('');
  const [focused, setFocused] = useState(false);
  const input = useRef<HTMLTextAreaElement>(null);
  const resultHeading = useRef<HTMLHeadingElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const aboutButton = useRef<HTMLButtonElement>(null);
  const recordedId = useRef<string | null>(null);
  const historyRef = useRef(saved.history);
  const { phase, settings } = session;
  const score = scoreSession(session);
  const remaining = Math.max(0, Math.ceil(settings.duration - session.elapsedMs / 1000));
  const best = saved.history.bests.find(
    (run) => run.mode === settings.mode && run.duration === settings.duration,
  );
  const locked = phase === 'running' || phase === 'paused';

  useEffect(() => {
    if (phase !== 'running') return;
    const timer = window.setInterval(() => dispatch({ type: 'tick', now: performance.now() }), 100);
    const pause = () => dispatch({ type: 'pause', now: performance.now() });
    const onVisibility = () => {
      if (document.hidden) pause();
    };
    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('blur', pause);
    return () => {
      window.clearInterval(timer);
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('blur', pause);
    };
  }, [phase]);

  useEffect(() => {
    if (phase !== 'finished' || recordedId.current === session.id) return;
    recordedId.current = session.id;
    const history = recordRun(historyRef.current, runFromSession(session));
    historyRef.current = history;
    const available = saveHistory(history);
    setSaved({ history, available });
    resultHeading.current?.focus();
  }, [phase, session]);

  function reset(next = settings) {
    dispatch({ type: 'reset', session: freshSession(next) });
    setNotice('');
  }
  function startAgain() {
    reset();
    // The input mounts again when leaving results.
    window.requestAnimationFrame(() => input.current?.focus());
  }
  function resume() {
    dispatch({ type: 'resume', now: performance.now() });
    input.current?.focus();
  }
  function showAbout() {
    dispatch({ type: 'pause', now: performance.now() });
    dialog.current?.showModal();
  }
  function blockPaste() {
    setNotice('One character at a time. Pasting is turned off during practice.');
  }

  return (
    <div className="app-shell">
      <a className="skip-link" href="#practice">
        Skip to typing practice
      </a>
      <header className="site-header">
        <a className="brand" href={import.meta.env.BASE_URL} aria-label="Rabbitype home">
          <span className="brand-mark" aria-hidden="true">
            r
          </span>
          <span>
            rabbitype<span className="brand-dot">.</span>
          </span>
        </a>
        <nav aria-label="Main navigation">
          <button className="text-button" ref={aboutButton} onClick={showAbout}>
            How it works
          </button>
          <a
            className="source-link"
            href="https://github.com/Greta/rabbitype"
            target="_blank"
            rel="noreferrer"
          >
            View source <span aria-hidden="true">↗</span>
          </a>
        </nav>
      </header>

      <main>
        <section className="intro" aria-labelledby="page-title">
          <div>
            <p className="eyebrow">SMALL PRACTICE. HAPPY PROGRESS.</p>
            <h1 id="page-title">
              Find your typing <em>rhythm.</em>
            </h1>
            <p className="intro-copy">A little focus, a few words, and room to get better.</p>
          </div>
          <Rabbit />
        </section>

        <div className="workspace">
          <section
            className="practice-card"
            id="practice"
            aria-label="Typing practice"
            tabIndex={-1}
          >
            <div className="settings">
              <fieldset disabled={locked}>
                <legend>Practice</legend>
                <div className="segmented">
                  {MODES.map((mode) => (
                    <label key={mode.value}>
                      <input
                        type="radio"
                        name="mode"
                        value={mode.value}
                        checked={settings.mode === mode.value}
                        onChange={() => reset({ ...settings, mode: mode.value })}
                      />
                      <span>{mode.label}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
              <fieldset disabled={locked}>
                <legend>Duration</legend>
                <div className="segmented duration">
                  {DURATIONS.map((duration) => (
                    <label key={duration}>
                      <input
                        type="radio"
                        name="duration"
                        value={duration}
                        checked={settings.duration === duration}
                        onChange={() => reset({ ...settings, duration })}
                      />
                      <span>{duration}s</span>
                    </label>
                  ))}
                </div>
              </fieldset>
            </div>

            {phase === 'finished' ? (
              <div className="results">
                <p className="eyebrow">A LITTLE BETTER, ONE WORD AT A TIME</p>
                <h2 ref={resultHeading} tabIndex={-1}>
                  Nicely done.
                </h2>
                <p className="result-description">
                  You made time for {Math.round(session.elapsedMs / 1000)} seconds of practice.
                </p>
                <div className="result-scores">
                  <div>
                    <strong>{score.wpm}</strong>
                    <span>words per minute</span>
                  </div>
                  <div>
                    <strong>
                      {score.accuracy}
                      <small>%</small>
                    </strong>
                    <span>accuracy</span>
                  </div>
                </div>
                <p className="result-detail">
                  {score.correctCharacters} correct characters <span aria-hidden="true">·</span>{' '}
                  {score.mistakes} mistyped {score.mistakes === 1 ? 'character' : 'characters'}
                </p>
                {best?.id === session.id && (
                  <p className="best-banner">
                    <span aria-hidden="true">✧</span> Your best for{' '}
                    {modeName(settings.mode).toLowerCase()} · {settings.duration}s
                  </p>
                )}
                <button className="button primary" onClick={startAgain}>
                  Try again <span aria-hidden="true">↻</span>
                </button>
              </div>
            ) : (
              <>
                <div className="metrics" aria-label="Current session">
                  <div className="metric">
                    <span>Time left</span>
                    <strong>
                      {remaining}
                      <small>s</small>
                    </strong>
                  </div>
                  <div className="metric">
                    <span>Words / min</span>
                    <strong>{score.wpm}</strong>
                  </div>
                  <div className="metric">
                    <span>Accuracy</span>
                    <strong>
                      {score.accuracy}
                      <small>%</small>
                    </strong>
                  </div>
                </div>
                <div className="practice-body">
                  <div className="session-status">
                    <span className={`status-dot ${phase}`} aria-hidden="true" />
                    {phase === 'running'
                      ? 'One word at a time'
                      : phase === 'paused'
                        ? 'Take a breath. We’ll wait.'
                        : 'Ready when you are'}
                    <span className="mode-caption">
                      {settings.mode === 'home-row'
                        ? 'a s d f · j k l'
                        : 'lowercase · no punctuation'}
                    </span>
                  </div>
                  <div className={`passage-frame ${phase === 'paused' ? 'is-paused' : ''}`}>
                    <Passage text={session.passage} value={session.value} />
                    {phase === 'paused' && (
                      <div className="pause-overlay">
                        <span>Practice paused</span>
                        <button className="button primary" onClick={resume}>
                          Resume practice
                        </button>
                      </div>
                    )}
                  </div>
                  <label className="input-label" htmlFor="typing-input">
                    Your typing
                  </label>
                  <p className="sr-only" id="passage-description">
                    Type these words in order: {session.passage}
                  </p>
                  <textarea
                    id="typing-input"
                    ref={input}
                    rows={2}
                    value={session.value}
                    readOnly={phase === 'paused'}
                    aria-describedby="input-note passage-description"
                    className={focused ? 'is-focused' : ''}
                    placeholder="Click here or tab in, then start typing…"
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck={false}
                    enterKeyHint="done"
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    onChange={(event) => {
                      setNotice('');
                      dispatch({
                        type: 'input',
                        value: event.target.value,
                        now: performance.now(),
                      });
                    }}
                    onPaste={(event) => {
                      event.preventDefault();
                      blockPaste();
                    }}
                    onDrop={(event) => {
                      event.preventDefault();
                      blockPaste();
                    }}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') event.preventDefault();
                      if (event.key === 'Escape' && phase === 'running') {
                        event.preventDefault();
                        dispatch({ type: 'pause', now: performance.now() });
                      }
                    }}
                  />
                  <p className="input-note" id="input-note" role="status">
                    {notice ||
                      (phase === 'paused'
                        ? 'Paused. Choose Resume practice to continue.'
                        : phase === 'running'
                          ? 'Backspace to correct · Esc to pause'
                          : 'The timer starts with your first character. Backspace is welcome.')}
                  </p>
                </div>
                <div className="practice-actions">
                  <p>
                    {phase === 'ready'
                      ? 'No rush. Find your flow.'
                      : 'Progress comes with practice.'}
                  </p>
                  <div>
                    {phase === 'running' && (
                      <button
                        className="button secondary"
                        onClick={() => dispatch({ type: 'pause', now: performance.now() })}
                      >
                        Pause
                      </button>
                    )}
                    {phase === 'paused' && (
                      <button className="button secondary" onClick={resume}>
                        Resume
                      </button>
                    )}
                    <button className="button secondary" onClick={startAgain}>
                      <span aria-hidden="true">↻</span>{' '}
                      {phase === 'ready' ? 'New words' : 'Restart'}
                    </button>
                  </div>
                </div>
              </>
            )}
          </section>

          <aside className="sidebar" aria-label="Your progress">
            <section className="best-card">
              <div className="card-title">
                <h2>Personal best</h2>
                <span aria-hidden="true">✧</span>
              </div>
              <p className="best-value">
                {best ? best.wpm : '—'}
                <span>wpm</span>
              </p>
              <p className="best-context">
                {modeName(settings.mode)} · {settings.duration}s
              </p>
              <p className="best-note">
                {best
                  ? `${best.accuracy}% accuracy. A little milestone to build on.`
                  : 'Your first finish is a fresh start. Let’s make it yours.'}
              </p>
            </section>
            <section className="history-card">
              <h2>Recent practice</h2>
              {saved.history.runs.length ? (
                <ol className="history-list">
                  {saved.history.runs.slice(0, 3).map((run) => (
                    <li key={run.id}>
                      <div>
                        <strong>
                          {run.wpm} <span>wpm</span>
                        </strong>
                        <span>{run.accuracy}% accuracy</span>
                      </div>
                      <p>
                        {modeName(run.mode)} · {run.duration}s{' '}
                        <time dateTime={run.completedAt}>
                          {new Date(run.completedAt).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </time>
                      </p>
                    </li>
                  ))}
                </ol>
              ) : (
                <div className="empty-history">
                  <span className="empty-lines" aria-hidden="true">
                    ☷
                  </span>
                  <p>
                    A few small sessions.
                    <br />A little more confidence.
                  </p>
                  <span>Your last three results will appear here.</span>
                </div>
              )}
              <p className="storage-note">
                {saved.available
                  ? 'Saved only in this browser.'
                  : 'Storage is unavailable. Results last for this visit only.'}
              </p>
            </section>
            <p className="gentle-tip">
              <span aria-hidden="true">✳</span> Accuracy first.
              <br />
              <strong>Speed will follow.</strong>
            </p>
          </aside>
        </div>
        <p className="under-practice">A quiet corner of the internet to practice a little.</p>
      </main>

      <footer>
        <span>
          Made with care by <a href="https://github.com/Greta">Greta Prisby</a>
        </span>
        <span>
          Small steps. Steady paws. <span aria-hidden="true">✧</span>
        </span>
      </footer>

      <dialog
        ref={dialog}
        className="about-dialog"
        aria-labelledby="about-title"
        onClose={() => aboutButton.current?.focus()}
      >
        <p className="eyebrow">A LITTLE TYPING PRACTICE</p>
        <h2 id="about-title">Find a comfortable pace.</h2>
        <p>
          Choose everyday words or home row practice, then type the displayed words in the box. The
          timer starts with your first character.
        </p>
        <dl>
          <dt>Words per minute</dt>
          <dd>
            Correct characters currently in your text ÷ 5 ÷ active minutes. Correcting and retyping
            a character won’t inflate your speed.
          </dd>
          <dt>Accuracy</dt>
          <dd>
            Correct characters entered ÷ all characters entered. Backspace is allowed; correcting a
            mistake doesn’t erase it from your accuracy.
          </dd>
          <dt>Make room for a break</dt>
          <dd>
            Press Escape in the typing box or choose Pause. Switching tabs or leaving this window
            pauses practice automatically. Paused time doesn’t count.
          </dd>
          <dt>Your progress stays here</dt>
          <dd>
            Personal bests are separate for each mode and duration. Your last 10 sessions stay in
            this browser; the latest three are shown. There’s no account or leaderboard.
          </dd>
        </dl>
        <form method="dialog">
          <button className="button primary">Got it</button>
        </form>
      </dialog>
    </div>
  );
}
