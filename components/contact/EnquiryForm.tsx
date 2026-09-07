'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { occasions } from '@/lib/content/occasions';
import { waEnquiry } from '@/lib/whatsapp';
import { cn } from '@/lib/utils';

const field =
  'w-full rounded-md border border-blush-200 bg-cream-100 px-4 py-3 text-[0.9375rem] text-ink placeholder:text-ink-faint transition-colors focus:border-rose-400 focus:outline-none';

const BUDGETS = ['Under Rs 4,000', 'Rs 4,000 – 8,000', 'Rs 8,000 – 15,000', 'Above Rs 15,000', 'Not sure yet'];

export function EnquiryForm() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [occasion, setOccasion] = useState('');
  const [budget, setBudget] = useState('');
  const [date, setDate] = useState('');
  const [details, setDetails] = useState('');
  const [touched, setTouched] = useState(false);

  const valid = name.trim().length > 1;
  const href = waEnquiry({ name, phone, occasion, budget, date, details });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setTouched(true);
        if (valid) window.open(href, '_blank', 'noopener,noreferrer');
      }}
      className="rounded-[1.75rem] border border-blush-200 bg-cream p-6 shadow-petal sm:p-8"
    >
      <p className="text-label uppercase text-rose-600">Tell us what you&apos;re imagining</p>
      <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink-muted">
        Fill in what you know — even a rough idea is enough to start. This opens WhatsApp with your
        answers already written out.
      </p>

      <div className="mt-7 grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="c-name" className="text-label uppercase text-ink-faint">
            Your name <span className="text-rose-500">*</span>
          </label>
          <input
            id="c-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={() => setTouched(true)}
            required
            aria-invalid={touched && !valid}
            aria-describedby={touched && !valid ? 'c-name-err' : undefined}
            placeholder="e.g. Sara"
            className={cn(field, 'mt-3', touched && !valid && 'border-rose-500')}
          />
          {touched && !valid ? (
            <p id="c-name-err" className="mt-2 text-[0.8125rem] text-rose-600">
              We just need something to call you.
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="c-phone" className="text-label uppercase text-ink-faint">
            Phone (optional)
          </label>
          <input
            id="c-phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="03xx xxxxxxx"
            className={cn(field, 'mt-3')}
          />
        </div>

        <div>
          <label htmlFor="c-occ" className="text-label uppercase text-ink-faint">
            Occasion
          </label>
          <select
            id="c-occ"
            value={occasion}
            onChange={(e) => setOccasion(e.target.value)}
            className={cn(field, 'mt-3 appearance-none')}
          >
            <option value="">Choose one…</option>
            {occasions.map((o) => (
              <option key={o.slug} value={o.name}>
                {o.name}
              </option>
            ))}
            <option value="Something else">Something else</option>
          </select>
        </div>

        <div>
          <label htmlFor="c-budget" className="text-label uppercase text-ink-faint">
            Budget
          </label>
          <select
            id="c-budget"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            className={cn(field, 'mt-3 appearance-none')}
          >
            <option value="">Choose one…</option>
            {BUDGETS.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="c-date" className="text-label uppercase text-ink-faint">
            Needed by
          </label>
          <input
            id="c-date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className={cn(field, 'mt-3')}
          />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="c-details" className="text-label uppercase text-ink-faint">
            Who is it for, and what do they love?
          </label>
          <textarea
            id="c-details"
            rows={4}
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            placeholder="My sister turns 30 — she's obsessed with candles, hates anything floral, and drinks far too much coffee…"
            className={cn(field, 'mt-3 resize-none leading-relaxed')}
          />
        </div>
      </div>

      <div className="mt-7 flex flex-wrap items-center gap-4">
        <Button type="submit" variant="wa" size="lg" magnetic>
          Send on WhatsApp
        </Button>
        <p className="text-[0.8125rem] text-ink-faint">Nothing is stored on this site.</p>
      </div>
    </form>
  );
}
