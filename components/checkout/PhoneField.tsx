'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronDown, Check, Search } from 'lucide-react';
import { getCountries, getCountryCallingCode, AsYouType, type CountryCode } from 'libphonenumber-js';
import flags from 'react-phone-number-input/flags';

const REGION_NAMES =
  typeof Intl !== 'undefined' && 'DisplayNames' in Intl
    ? new Intl.DisplayNames(['en'], { type: 'region' })
    : null;

type Item = { code: CountryCode; name: string; calling: string };

/**
 * Custom international phone field: a flag + dial-code button, a divider, then
 * the national number. The country picker is a searchable popup (flag, name,
 * dial code, coral check on the selected one). Emits an E.164 string upward.
 */
export default function PhoneField({
  onChange,
  onParts,
  error,
  defaultCountry = 'IN' as CountryCode,
}: {
  onChange?: (e164: string | undefined) => void;
  /** Emits the dial code and national number separately (e.g. "+91" and "90..."). */
  onParts?: (parts: { country: CountryCode; dialCode: string; national: string; e164?: string }) => void;
  error?: boolean;
  defaultCountry?: CountryCode;
}) {
  const items: Item[] = useMemo(() => {
    const list = getCountries().map((code) => ({
      code,
      name: REGION_NAMES?.of(code) || code,
      calling: getCountryCallingCode(code),
    }));
    list.sort((a, b) => a.name.localeCompare(b.name));
    const i = list.findIndex((c) => c.code === defaultCountry);
    if (i > 0) list.unshift(list.splice(i, 1)[0]);
    return list;
  }, [defaultCountry]);

  const [country, setCountry] = useState<CountryCode>(defaultCountry);
  const [national, setNational] = useState('');
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const searchRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);
  useEffect(() => {
    if (open) searchRef.current?.focus();
  }, [open]);

  const emit = (c: CountryCode, n: string) => {
    const digits = n.replace(/\D/g, '');
    const dialCode = `+${getCountryCallingCode(c)}`;
    const e164 = digits ? `${dialCode}${digits}` : undefined;
    onChange?.(e164);
    onParts?.({ country: c, dialCode, national: digits, e164 });
  };

  const onNational = (raw: string) => {
    setNational(new AsYouType(country).input(raw));
    emit(country, raw);
  };
  const selectCountry = (c: CountryCode) => {
    setCountry(c);
    setOpen(false);
    setSearch('');
    emit(c, national);
  };

  const filtered = items.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      `+${c.calling}`.includes(search) ||
      c.code.toLowerCase().includes(search.toLowerCase())
  );

  const Flag = flags[country];
  const flagBox = 'block h-[15px] w-[22px] shrink-0 overflow-hidden rounded-[2px] [&_svg]:h-full [&_svg]:w-full';

  return (
    <div ref={wrapRef} className="relative">
      <div
        className={`flex items-stretch rounded-xl border bg-white transition-colors ${
          error ? 'border-coral focus-within:border-coral-dark' : 'border-navy/15 focus-within:border-navy'
        }`}
      >
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-label="Select country code"
          className="flex items-center gap-1.5 rounded-l-xl px-3.5 py-3 transition-colors hover:bg-navy/[0.03]"
        >
          <span className={flagBox}>{Flag ? <Flag title={country} /> : null}</span>
          <span className="font-body text-[15px] font-medium text-navy">
            +{getCountryCallingCode(country)}
          </span>
          <ChevronDown className={`h-4 w-4 text-navy/50 transition-transform ${open ? 'rotate-180' : ''}`} />
        </button>
        <span className="my-2.5 w-px bg-navy/15" />
        <input
          type="tel"
          inputMode="tel"
          value={national}
          onChange={(e) => onNational(e.target.value)}
          placeholder="98765 43210"
          autoComplete="tel-national"
          className="w-full rounded-r-xl bg-transparent px-3.5 py-3 font-body text-[15px] text-navy outline-none placeholder:text-navy/40"
        />
      </div>

      {open && (
        <div className="absolute left-0 z-30 mt-2 w-full min-w-[250px] overflow-hidden rounded-xl border border-navy/12 bg-white shadow-card">
          <div className="flex items-center gap-2 border-b border-navy/10 px-3 py-2.5">
            <Search className="h-4 w-4 shrink-0 text-navy/40" />
            <input
              ref={searchRef}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="w-full bg-transparent font-body text-[14px] text-navy outline-none placeholder:text-navy/40"
            />
          </div>
          <ul className="max-h-64 overflow-y-auto py-1">
            {filtered.map((c) => {
              const F = flags[c.code];
              const sel = c.code === country;
              return (
                <li key={c.code}>
                  <button
                    type="button"
                    onClick={() => selectCountry(c.code)}
                    className={`flex w-full items-center gap-3 px-3 py-2 text-left transition-colors hover:bg-coral/[0.08] ${
                      sel ? 'text-coral-dark' : 'text-navy'
                    }`}
                  >
                    <span className={flagBox}>{F ? <F title={c.name} /> : null}</span>
                    <span className="flex-1 font-body text-[14px] leading-snug">
                      {c.name} <span className="text-navy/50">(+{c.calling})</span>
                    </span>
                    {sel && <Check className="h-4 w-4 shrink-0 text-coral-dark" />}
                  </button>
                </li>
              );
            })}
            {filtered.length === 0 && (
              <li className="px-3 py-4 text-center font-body text-[13px] text-navy/50">No match</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
