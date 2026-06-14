'use client';

import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Quote } from 'lucide-react';
import { carouselSpring } from '@/lib/motion';

type Item = { quote: string; by: string };

/**
 * Mobile testimonials carousel. Replaces the old infinite auto-marquee (which
 * scrolled past too fast to read) with a swipeable, snap-to-card track: one
 * quote at a time, drag or tap a dot to move, equal-height cards. Reduced-motion
 * users get instant snaps. Desktop keeps the static grid in Testimonials.tsx.
 */
export default function TestimonialsCarousel({ items }: { items: Item[] }) {
  const [index, setIndex] = useState(0);
  const reduce = useReducedMotion();
  const count = items.length;
  const clamp = (i: number) => Math.max(0, Math.min(count - 1, i));

  return (
    <div className="mt-10 sm:hidden">
      <div className="overflow-hidden">
        <motion.ul
          className="flex items-stretch"
          animate={{ x: `-${index * 100}%` }}
          transition={reduce ? { duration: 0 } : carouselSpring}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.14}
          onDragEnd={(_, info) => {
            const swipe = info.offset.x;
            const flick = info.velocity.x;
            if (swipe < -50 || flick < -400) setIndex((i) => clamp(i + 1));
            else if (swipe > 50 || flick > 400) setIndex((i) => clamp(i - 1));
          }}
        >
          {items.map((t, i) => (
            <li key={i} className="w-full shrink-0 px-1">
              <figure className="flex h-full select-none flex-col items-center rounded-2xl border border-navy/10 bg-white p-6 text-center shadow-soft">
                <Quote className="h-7 w-7 text-coral" aria-hidden="true" />
                <blockquote className="mt-4 grow font-body text-[15px] leading-relaxed text-navy/85">
                  {t.quote}
                </blockquote>
                <figcaption className="mt-5 font-body text-[13px] font-semibold uppercase tracking-[0.1em] text-navy/55">
                  {t.by}
                </figcaption>
              </figure>
            </li>
          ))}
        </motion.ul>
      </div>

      {/* Dots */}
      <div className="mt-5 flex items-center justify-center gap-2">
        {items.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Show testimonial ${i + 1} of ${count}`}
            aria-current={i === index}
            onClick={() => setIndex(i)}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === index ? 'w-6 bg-coral' : 'w-2 bg-navy/20 hover:bg-navy/35'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
