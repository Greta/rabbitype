import { StrictMode } from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import App from './App';
import { readHistory } from './history';

beforeEach(() => {
  localStorage.clear();
  vi.useFakeTimers();
});
afterEach(() => vi.useRealTimers());

describe('the complete practice flow', () => {
  it('can select modes and duration by keyboard with labelled controls', async () => {
    vi.useRealTimers();
    const user = userEvent.setup();
    render(<App />);
    screen.getByRole('radio', { name: 'Everyday words' }).focus();
    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('radio', { name: 'Home row' })).toBeChecked();
    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('radio', { name: 'Top row' })).toBeChecked();
    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('radio', { name: 'Bottom row' })).toBeChecked();
    await user.click(screen.getByRole('radio', { name: '60s' }));
    expect(screen.getByRole('radio', { name: '60s' })).toBeChecked();
    expect(screen.getByRole('textbox', { name: 'Your typing' })).toHaveValue('');
  });

  it.each([
    { label: 'Top row', mode: 'top-row', allowed: /^[qwertyuiop ]+$/ },
    { label: 'Bottom row', mode: 'bottom-row', allowed: /^[zxcvbnm ]+$/ },
  ])('completes and saves a $label session', ({ label, mode, allowed }) => {
    const { container } = render(<App />);
    fireEvent.click(screen.getByRole('radio', { name: label }));
    const passage = container.querySelector('.passage')!.textContent!;
    expect(passage).toMatch(allowed);
    fireEvent.change(screen.getByRole('textbox'), { target: { value: passage.slice(0, 8) } });
    expect(screen.getByRole('radio', { name: label })).toBeDisabled();
    act(() => vi.advanceTimersByTime(30000));
    expect(screen.getByRole('heading', { name: 'Nicely done.' })).toHaveFocus();
    expect(readHistory().history.runs[0]).toMatchObject({ mode, accuracy: 100, wpm: 3 });
    expect(readHistory().history.bests[0]).toMatchObject({ mode, duration: 30 });
  });

  it('starts on input, pauses on Escape, and saves a single result under StrictMode', () => {
    render(
      <StrictMode>
        <App />
      </StrictMode>,
    );
    const input = screen.getByRole('textbox', { name: 'Your typing' });
    act(() => vi.advanceTimersByTime(5000));
    expect(screen.queryByRole('button', { name: 'Pause' })).not.toBeInTheDocument();
    fireEvent.change(input, { target: { value: 'hello' } });
    expect(screen.getByRole('radio', { name: 'Home row' })).toBeDisabled();
    act(() => vi.advanceTimersByTime(10000));
    fireEvent.keyDown(input, { key: 'Escape' });
    expect(input).toHaveAttribute('readonly');
    act(() => vi.advanceTimersByTime(40000));
    expect(screen.queryByText('Nicely done.')).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Resume practice' }));
    act(() => vi.advanceTimersByTime(20000));
    expect(screen.getByRole('heading', { name: 'Nicely done.' })).toHaveFocus();
    expect(readHistory().history.runs).toHaveLength(1);
    fireEvent.click(screen.getByRole('button', { name: /Try again/ }));
    expect(screen.getByRole('textbox', { name: 'Your typing' })).toHaveValue('');
    expect(screen.getByRole('radio', { name: 'Home row' })).toBeEnabled();
  });

  it('pauses when the window loses focus and restarts with a clean input', () => {
    render(<App />);
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'abc' } });
    fireEvent.blur(window);
    expect(screen.getByRole('button', { name: 'Resume practice' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Restart/ }));
    expect(screen.getByRole('textbox')).toHaveValue('');
    expect(screen.queryByRole('button', { name: 'Pause' })).not.toBeInTheDocument();
  });

  it('blocks pasted text and explains why', () => {
    render(<App />);
    const event = new Event('paste', { bubbles: true, cancelable: true });
    fireEvent(screen.getByRole('textbox'), event);
    expect(event.defaultPrevented).toBe(true);
    expect(screen.getByRole('status')).toHaveTextContent('Pasting is turned off');
    expect(screen.getByRole('textbox')).toHaveValue('');
  });
});
