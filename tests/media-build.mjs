import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

// Exercise a real Server Component rendering an uploaded image. The ordinary
// build can miss this branch when local Cloudinary settings or saved media are absent.
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const fixture = mkdtempSync(join(root, 'src/app/media-build-check-'));
let exitCode = 1;
try {
  writeFileSync(join(fixture, 'page.tsx'), `
import { Photo } from '@/components/photo';
export default function MediaBuildCheck() {
  return <div style={{ position: 'relative', height: 300 }}>
    <Photo slot="media-build-check" alt="Uploaded image build regression"
      asset={{ publicId: 'sample', width: 1200, height: 800,
        crop: { x: 100, y: 50, width: 600, height: 400 } }} />
  </div>;
}
`);
  const result = spawnSync(process.execPath, ['node_modules/next/dist/bin/next', 'build', '--webpack'], {
    cwd: root,
    env: { ...process.env, NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: 'demo' },
    stdio: 'inherit',
  });
  if (result.error) console.error(result.error.message);
  exitCode = result.status ?? 1;
} finally {
  rmSync(fixture, { recursive: true, force: true });
}
process.exitCode = exitCode;
