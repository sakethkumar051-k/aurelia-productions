'use client';

import { useEffect, useRef, useState } from 'react';
import Cropper, { type Area } from 'react-easy-crop';
import type { MediaAsset } from '@/content/schema';
import styles from './image-cropper.module.css';

type Crop = NonNullable<MediaAsset['crop']>;

export function ImageCropper({ src, label, initialCrop, preserveFullImage = false, busy, error, onCancel, onSave }: {
  src: string;
  label: string;
  initialCrop?: Crop;
  preserveFullImage?: boolean;
  busy: boolean;
  error: string;
  onCancel: () => void;
  onSave: (crop?: Crop) => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [aspect, setAspect] = useState(initialCrop ? initialCrop.width / initialCrop.height : 3 / 2);
  const [pixels, setPixels] = useState<Area>();
  const [loaded, setLoaded] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [original, setOriginal] = useState(preserveFullImage && !initialCrop);
  const dimensions = useRef({ width: 0, height: 0 });

  useEffect(() => {
    const element = dialog.current;
    const trigger = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    element?.showModal();
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      element?.close();
      document.body.style.overflow = previous;
      trigger?.focus();
    };
  }, []);

  function save() {
    if (original) return onSave();
    if (!pixels) return;
    const x = Math.max(0, Math.round(pixels.x));
    const y = Math.max(0, Math.round(pixels.y));
    onSave({ x, y,
      width: Math.min(Math.round(pixels.width), dimensions.current.width - x),
      height: Math.min(Math.round(pixels.height), dimensions.current.height - y),
    });
  }

  return (
    <dialog ref={dialog} className={styles.dialog} aria-labelledby="crop-heading"
      onCancel={(event) => { event.preventDefault(); if (!busy) onCancel(); }}>
      <div className={styles.header}>
        <div><p className={styles.eyebrow}>Image studio</p><h2 id="crop-heading">Crop {label}</h2></div>
        <button type="button" aria-label="Close crop editor" disabled={busy} onClick={onCancel} className={styles.close}>×</button>
      </div>
      <p className={styles.hint}>Drag the image or use the arrow keys to frame it. Zoom to get closer. Your original stays intact.</p>
      <div className={styles.canvas}>
        <Cropper image={src} crop={position} zoom={zoom} aspect={aspect} maxZoom={4}
          initialCroppedAreaPixels={initialCrop} onCropChange={setPosition} onZoomChange={(value) => { if (!original) setZoom(value); }} zoomWithScroll={!original}
          onCropComplete={(_, area) => setPixels(area)}
          onMediaLoaded={(media) => { dimensions.current = { width: media.naturalWidth, height: media.naturalHeight }; if (original) setAspect(media.naturalWidth / media.naturalHeight); setLoaded(true); }}
          mediaProps={{ onError: () => setLoadError('This image could not be opened. Try replacing it with another photo.') }}
          keyboardStep={10} />
      </div>
      <div className={styles.controls}>
        <label>Shape<select value={original ? 'original' : String(aspect)} disabled={busy}
          onChange={(event) => { const isOriginal = event.target.value === 'original'; setOriginal(isOriginal); setZoom(1); setPosition({ x: 0, y: 0 }); setAspect(isOriginal ? dimensions.current.width / dimensions.current.height || 1 : Number(event.target.value)); }}>
          {initialCrop && ![1, 3 / 2, 4 / 3, 16 / 9, 3 / 4].includes(initialCrop.width / initialCrop.height) && <option value={initialCrop.width / initialCrop.height}>Saved shape</option>}
          <option value="1.5">Landscape · 3:2</option><option value={4 / 3}>Classic · 4:3</option>
          <option value={16 / 9}>Wide · 16:9</option><option value="1">Square · 1:1</option>
          <option value="0.75">Portrait · 3:4</option><option value="original">Full original</option>
        </select></label>
        <label>Zoom · {zoom.toFixed(1)}×<input aria-label="Crop zoom" type="range" min="1" max="4" step="0.05" value={zoom} disabled={busy || original} onChange={(event) => setZoom(Number(event.target.value))} /></label>
      </div>
      {(error || loadError) && <p role="alert" className={styles.error}>{error || loadError}</p>}
      <div className={styles.actions}>
        <button type="button" disabled={busy} onClick={onCancel}>Cancel</button>
        <button type="button" className={styles.save} disabled={busy || !loaded || Boolean(loadError) || (!original && !pixels)} onClick={save}>{busy ? 'Saving…' : original ? 'Use full image' : 'Save crop'}</button>
      </div>
    </dialog>
  );
}
