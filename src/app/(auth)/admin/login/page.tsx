import type { Metadata } from 'next';

import { LoginForm } from '@/components/admin/login-form';

import styles from '@/app/admin/admin.module.css';

export const metadata: Metadata = {
  title: 'Admin sign in',
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  // Keep this route independent of the authenticated admin layout and the
  // Firebase Admin SDK. It must render even when production keys are missing.
  const configured = Boolean(
    process.env.FIREBASE_PROJECT_ID &&
    process.env.FIREBASE_CLIENT_EMAIL &&
    process.env.FIREBASE_PRIVATE_KEY &&
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN &&
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID &&
    process.env.ADMIN_EMAILS?.trim(),
  );

  return (
    <div className={styles.login}>
      <div className={styles.loginCard}>
        <h1 className={styles.loginTitle}>Aurevia admin</h1>
        <p className={styles.loginIntro}>
          Sign in to edit the site&rsquo;s words and photographs.
        </p>

        {configured ? (
          <LoginForm />
        ) : (
          <div className={`${styles.notice} ${styles.noticeWarn}`}>
            Admin sign-in is not fully configured on this deployment. Add the
            Firebase server and browser settings and the editor email allowlist,
            then redeploy.
          </div>
        )}
      </div>
    </div>
  );
}
