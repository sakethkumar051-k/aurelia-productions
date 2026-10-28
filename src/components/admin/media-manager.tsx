'use client';

import { useEffect, useRef, useState } from 'react';
import { createUploadSignature, removeMediaAsset, saveMediaAsset } from '@/app/admin/actions';
import { ImageCropper } from '@/components/admin/image-cropper';
import type { MediaAsset } from '@/content/schema';
import { assetSource } from '@/lib/cloudinary';
import type { MediaSlot } from '@/lib/media-slots';
import styles from './media-manager.module.css';

const MAX_BYTES = 10 * 1024 * 1024;
const ACCEPTED = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
type Crop = NonNullable<MediaAsset['crop']>;
type Pending = { src: string; file?: File; asset?: MediaAsset };
type CloudinaryResponse = { public_id?: string; width?: number; height?: number; error?: { message?: string } };

function preview(asset: MediaAsset, cloudName: string) {
  return `https://res.cloudinary.com/${cloudName}/image/upload/${assetSource(asset).startsWith('c_crop,') ? assetSource(asset).slice(0, assetSource(asset).indexOf('/') + 1) : ''}f_auto,q_auto,w_480,c_limit/${asset.publicId}`;
}

export function SlotCard({ slot, asset, bundled, cloudName, uploadsEnabled, onSaved }: {
  slot: MediaSlot; asset?: MediaAsset; bundled?: string; cloudName: string;
  uploadsEnabled: boolean; onSaved?: (asset?: MediaAsset) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [current, setCurrent] = useState(asset);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(-1);
  const [busy, setBusy] = useState(false);
  const [pending, setPending] = useState<Pending>();
  const isLogo = slot.slot === 'brand-logo';

  useEffect(() => () => {
    if (pending?.src.startsWith('blob:')) URL.revokeObjectURL(pending.src);
  }, [pending]);

  function select(file: File) {
    setError(''); setStatus('');
    if (!ACCEPTED.includes(file.type)) return setError('Use a JPEG, PNG, WebP or AVIF image.');
    if (file.size === 0) return setError('That image is empty. Choose another file.');
    if (file.size > MAX_BYTES) return setError('That file is over 10 MB. Please export a smaller version.');
    setPending({ src: URL.createObjectURL(file), file });
  }

  async function upload(file: File): Promise<MediaAsset> {
    const signature = await createUploadSignature('aurevia');
    if (!signature.ok) throw new Error(signature.error);
    const body = new FormData();
    body.append('file', file); body.append('api_key', signature.apiKey);
    body.append('timestamp', String(signature.timestamp)); body.append('folder', signature.folder);
    body.append('signature', signature.signature);
    const result = await new Promise<CloudinaryResponse>((resolve, reject) => {
      const request = new XMLHttpRequest();
      request.open('POST', `https://api.cloudinary.com/v1_1/${signature.cloudName}/image/upload`);
      request.timeout = 120000;
      request.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) setProgress(Math.round(event.loaded / event.total * 100));
      });
      request.addEventListener('load', () => {
        try {
          const response = JSON.parse(request.responseText) as CloudinaryResponse;
          if (request.status < 200 || request.status >= 300) reject(new Error(response.error?.message || 'The upload failed. Please retry.'));
          else resolve(response);
        } catch { reject(new Error('The upload returned an invalid response. Please retry.')); }
      });
      request.addEventListener('error', () => reject(new Error('The connection failed. Please retry.')));
      request.addEventListener('timeout', () => reject(new Error('The upload timed out. Please retry.')));
      request.addEventListener('abort', () => reject(new Error('The upload was interrupted. Please retry.')));
      request.send(body);
    });
    if (!result.public_id || !result.width || !result.height) throw new Error('The image could not be processed. Try another file.');
    return { publicId: result.public_id, width: result.width, height: result.height };
  }

  async function saveCrop(crop?: Crop) {
    if (!pending || busy) return;
    setBusy(true); setError(''); setStatus('Saving image…'); setProgress(0);
    try {
      let original = pending.asset;
      if (!original) {
        let file = pending.file;
        if (!file) {
          const response = await fetch(pending.src);
          if (!response.ok) throw new Error('The original photo could not be loaded.');
          const blob = await response.blob();
          file = new File([blob], 'original.webp', { type: blob.type });
        }
        original = await upload(file);
        // Preserve the successful upload on retry if only the content save fails.
        setPending((value) => value ? { ...value, asset: original } : value);
      }
      const next: MediaAsset = { publicId: original.publicId, width: original.width, height: original.height,
        ...(original.alt ? { alt: original.alt } : {}), ...(crop ? { crop } : {}) };
      const result = await saveMediaAsset(slot.slot, next);
      if (!result.ok) throw new Error(result.error);
      setCurrent(next); setPending(undefined); setStatus('Updated on the site.'); onSaved?.(next);
    } catch (reason) { setError(reason instanceof Error ? reason.message : 'Could not save this image. Please retry.'); setStatus(''); }
    finally { setBusy(false); setProgress(-1); }
  }

  async function remove() {
    setError(''); setBusy(true); setStatus('Removing…');
    try {
      const result = await removeMediaAsset(slot.slot);
      if (!result.ok) throw new Error(result.error);
      setCurrent(undefined); onSaved?.();
      setStatus(isLogo ? 'Removed — the original Aurevia logo is showing again.' : bundled ? 'Removed — the original photo is showing again.' : 'Removed — the placeholder is showing again.');
    } catch (reason) { setError(reason instanceof Error ? reason.message : 'Could not remove this image.'); setStatus(''); }
    finally { setBusy(false); }
  }

  return (
    <div className={styles.card} aria-busy={busy}>
      <div className={styles.frame} data-logo={isLogo}>
        {(current && cloudName) || bundled ? (
          // eslint-disable-next-line @next/next/no-img-element -- admin thumbnail
          <img src={current && cloudName ? preview(current, cloudName) : bundled} alt={slot.label} width={480} height={320} />
        ) : <p className={styles.framePlaceholder}>{slot.brief}</p>}
      </div>
      <div className={styles.body}>
        <p className={styles.label}>{slot.label}</p><p className={styles.brief}>{slot.brief}</p>
        {!current && bundled && <p className={styles.status}>Original website photo</p>}
        {progress >= 0 && <div className={styles.progress} role="progressbar" aria-label="Image upload" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress}><div className={styles.progressBar} style={{ width: `${progress}%` }} /></div>}
        {error ? <p className={`${styles.status} ${styles.statusError}`} role="alert">{error}</p> : status && <p className={styles.status} role="status">{status}</p>}
        <div className={styles.actions}>
          <button type="button" disabled={!uploadsEnabled || busy} onClick={() => inputRef.current?.click()} className={styles.upload}>{current || bundled ? 'Replace' : isLogo ? 'Upload logo' : 'Upload photo'}</button>
          {((current && cloudName) || bundled) && <button type="button" disabled={!uploadsEnabled || busy} className={styles.remove} onClick={() => {
            setError(''); setStatus('');
            setPending(current && cloudName ? { src: `https://res.cloudinary.com/${cloudName}/image/upload/${current.publicId}`, asset: current } : { src: bundled! });
          }}>Crop</button>}
          {current && <button type="button" disabled={busy} onClick={remove} className={styles.remove}>Remove</button>}
        </div>
        <input ref={inputRef} type="file" accept={ACCEPTED.join(',')} className={styles.hiddenInput} aria-label={`Upload ${slot.label}`} onChange={(event) => {
          const file = event.target.files?.[0]; event.target.value = ''; if (file) select(file);
        }} />
      </div>
      {pending && <ImageCropper key={pending.src} src={pending.src} label={slot.label} initialCrop={pending.asset?.crop} preserveFullImage={isLogo} busy={busy} error={error} onCancel={() => { setPending(undefined); setError(''); }} onSave={(crop) => void saveCrop(crop)} />}
    </div>
  );
}

export function MediaManager({ groups, media, bundled, cloudName, uploadsEnabled }: {
  groups: [string, MediaSlot[]][]; media: Record<string, MediaAsset>; bundled: Record<string, string>;
  cloudName: string; uploadsEnabled: boolean;
}) {
  return <>{groups.map(([group, slots]) => <section key={group} className={styles.group}>
    <h2 className={styles.groupTitle}>{group}</h2><div className={styles.grid}>{slots.map((slot) => <SlotCard key={slot.slot} slot={slot} asset={media[slot.slot]} bundled={bundled[slot.slot]} cloudName={cloudName} uploadsEnabled={uploadsEnabled} />)}</div>
  </section>)}</>;
}
