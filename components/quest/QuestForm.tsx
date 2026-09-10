import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { QUEST, QUEST_KINDS, QUEST_CITY_OPTIONS } from '../../content/quest';
import type { Bilingual } from '../../content/builders-tour';
import type { Locale } from '../../lib/i18n';

const L = {
  contact: { es: 'Quién eres', en: 'Who you are' },
  firstName: { es: 'Nombre', en: 'First name' },
  lastName: { es: 'Apellido', en: 'Last name' },
  email: { es: 'Correo', en: 'Email' },
  phone: { es: 'Celular (con indicativo)', en: 'Phone (with country code)' },
  role: { es: 'Tu cargo', en: 'Your role' },

  business: { es: 'Tu empresa', en: 'Your business' },
  company: { es: 'Nombre de la empresa', en: 'Company name' },
  website: { es: 'Sitio web', en: 'Website' },
  optional: { es: 'opcional', en: 'optional' },

  mission: { es: 'La misión', en: 'The mission' },
  city: { es: '¿En cuál ciudad?', en: 'Which city?' },
  kind: { es: '¿Qué quieres delegar?', en: 'What are you delegating?' },
  brief: { es: 'Cuéntanos la misión', en: 'Tell us the mission' },
  briefHelp: {
    es: 'Sé tan específico como puedas: qué necesitas, para qué te sirve, y qué contaría como haberlo logrado.',
    en: 'Be as specific as you can: what you need, what it is for, and what would count as done.',
  },

  value: { es: 'El valor', en: 'The value' },
  valueQ: {
    es: 'El valor de referencia por misión es 1.000 USD. ¿Te sirve ese valor?',
    en: 'The reference value per mission is 1,000 USD. Does that work for you?',
  },
  valueYes: { es: 'Sí, 1.000 USD me sirve', en: 'Yes, 1,000 USD works' },
  valueNo: { es: 'Quiero proponer otro valor', en: 'I want to propose another value' },
  valueOwn: { es: 'Tu valor propuesto (USD)', en: 'Your proposed value (USD)' },

  submit: { es: 'Enviar propuesta', en: 'Send proposal' },
  sending: { es: 'Enviando…', en: 'Sending…' },
  doneTitle: { es: 'Recibido', en: 'Received' },
  doneBody: {
    es: 'Gracias. Te escribimos al correo que dejaste, normalmente en menos de una semana.',
    en: 'Thank you. We will write to the email you left, usually within a week.',
  },
  failed: {
    es: 'No se pudo enviar. Escríbenos a hola@ethcali.org y lo resolvemos por ahí.',
    en: 'That did not send. Write to hola@ethcali.org and we will sort it out there.',
  },
  unconfigured: {
    es: 'El formulario no está disponible ahora mismo. Escríbenos a hola@ethcali.org.',
    en: 'The form is unavailable right now. Write to hola@ethcali.org.',
  },
  required: { es: 'Falta por llenar', en: 'Still needed' },
} satisfies Record<string, Bilingual>;

const field =
  'w-full rounded-control border border-line-hairline bg-surface-inset px-3.5 py-2.5 text-sm text-content-primary placeholder-content-faint focus:border-eth-blue focus:outline-none';

function Label({ children, hint }: { children: React.ReactNode; hint?: string }) {
  return (
    <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-content-faint">
      {children}
      {hint && <span className="ml-1.5 normal-case tracking-normal opacity-70">({hint})</span>}
    </span>
  );
}

