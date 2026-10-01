import { memo, useLayoutEffect, useRef } from 'react';

export const Passage = memo(function Passage({ text, value }: { text: string; value: string }) {
  const panel = useRef<HTMLDivElement>(null);
  const caret = useRef<HTMLSpanElement>(null);
  useLayoutEffect(() => {
    if (panel.current && caret.current)
      panel.current.scrollTop = Math.max(0, caret.current.offsetTop - 48);
  }, [value, text]);
  let position = 0;
  return (
    <div className="passage" aria-hidden="true" ref={panel}>
      {text.split(' ').map((word, wordIndex, words) => {
        const characters = word + (wordIndex < words.length - 1 ? ' ' : '');
        return (
          <span className="passage-word" key={wordIndex}>
            {[...characters].map((character) => {
              const index = position++;
              const state =
                index >= value.length
                  ? 'upcoming'
                  : value[index] === character
                    ? 'correct'
                    : 'incorrect';
              return (
                <span
                  key={index}
                  ref={index === value.length ? caret : null}
                  className={`${state}${index === value.length ? ' caret' : ''}`}
                >
                  {character}
                </span>
              );
            })}
          </span>
        );
      })}
    </div>
  );
});
