import test from 'node:test';
import assert from 'node:assert/strict';
import { mediaAssetSchema } from '../src/content/schema.ts';
import { assetUrl } from '../src/lib/cloudinary.ts';

const original = { publicId: 'aurevia/wedding', width: 1200, height: 800 };
test('saved crop survives validation and applies before CDN resizing', () => {
  const asset = mediaAssetSchema.parse({ ...original, crop: { x: 100, y: 50, width: 600, height: 400 } });
  assert.deepEqual(asset.crop, { x: 100, y: 50, width: 600, height: 400 });
  assert.match(assetUrl(asset, 900), /\/c_crop,x_100,y_50,w_600,h_400\/f_auto,q_auto,w_900,c_limit\/aurevia\/wedding$/);
});
test('old images without cropping keep working', () => {
  assert.deepEqual(mediaAssetSchema.parse(original), original);
  assert.match(assetUrl(original, 500), /\/f_auto,q_auto,w_500,c_limit\/aurevia\/wedding$/);
});
for (const [label, crop] of [
  ['outside the image', { x: 1100, y: 0, width: 200, height: 400 }],
  ['negative coordinates', { x: -1, y: 0, width: 200, height: 400 }],
  ['empty crop', { x: 0, y: 0, width: 0, height: 400 }],
  ['fractional pixels', { x: 0.5, y: 0, width: 200, height: 400 }],
]) test(`rejects ${label}`, () => {
  assert.equal(mediaAssetSchema.safeParse({ ...original, crop }).success, false);
});
test('rejects unusable original dimensions', () => {
  assert.equal(mediaAssetSchema.safeParse({ ...original, width: 0 }).success, false);
});
