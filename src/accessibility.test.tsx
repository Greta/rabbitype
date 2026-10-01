import { act, fireEvent, render, screen } from '@testing-library/react';
import axe from 'axe-core';
import { afterEach, expect, it, vi } from 'vitest';
import App from './App';

afterEach(() => vi.useRealTimers());
const audit = (container: HTMLElement) =>
  axe.run(container, {
    // jsdom has no layout engine; contrast is reviewed in the rendered browser.
    rules: { 'color-contrast': { enabled: false } },
  });

it('has labelled, structurally accessible practice controls', async () => {
  const { container } = render(<App />);
  expect((await audit(container)).violations).toEqual([]);
});

it('has accessible results and moves focus to their heading', async () => {
  vi.useFakeTimers();
  const { container } = render(<App />);
  fireEvent.change(screen.getByRole('textbox'), { target: { value: 'hello' } });
  act(() => vi.advanceTimersByTime(30000));
  expect(screen.getByRole('heading', { name: 'Nicely done.' })).toHaveFocus();
  vi.useRealTimers();
  expect((await audit(container)).violations).toEqual([]);
});
