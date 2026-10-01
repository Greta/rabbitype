export function Rabbit() {
  return (
    <svg className="rabbit" viewBox="0 0 120 120" fill="none" aria-hidden="true">
      <ellipse cx="61" cy="108" rx="35" ry="5" fill="var(--panel-raised)" />
      <g stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M42 63C31 44 27 10 37 9c12-2 20 32 20 48" fill="var(--black)" />
        <path d="M63 55C63 30 74 5 83 10c11 6-1 39-9 51" fill="var(--black)" />
        <path d="M41 23c1 10 4 20 8 28M79 23c-2 9-5 17-9 26" stroke="var(--magenta)" />
        <path
          d="M28 79c0-21 14-31 32-31s34 12 34 33c0 19-15 27-34 27S28 99 28 79Z"
          fill="var(--black)"
        />
        <path d="m53 82 6 4 6-4M59 86v5m0 0c-3 4-7 3-8 0m8 0c3 4 7 3 8 0" />
        <path d="M18 64h-8m13-13-6-5m79 14 8-3m-8 14 9 2" stroke="var(--yellow)" />
      </g>
      <ellipse cx="44" cy="75" rx="2.5" ry="3.7" fill="var(--text)" />
      <ellipse cx="74" cy="75" rx="2.5" ry="3.7" fill="var(--text)" />
      <ellipse cx="38" cy="85" rx="6" ry="3" fill="var(--magenta)" />
      <ellipse cx="80" cy="85" rx="6" ry="3" fill="var(--magenta)" />
    </svg>
  );
}
