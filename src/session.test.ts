import { describe, expect, it } from 'vitest';
import { createSession, scoreSession, sessionReducer } from './session';

const fresh = () => createSession({ mode: 'words', duration: 30 }, 'hello world', 'test');

describe('the practice clock', () => {
  it('waits for the first character, then measures active time', () => {
    const ready = sessionReducer(fresh(), { type: 'tick', now: 60000 });
    expect(ready.phase).toBe('ready');
    expect(ready.elapsedMs).toBe(0);
    const started = sessionReducer(ready, { type: 'input', value: 'h', now: 60000 });
    expect(started.phase).toBe('running');
    expect(sessionReducer(started, { type: 'tick', now: 61000 }).elapsedMs).toBe(1000);
  });

  it('excludes pauses and refuses input until resumed', () => {
    const started = sessionReducer(fresh(), { type: 'input', value: 'h', now: 100 });
    const paused = sessionReducer(started, { type: 'pause', now: 1100 });
    expect(paused.elapsedMs).toBe(1000);
    expect(sessionReducer(paused, { type: 'input', value: 'hello', now: 20000 })).toBe(paused);
    const resumed = sessionReducer(paused, { type: 'resume', now: 50100 });
    expect(sessionReducer(resumed, { type: 'tick', now: 51100 }).elapsedMs).toBe(2000);
  });

  it('finishes at the deadline even if a timer tick arrives late', () => {
    const started = sessionReducer(fresh(), { type: 'input', value: 'h', now: 100 });
    const finished = sessionReducer(started, { type: 'tick', now: 45100 });
    expect(finished.phase).toBe('finished');
    expect(finished.elapsedMs).toBe(30000);
    expect(sessionReducer(finished, { type: 'resume', now: 50000 })).toBe(finished);
  });

  it('does not accept a character that arrives after the deadline', () => {
    const started = sessionReducer(fresh(), { type: 'input', value: 'h', now: 100 });
    const finished = sessionReducer(started, { type: 'input', value: 'he', now: 30101 });
    expect(finished.phase).toBe('finished');
    expect(finished.value).toBe('h');
    expect(finished.attempts).toBe(1);
  });

  it('finishes early if the entire passage is typed', () => {
    const started = sessionReducer(fresh(), { type: 'input', value: 'h', now: 100 });
    const finished = sessionReducer(started, { type: 'input', value: 'hello world', now: 10100 });
    expect(finished.phase).toBe('finished');
    expect(scoreSession(finished).wpm).toBe(13);
  });
});

describe('scoring', () => {
  it('preserves mistakes after backspace and counts retyped characters only once toward speed', () => {
    let state = sessionReducer(fresh(), { type: 'input', value: 'hx', now: 0 });
    state = sessionReducer(state, { type: 'input', value: 'h', now: 1000 });
    state = sessionReducer(state, { type: 'input', value: 'hello', now: 10000 });
    expect(state.attempts).toBe(6);
    expect(scoreSession(state)).toEqual({
      wpm: 6,
      accuracy: 83,
      mistakes: 1,
      correctCharacters: 5,
    });
  });

  it('counts replacement text without recounting the unchanged suffix', () => {
    let state = sessionReducer(fresh(), { type: 'input', value: 'hxllo', now: 0 });
    state = sessionReducer(state, { type: 'input', value: 'hello', now: 10000 });
    expect(state.attempts).toBe(6);
    expect(state.correctAttempts).toBe(5);
  });

  it('never produces an infinite speed before time has elapsed', () => {
    expect(scoreSession(fresh())).toEqual({
      wpm: 0,
      accuracy: 100,
      mistakes: 0,
      correctCharacters: 0,
    });
    expect(
      scoreSession(sessionReducer(fresh(), { type: 'input', value: 'hello', now: 0 })).wpm,
    ).toBe(0);
  });
});
