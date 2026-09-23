import { redirect } from 'next/navigation';

import { LoginForm } from '@/components/admin/login-form';
import { currentAdmin } from '@/lib/auth';
import { isFirebaseConfigured } from '@/lib/firebase/admin';

import styles from '../admin.module.css';

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string | string[] }>;
}) {
  const admin = await currentAdmin();
  if (admin) redirect('/admin');

  const { next } = await searchParams;

  const configured = isFirebaseConfigured() && Boolean(
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
          <LoginForm nextPath={typeof next === 'string' ? next : undefined} />
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
