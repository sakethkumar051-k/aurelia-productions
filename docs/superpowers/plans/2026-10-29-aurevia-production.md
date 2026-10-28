# Aurevia production update

Goal: consistent Aurevia branding, editable crops for all photo slots, reusable logo upload, and a purposeful home hero.

Use the existing Next.js, Firebase and Cloudinary architecture. Keep originals and persist validated pixel crop rectangles; apply crops before CDN resizing. Use a shared accessible crop dialog in the media manager, which also powers the visual studio. Uploads open a crop preview; existing images can be cropped again. Brand logo uses contain sizing in header and footer. Replace decorative hero circles with a framed signature image and clear text calls to action.

- Validate crop geometry with regression tests, including out-of-bounds and legacy uncropped assets.
- Add the shared crop dialog and handle cancelled, invalid and failed uploads without changing the live image.
- Add logo and hero slots and wire every consumer to saved crops.
- Check TypeScript, production build, lint and browser rendering.
- Inspect the Aurevia Chrome account, Vercel ownership and GoDaddy domain. Connect only verified project-specific DNS settings. Report any login, account-creation or ownership barrier precisely.
