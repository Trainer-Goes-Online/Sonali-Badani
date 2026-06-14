'use client';

import { useEffect, useRef, useState, type ElementType, type ReactNode } from 'react';

type Variant = 'up' | 'left' | 'right' | 'scale' | 'blur';

/**
 * Scroll-reveal driven by a single IntersectionObserver + CSS transitions
 * (see .reveal in globals.css). `variant` picks the entrance direction/effect.
 * No animation library, so JS stays tiny and Lighthouse stays high.
 */
export default function Reveal({
  children,
  as: Tag = 'div',
  delay = 0,
  variant = 'up',
  className = '',
}: {
  children: ReactNode;
  as?: ElementType;
  delay?: number;
  variant?: Variant;
  className?: string;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry], obs) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const variantClass = variant === 'up' ? '' : `reveal--${variant}`;

  return (
    <Tag
      ref={ref}
      className={`reveal ${variantClass} ${visible ? 'is-visible' : ''} ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}
