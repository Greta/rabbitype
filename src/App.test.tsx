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
    await user.click(screen.getByRole('radio', { name: '60s' }));
    expect(screen.getByRole('radio', { name: '60s' })).toBeChecked();
    expect(screen.getByRole('textbox', { name: 'Your typing' })).toHaveValue('');
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
