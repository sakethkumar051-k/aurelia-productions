'use client';

import { useRef, useState, type FormEvent } from 'react';

import type { Content } from '@/content/schema';

import styles from './enquiry-form.module.css';

type Status = 'idle' | 'submitting' | 'error' | 'sent';
type FieldErrors = Partial<Record<'name' | 'phone' | 'type', string>>;

const PHONE_PATTERN = /^[\d+\-\s()]{7,20}$/;

type EnquiryFormProps = {
  copy: Content['contactPage'];
  fallbackPhone: string;
};

export function EnquiryForm({ copy, fallbackPhone }: EnquiryFormProps) {
  const [status, setStatus] = useState<Status>('idle');
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState('');
  const formRef = useRef<HTMLFormElement>(null);

  const { form, thanks } = copy;

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const data = new FormData(event.currentTarget);
    const payload = {
      name: String(data.get('name') ?? '').trim(),
      phone: String(data.get('phone') ?? '').trim(),
      type: String(data.get('type') ?? ''),
      date: String(data.get('date') ?? ''),
      city: String(data.get('city') ?? '').trim(),
      budget: String(data.get('budget') ?? ''),
      message: String(data.get('message') ?? '').trim(),
      company: String(data.get('company') ?? ''),
    };

    const nextErrors: FieldErrors = {};
    if (!payload.name) nextErrors.name = 'Please tell us your name.';
    if (!PHONE_PATTERN.test(payload.phone)) {
      nextErrors.phone = 'Please give a phone or WhatsApp number we can reach.';
    }
    if (!payload.type) nextErrors.type = 'Please choose an event type.';

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setStatus('error');
      setFormError('');
      const firstInvalid = formRef.current?.querySelector<HTMLElement>(
        '[aria-invalid="true"]',
      );
      firstInvalid?.focus();
      return;
    }

    setStatus('submitting');
    setFormError('');

    try {
      const response = await fetch('/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = (await response.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
        errors?: FieldErrors;
      };

      if (!response.ok || !result.ok) {
        setErrors(result.errors ?? {});
        setFormError(
          result.error ??
            'We could not send that just now. Please try again, or WhatsApp us directly.',
        );
        setStatus('error');
        return;
      }

      setStatus('sent');
    } catch {
      setFormError(
        `Network trouble on our side. Please try again or WhatsApp ${fallbackPhone}.`,
      );
      setStatus('error');
    }
  }

  if (status === 'sent') {
    return (
      <div
        role="status"
        ref={(node) =>
          node?.scrollIntoView({ block: 'center', behavior: 'smooth' })
        }
        className={styles.thanks}
      >
        <p className={styles.thanksScript}>{thanks.script}</p>
        <h2 className={styles.thanksTitle}>{thanks.title}</h2>
        <p className={styles.thanksBody}>{thanks.body}</p>
        <button
          type="button"
          onClick={() => {
            setStatus('idle');
            setErrors({});
            setFormError('');
          }}
          className={`btn btnXs ${styles.reset}`}
        >
          {thanks.cta}
        </button>
      </div>
    );
  }

  return (
    <>
      <h2 data-reveal="y" className={styles.title}>
        {form.title}
      </h2>
      <p data-reveal="y" className={styles.intro}>
        {form.intro}
      </p>

      {formError && (
        <p role="alert" className={styles.formError}>
          {formError}
        </p>
      )}

      <form ref={formRef} noValidate onSubmit={onSubmit} className={styles.form}>
        <div className={styles.field}>
          <label htmlFor="f-name" className={styles.label}>
            {form.labels.name}
          </label>
          <input
            id="f-name"
            name="name"
            type="text"
            autoComplete="name"
            placeholder={form.placeholders.name}
            aria-invalid={errors.name ? 'true' : undefined}
            aria-describedby={errors.name ? 'f-name-error' : undefined}
            className={styles.input}
          />
          {errors.name && (
            <p id="f-name-error" className={styles.fieldError}>
              {errors.name}
            </p>
          )}
        </div>

        <div className={styles.field}>
          <label htmlFor="f-phone" className={styles.label}>
            {form.labels.phone}
          </label>
          <input
            id="f-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            placeholder={form.placeholders.phone}
            aria-invalid={errors.phone ? 'true' : undefined}
            aria-describedby={errors.phone ? 'f-phone-error' : undefined}
            className={styles.input}
          />
          {errors.phone && (
            <p id="f-phone-error" className={styles.fieldError}>
              {errors.phone}
            </p>
          )}
        </div>

        <div className={styles.field}>
          <label htmlFor="f-type" className={styles.label}>
            {form.labels.type}
          </label>
          <select
            id="f-type"
            name="type"
            defaultValue=""
            aria-invalid={errors.type ? 'true' : undefined}
            aria-describedby={errors.type ? 'f-type-error' : undefined}
            className={styles.input}
          >
            <option value="" disabled>
              {form.placeholders.select}
            </option>
            {form.eventTypes.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          {errors.type && (
            <p id="f-type-error" className={styles.fieldError}>
              {errors.type}
            </p>
          )}
        </div>

        <div className={styles.field}>
          <label htmlFor="f-date" className={styles.label}>
            {form.labels.date}
          </label>
          <input id="f-date" name="date" type="date" className={styles.input} />
        </div>

        <div className={styles.field}>
          <label htmlFor="f-city" className={styles.label}>
            {form.labels.city}
          </label>
          <input
            id="f-city"
            name="city"
            type="text"
            autoComplete="address-level2"
            placeholder={form.placeholders.city}
            className={styles.input}
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="f-budget" className={styles.label}>
            {form.labels.budget}
          </label>
          <select
            id="f-budget"
            name="budget"
            defaultValue=""
            className={styles.input}
          >
            <option value="">{form.placeholders.budget}</option>
            {form.budgets.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div className={`${styles.field} ${styles.fieldWide}`}>
          <label htmlFor="f-msg" className={styles.label}>
            {form.labels.message}
          </label>
          <textarea
            id="f-msg"
            name="message"
            rows={5}
            placeholder={form.placeholders.message}
            className={`${styles.input} ${styles.textarea}`}
          />
        </div>

        {/* Honeypot — hidden from people, irresistible to bots. */}
        <div aria-hidden="true" className={styles.honeypot}>
          <label htmlFor="f-company">Company</label>
          <input id="f-company" name="company" type="text" tabIndex={-1} autoComplete="off" />
        </div>

        <button
          type="submit"
          disabled={status === 'submitting'}
          className={`btn btnLg btnMaroon ${styles.submit}`}
        >
          {status === 'submitting' ? form.submitting : form.submit}
        </button>
      </form>
    </>
  );
}
