import Image from 'next/image';
import logo from '@/public/logo.png';

/**
 * Brand wordmark — the real "Sonali Badani." stacked logo (navy with the coral
 * star + period). On navy surfaces we invert it to read white via a CSS filter
 * so the coral accents stay warm but the navy strokes turn light.
 */
export default function Logo({ className = '', height = 44 }: { className?: string; height?: number }) {
  return (
    <Image
      src={logo}
      alt="Sonali Badani"
      height={height}
      width={Math.round((1000 / 470) * height)}
      priority
      className={className}
      style={{ height, width: 'auto' }}
    />
  );
}
