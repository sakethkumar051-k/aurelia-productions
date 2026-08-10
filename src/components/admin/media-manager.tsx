'use client';

import { useRef, useState } from 'react';

import {
  createUploadSignature,
  removeMediaAsset,
  saveMediaAsset,
} from '@/app/admin/actions';
import type { MediaAsset } from '@/content/schema';
import type { MediaSlot } from '@/lib/media-slots';

import styles from './media-manager.module.css';

const MAX_BYTES = 10 * 1024 * 1024;
const ACCEPTED = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];

type CloudinaryResponse = {
  public_id?: string;
  width?: number;
  height?: number;
  error?: { message?: string };
};

function thumbnail(publicId: string, cloudName: string): string {
  return `https://res.cloudinary.com/${cloudName}/image/upload/f_auto,q_auto,w_480,c_fill,ar_3:2/${publicId}`;
}

function SlotCard({
  slot,
  asset,
  cloudName,
  uploadsEnabled,
}: {
  slot: MediaSlot;
  asset?: MediaAsset;
  cloudName: string;
  uploadsEnabled: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [current, setCurrent] = useState<MediaAsset | undefined>(asset);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(-1);

  async function upload(file: File) {
    setError('');

    if (!ACCEPTED.includes(file.type)) {
      setError('Use a JPEG, PNG, WebP or AVIF image.');
      return;
    }

    if (file.size > MAX_BYTES) {
      setError('That file is over 10 MB. Please export a smaller version.');
      return;
    }

    setStatus('Preparing…');
    setProgress(0);

    const signature = await createUploadSignature('aurevia');

    if (!signature.ok) {
      setError(signature.error);
      setStatus('');
      setProgress(-1);
      return;
    }

    const body = new FormData();
    body.append('file', file);
    body.append('api_key', signature.apiKey);
    body.append('timestamp', String(signature.timestamp));
    body.append('folder', signature.folder);
    body.append('signature', signature.signature);

    // XHR rather than fetch — it is the only way to report upload progress.
    const result = await new Promise<CloudinaryResponse | null>((resolve) => {
      const request = new XMLHttpRequest();
      request.open(
        'POST',
        `https://api.cloudinary.com/v1_1/${signature.cloudName}/image/upload`,
      );

      request.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          setProgress(Math.round((event.loaded / event.total) * 100));
        }
      });

      request.addEventListener('load', () => {
        try {
          resolve(JSON.parse(request.responseText) as CloudinaryResponse);
        } catch {
          resolve(null);
        }
      });

      request.addEventListener('error', () => resolve(null));
      request.send(body);
    });

    if (!result?.public_id || !result.width || !result.height) {
      setError(result?.error?.message ?? 'Cloudinary rejected that upload.');
      setStatus('');
      setProgress(-1);
      return;
    }

    setStatus('Saving…');

    const next: MediaAsset = {
      publicId: result.public_id,
      width: result.width,
      height: result.height,
    };

    const saved = await saveMediaAsset(slot.slot, next);

    if (!saved.ok) {
      setError(saved.error);
      setStatus('');
      setProgress(-1);
      return;
    }

    setCurrent(next);
    setStatus('Updated on the site.');
    setProgress(-1);
  }

  async function remove() {
    setError('');
    setStatus('Removing…');

    const result = await removeMediaAsset(slot.slot);

    if (!result.ok) {
      setError(result.error);
      setStatus('');
      return;
    }

    setCurrent(undefined);
    setStatus('Removed — the placeholder is showing again.');
  }

  return (
    <div className={styles.card}>
      <div className={styles.frame}>
        {current && cloudName ? (
          // eslint-disable-next-line @next/next/no-img-element -- admin thumbnail, not page content
          <img
            src={thumbnail(current.publicId, cloudName)}
            alt=""
            width={480}
            height={320}
          />
        ) : (
          <p className={styles.framePlaceholder}>{slot.brief}</p>
        )}
      </div>

      <div className={styles.body}>
        <p className={styles.label}>{slot.label}</p>
        {current && <p className={styles.brief}>{slot.brief}</p>}
        <p className={styles.slotId}>{slot.slot}</p>

        {progress >= 0 && (
          <div className={styles.progress}>
            <div
              className={styles.progressBar}
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        {error ? (
          <p className={`${styles.status} ${styles.statusError}`} role="alert">
            {error}
          </p>
        ) : (
          status && (
            <p className={styles.status} role="status">
              {status}
            </p>
          )
        )}

        <div className={styles.actions}>
          <button
            type="button"
            disabled={!uploadsEnabled || progress >= 0}
            onClick={() => inputRef.current?.click()}
            className={styles.upload}
          >
            {current ? 'Replace' : 'Upload'}
          </button>
          {current && (
            <button
              type="button"
              disabled={progress >= 0}
              onClick={remove}
              className={styles.remove}
            >
              Remove
            </button>
          )}
        </div>

        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED.join(',')}
          className={styles.hiddenInput}
          aria-label={`Upload a photograph for ${slot.label}`}
          onChange={(event) => {
            const file = event.target.files?.[0];
            event.target.value = '';
            if (file) void upload(file);
          }}
        />
      </div>
    </div>
  );
}

export function MediaManager({
  groups,
  media,
  cloudName,
  uploadsEnabled,
}: {
  groups: [string, MediaSlot[]][];
  media: Record<string, MediaAsset>;
  cloudName: string;
  uploadsEnabled: boolean;
}) {
  return (
    <>
      {groups.map(([group, slots]) => (
        <section key={group} className={styles.group}>
          <h2 className={styles.groupTitle}>{group}</h2>
          <div className={styles.grid}>
            {slots.map((slot) => (
              <SlotCard
                key={slot.slot}
                slot={slot}
                asset={media[slot.slot]}
                cloudName={cloudName}
                uploadsEnabled={uploadsEnabled}
              />
            ))}
          </div>
        </section>
      ))}
    </>
  );
}
