import 'server-only';

import { v2 as cloudinary } from 'cloudinary';

export type UploadSignature =
  | {
      ok: true;
      cloudName: string;
      apiKey: string;
      timestamp: number;
      folder: string;
      signature: string;
    }
  | { ok: false; error: string };

function config() {
  const cloudName =
    process.env.CLOUDINARY_CLOUD_NAME ??
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) return null;

  return { cloudName, apiKey, apiSecret };
}

export function isCloudinaryServerConfigured(): boolean {
  return config() !== null;
}

/**
 * Produces a one-shot signature for a direct browser upload.
 *
 * Only `timestamp` and `folder` are signed, so a leaked signature cannot be
 * replayed to overwrite an arbitrary asset — and it expires within the hour.
 */
export function signUploadParams(folder: string): UploadSignature {
  const settings = config();

  if (!settings) {
    return {
      ok: false,
      error: 'Cloudinary is not configured. Add the CLOUDINARY_* variables.',
    };
  }

  const timestamp = Math.round(Date.now() / 1000);
  const safeFolder = folder.replace(/[^a-zA-Z0-9/_-]/g, '') || 'aurevia';

  const signature = cloudinary.utils.api_sign_request(
    { timestamp, folder: safeFolder },
    settings.apiSecret,
  );

  return {
    ok: true,
    cloudName: settings.cloudName,
    apiKey: settings.apiKey,
    timestamp,
    folder: safeFolder,
    signature,
  };
}