export default function QuestForm({ locale }: { locale: Locale }) {
  const t = (b: Bilingual) => b[locale];

  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [acceptsValue, setAcceptsValue] = useState(true);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    // The anon key can only INSERT here — it cannot read this table back — so
    // there is no client-side path to anyone else's submission.
    if (!supabase) {
      setError(t(L.unconfigured));
      return;
    }

    const f = new FormData(e.currentTarget);
    const str = (k: string) => String(f.get(k) ?? '').trim() || null;

    setSending(true);
    try {
      const { error: dbError } = await supabase.from('quest_requests').insert({
        first_name: str('first_name'),
        last_name: str('last_name'),
        email: str('email'),
        phone: str('phone'),
        role: str('role'),
        company: str('company'),
        website: str('website'),
        instagram: str('instagram'),
        linkedin: str('linkedin'),
        x_handle: str('x_handle'),
        city: str('city'),
        kind: str('kind'),
        brief: str('brief'),
        value_accepted: acceptsValue,
        value_proposed_usd: acceptsValue ? null : Number(f.get('value_proposed_usd')) || null,
      });

      if (dbError) throw new Error(dbError.message);
      setDone(true);
    } catch {
      // The real message is a Postgres error; it helps nobody reading this page
      // and a failed proposal should still reach us, so it names another route.
      setError(t(L.failed));
    } finally {
      // Always clears, including on failure — otherwise a rejected submit locks
      // the button and the proposal can never be sent.
      setSending(false);
    }
  }

  if (done) {
    return (
      <div className="rounded-card border border-signal-confirmed/40 bg-signal-confirmed/[0.07] p-8">
        <h3 className="text-xl font-bold text-signal-confirmed">{t(L.doneTitle)}</h3>
        <p className="mt-2 max-w-prose text-base text-content-secondary">{t(L.doneBody)}</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="rounded-card border border-line-hairline bg-surface-slab p-6 sm:p-8">
      {/* ── contact ─────────────────────────────────────────────────────── */}
      <h3 className="text-xs font-bold uppercase tracking-widest text-eth-blue-text">
        {t(L.contact)}
      </h3>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label>
          <Label>{t(L.firstName)}</Label>
          <input name="first_name" required className={field} autoComplete="given-name" />
        </label>
        <label>
          <Label>{t(L.lastName)}</Label>
          <input name="last_name" required className={field} autoComplete="family-name" />
        </label>
        <label>
          <Label>{t(L.email)}</Label>
          <input name="email" type="email" required className={field} autoComplete="email" />
        </label>
        <label>
          <Label>{t(L.phone)}</Label>
          <input
            name="phone"
            required
            className={field}
            autoComplete="tel"
            placeholder="+57 300 000 0000"
          />
        </label>
        <label className="sm:col-span-2">
          <Label hint={t(L.optional)}>{t(L.role)}</Label>
          <input name="role" className={field} autoComplete="organization-title" />
        </label>
      </div>

      {/* ── business ────────────────────────────────────────────────────── */}
      <h3 className="mt-9 text-xs font-bold uppercase tracking-widest text-eth-blue-text">
        {t(L.business)}
      </h3>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label>
          <Label>{t(L.company)}</Label>
          <input name="company" required className={field} autoComplete="organization" />
        </label>
        <label>
          <Label hint={t(L.optional)}>{t(L.website)}</Label>
          <input name="website" className={field} placeholder="https://" inputMode="url" />
        </label>
        <label>
          <Label hint={t(L.optional)}>Instagram</Label>
          <input name="instagram" className={field} placeholder="@" />
        </label>
        <label>
          <Label hint={t(L.optional)}>LinkedIn</Label>
          <input name="linkedin" className={field} />
        </label>
        <label className="sm:col-span-2">
          <Label hint={t(L.optional)}>X</Label>
          <input name="x_handle" className={field} placeholder="@" />
        </label>
      </div>

      {/* ── mission ─────────────────────────────────────────────────────── */}
      <h3 className="mt-9 text-xs font-bold uppercase tracking-widest text-eth-blue-text">
        {t(L.mission)}
      </h3>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label>
          <Label>{t(L.city)}</Label>
          <select name="city" required defaultValue="" className={field}>
            <option value="" disabled>
              —
            </option>
            {QUEST_CITY_OPTIONS.map((c) => (
              <option key={c.id} value={c.id}>
                {t(c.label)}
              </option>
            ))}
          </select>
        </label>
        <label>
          <Label>{t(L.kind)}</Label>
          <select name="kind" required defaultValue="" className={field}>
            <option value="" disabled>
              —
            </option>
            {QUEST_KINDS.map((k) => (
              <option key={k.id} value={k.id}>
                {t(k.label)}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="mt-4 block">
        <Label>{t(L.brief)}</Label>
        <textarea
          name="brief"
          required
          minLength={40}
          rows={7}
          className={`${field} leading-relaxed`}
        />
        <span className="mt-1.5 block text-[11px] leading-relaxed text-content-faint">
          {t(L.briefHelp)}
        </span>
      </label>

      {/* ── value ───────────────────────────────────────────────────────── */}
      <h3 className="mt-9 text-xs font-bold uppercase tracking-widest text-eth-blue-text">
        {t(L.value)}
      </h3>
      <p className="mt-3 max-w-prose text-sm text-content-secondary">{t(L.valueQ)}</p>

      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        {[
          [true, t(L.valueYes)],
          [false, t(L.valueNo)],
        ].map(([val, label]) => (
          <button
            key={String(val)}
            type="button"
            onClick={() => setAcceptsValue(val as boolean)}
            aria-pressed={acceptsValue === val}
            className={`min-h-tap flex-1 rounded-control border px-4 text-sm font-semibold transition-colors ${
              acceptsValue === val
                ? 'border-eth-blue bg-eth-blue-wash text-content-primary'
                : 'border-line-hairline text-content-muted hover:text-content-primary'
            }`}
          >
            {label as string}
          </button>
        ))}
      </div>

      {!acceptsValue && (
        <label className="mt-4 block sm:max-w-xs">
          <Label>{t(L.valueOwn)}</Label>
          <input
            name="value_proposed_usd"
            type="number"
            min={0}
            step={50}
            required
            className={field}
            placeholder={String(QUEST.postedValueUsd)}
          />
        </label>
      )}

      {error && (
        <p className="mt-6 rounded-control border border-signal-reverted/40 bg-signal-reverted/10 px-4 py-3 text-sm text-signal-reverted">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={sending}
        className="mt-8 inline-flex min-h-tap w-full items-center justify-center rounded-control bg-eth-blue px-6 text-sm font-bold text-on-brand transition-colors hover:bg-eth-blue-lift disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
      >
        {sending ? t(L.sending) : `${t(L.submit)} →`}
      </button>
    </form>
  );
}
