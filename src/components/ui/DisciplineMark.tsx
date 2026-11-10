const marks = {
  hearth: "M8 40h32M12 40V22h24v18M16 22V14h16v8M20 14 24 8h8l4 6",
  gate: "M10 42V16M38 42V16M10 16h28M16 42V22M32 42V22M16 22h16M24 16V8",
  orbit: "M24 8a16 16 0 1 0 0 32 16 16 0 0 0 0-32M24 4v40M8 24h32",
  grid: "M8 8h32v32H8zM18.6 8v32M29.3 8v32M8 18.6h32M8 29.3h32",
} as const;

export function DisciplineMark({
  name,
  className,
}: {
  name: keyof typeof marks;
  className?: string;
}) {
  return (
    <svg viewBox="0 0 48 48" fill="none" aria-hidden="true" className={className}>
      <path d={marks[name]} stroke="currentColor" strokeWidth="1.25" />
    </svg>
  );
}
