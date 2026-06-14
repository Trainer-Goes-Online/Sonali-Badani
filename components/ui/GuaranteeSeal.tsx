import { ShieldCheck } from 'lucide-react';

/**
 * "The Full Reset Guarantee" seal. A simple coral-and-navy badge reused near
 * CTAs and in the guarantee section.
 */
export default function GuaranteeSeal({ className = '' }: { className?: string }) {
  return (
    <div
      className={`inline-flex items-center gap-3 rounded-full border-2 border-coral/50 bg-white px-5 py-2.5 ${className}`}
    >
      <ShieldCheck className="h-6 w-6 shrink-0 text-coral-dark" />
      <span className="text-left font-body text-[13px] font-bold uppercase leading-tight tracking-[0.12em] text-navy">
        The Full Reset
        <br />
        Guarantee
      </span>
    </div>
  );
}
