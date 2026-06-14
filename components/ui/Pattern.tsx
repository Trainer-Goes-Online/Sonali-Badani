/**
 * Brand patterns recreated as lightweight, tiling SVGs (data-URI free, inline).
 * Pattern A: small coral swirl + sparkle, used as a faint texture.
 * Pattern B: larger coral swirls with navy 4-point stars, used decoratively
 * behind a SOLID white/navy content block in feature sections.
 * Both are decorative only and marked aria-hidden.
 */

const STAR = (cx: number, cy: number, r: number, fill: string) =>
  `<path d="M ${cx} ${cy - r} C ${cx + r * 0.18} ${cy - r * 0.18}, ${cx + r * 0.18} ${cy - r * 0.18}, ${cx + r} ${cy} C ${cx + r * 0.18} ${cy + r * 0.18}, ${cx + r * 0.18} ${cy + r * 0.18}, ${cx} ${cy + r} C ${cx - r * 0.18} ${cy + r * 0.18}, ${cx - r * 0.18} ${cy + r * 0.18}, ${cx - r} ${cy} C ${cx - r * 0.18} ${cy - r * 0.18}, ${cx - r * 0.18} ${cy - r * 0.18}, ${cx} ${cy - r} Z" fill="${fill}"/>`;

const SWIRL = (x: number, y: number, s: number, fill: string) =>
  `<path transform="translate(${x} ${y}) scale(${s})" d="M18 2 C8 2 2 9 2 18 C2 26 8 31 15 31 C20 31 24 28 24 23 C24 19 21 16 17 16 C14 16 12 18 12 21" fill="none" stroke="${fill}" stroke-width="3.4" stroke-linecap="round"/>`;

function tile(svgInner: string, size: number, opacity: number) {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='${size}' height='${size}' viewBox='0 0 ${size} ${size}'>${svgInner}</svg>`;
  const uri = `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
  return {
    backgroundImage: uri,
    backgroundRepeat: 'repeat',
    backgroundSize: `${size}px ${size}px`,
    opacity,
  } as const;
}

export function PatternA({
  className = '',
  opacity = 0.28,
}: {
  className?: string;
  opacity?: number;
}) {
  const inner =
    SWIRL(8, 8, 1.1, '#F59075') +
    STAR(70, 26, 6, '#F59075') +
    SWIRL(54, 56, 1.1, '#F59075') +
    STAR(20, 78, 6, '#F59075');
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 ${className}`}
      style={tile(inner, 96, opacity)}
    />
  );
}

export function PatternB({
  className = '',
  opacity = 0.5,
}: {
  className?: string;
  opacity?: number;
}) {
  const inner =
    SWIRL(14, 20, 2.2, '#F59075') +
    SWIRL(150, 20, 2.2, '#F59075') +
    STAR(90, 60, 12, '#203F5C') +
    SWIRL(14, 120, 2.2, '#F59075') +
    SWIRL(150, 120, 2.2, '#F59075');
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 ${className}`}
      style={tile(inner, 200, opacity)}
    />
  );
}
