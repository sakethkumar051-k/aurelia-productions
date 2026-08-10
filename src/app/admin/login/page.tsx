import { redirect } from 'next/navigation';

import { LoginForm } from '@/components/admin/login-form';
import { currentAdmin } from '@/lib/auth';
import { isFirebaseConfigured } from '@/lib/firebase/admin';

import styles from '../admin.module.css';

export default async function AdminLoginPage() {
  const admin = await currentAdmin();
  if (admin) redirect('/admin');

  const configured = isFirebaseConfigured();

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
            Firebase is not configured on this server yet, so sign-in is
            unavailable. Add the Firebase environment variables and restart.
          </div>
        )}
      </div>
    </div>
  );
}
