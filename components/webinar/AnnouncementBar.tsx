import { ANNOUNCEMENT } from '@/lib/webinar-content';

/**
 * Sticky top strip on navy. Three short guarantees, separated by middots, in
 * the spec's letter-spaced uppercase. Static markup, so it costs nothing and
 * ships in the server payload.
 */
export default function AnnouncementBar() {
  return (
    <div className="sticky top-0 z-40 border-b border-white/10 bg-navy text-white">
      <div className="container-page flex h-9 items-center justify-center gap-2 sm:gap-3">
        {ANNOUNCEMENT.map((item, i) => (
          <span key={item} className="flex items-center gap-2 sm:gap-3">
            {i > 0 && (
              <span aria-hidden="true" className="text-coral/60">
                ·
              </span>
            )}
            <span className="whitespace-nowrap font-body text-[9.5px] font-bold uppercase tracking-[0.14em] text-white/90 sm:text-[11px] sm:tracking-[0.18em]">
              {item}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
