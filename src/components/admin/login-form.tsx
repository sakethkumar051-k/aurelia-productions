'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, type FormEvent } from 'react';

import { clientAuth } from '@/lib/firebase/client';

import adminStyles from '@/app/admin/admin.module.css';
import styles from './content-editor.module.css';

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError('');

    const data = new FormData(event.currentTarget);
    const email = String(data.get('email') ?? '').trim();
    const password = String(data.get('password') ?? '');

    const auth = clientAuth();

    if (!auth) {
      setError('Firebase is not configured in this browser build.');
      setBusy(false);
      return;
    }

    try {
      const { signInWithEmailAndPassword } = await import('firebase/auth');
      const credential = await signInWithEmailAndPassword(auth, email, password);
      const idToken = await credential.user.getIdToken();

      const response = await fetch('/api/admin/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
      });

      const result = (await response.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
      };

      if (!response.ok || !result.ok) {
        setError(result.error ?? 'Could not sign in. Please try again.');
        setBusy(false);
        return;
      }

      // Firebase's own session is no longer needed — the cookie is the record.
      await auth.signOut();

      // Only same-origin paths are safe here; anything else is an open redirect.
      const next = params.get('next') ?? '';
      router.replace(next.startsWith('/') && !next.startsWith('//') ? next : '/admin');
      router.refresh();
    } catch (caught) {
      const code =
        caught && typeof caught === 'object' && 'code' in caught
          ? String((caught as { code: unknown }).code)
          : '';

      setError(
        code.includes('invalid-credential') ||
          code.includes('wrong-password') ||
          code.includes('user-not-found')
          ? 'That email and password do not match an account.'
          : code.includes('too-many-requests')
            ? 'Too many attempts. Wait a few minutes and try again.'
            : 'Could not sign in. Please try again.',
      );
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className={adminStyles.loginForm}>
      {error && (
        <p role="alert" className={`${adminStyles.notice} ${adminStyles.noticeWarn}`}>
          {error}
        </p>
      )}

      <div className={styles.field}>
        <label htmlFor="email" className={styles.label}>
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="username"
          className={styles.input}
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="password" className={styles.label}>
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className={styles.input}
        />
      </div>

      <button type="submit" disabled={busy} className={styles.save}>
        {busy ? 'Signing in…' : 'Sign in'}
      </button>
    </form>
  );
}
