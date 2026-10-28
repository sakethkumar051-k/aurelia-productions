# Aurevia website handover

Live site: https://aurelia-productions.vercel.app/

Editor sign-in: https://aurelia-productions.vercel.app/admin/login

Visual editor: https://aurelia-productions.vercel.app/studio (sign-in required)

The public website can render its original content without external services. Editing requires Firebase Authentication and Firestore; photo uploads also require Cloudinary. These are deployment settings, so source code alone cannot create an editor account or connect the live deployment.

## One-time production setup

1. In Firebase, enable **Authentication → Email/Password** and create the editor's user. Create a Firestore database in the same project. Deploy `firestore.rules` from this repository; browsers must not have direct read/write access.
2. In Firebase project settings, create a service account and a web app. Copy their values into the **Production** environment of the Vercel project. Use `.env.example` as the exact variable checklist. For `FIREBASE_PRIVATE_KEY`, preserve the `\n` escapes and include the full BEGIN/END lines. Set `ADMIN_EMAILS` to the editor's email address; separate multiple addresses with commas. Never commit secrets or send them in chat.
3. In Cloudinary, copy the cloud name, API key and API secret into the matching Vercel variables. Set `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` to the same cloud name as `CLOUDINARY_CLOUD_NAME`.
4. Set `NEXT_PUBLIC_SITE_URL=https://aurelia-productions.vercel.app` until the custom domain is connected. Redeploy **after** changing environment variables: public variables are bundled at build time.
5. Open `/admin/login`, sign in with the Firebase user, edit a short headline in `/studio`, save, and confirm the public page reflects it. Upload a photo in `/admin/media` and confirm it appears in its frame. Sign out and confirm `/studio` redirects to login.
6. Submit one test enquiry from `/contact` and confirm that it appears in `/admin/enquiries`. A success message is only shown after Firestore stores it. There are no email notifications, so the client must check the admin inbox regularly.

If the live `/admin/login` shows an error, check the Vercel function logs and the server Firebase variables first. The app now handles a malformed service account by showing a setup message, so a newly deployed build should no longer return a blank 500 solely because the key is invalid.

## Image cropping and logo updates

Open **Photos & logo** in `/admin/media`. The Brand group contains the logo used in both the header and footer. Upload a transparent PNG or WebP where possible; logos default to the full image so lettering is not clipped. The home hero also accepts an optional signature image.

All image uploads open a crop preview before publishing. Drag or use the arrow keys to frame an image, choose a shape and adjust zoom, then save. **Crop** reopens an existing upload using its original pixels. **Full original** clears the saved crop; originals are never overwritten. Cancelling leaves the published image unchanged. The same controls are available when selecting an image in `/studio`.

## Editor's daily workflow

- **Visual editor:** `/studio` displays the actual public website inside an editor frame. Choose a page, click visible text or a photograph, edit it, and save. Use **Browse** mode to follow links without selecting elements. This is the quickest way to make ordinary page edits.
- **Section forms:** `/admin` opens the visual editor. The sidebar's section links provide the full field forms for site-wide settings, contact links, lists, and less-visible copy. Navigation labels and logo wording are under **Header** and **Brand**. Service copy is under **The five pillars**.
- **Text:** change a field, then press **Save changes**. The status bar confirms when it is published. **Load original** fills the form with shipped copy but does not publish until saved. **Reset section** removes all saved changes for that section after confirmation.
- **Photos:** open **Photographs**, find the frame by page and label, and upload a JPEG, PNG, WebP or AVIF under 10 MB. **Replace** changes one frame; **Remove** restores its placeholder or bundled image. The photo key stays fixed when a portfolio title or service name changes.
- **Lists:** add, remove and reorder testimonials, FAQ answers, portfolio tiles and other lists in their sections. New image-bearing entries receive a permanent photo key; their frames then appear in Photographs.
- **Preview:** the section's **View live page** link opens the public page. Refresh it after saving to see the new content.
- **Enquiries:** submissions are archived in `/admin/enquiries` when Firestore is configured. The current app does not send email notifications; check the inbox in the admin area.

Editors should leave the read-only photo keys and service URL keys alone. Headings accept `*word*` for the gold italic emphasis. Some button templates use `{tier}` or `{name}`; keep those placeholders where the current label needs a dynamic value.

## Ownership and maintenance

- Store the Vercel, Firebase and Cloudinary account ownership with the site owner. Keep at least two authorized Firebase editor accounts; remove departing editors from **both** Firebase Authentication and `ADMIN_EMAILS`.
- The published source of truth is the Git repository. Firestore holds current text overrides, and Cloudinary holds uploaded images. Preserve access to all three when handing over the site.
- Before a large campaign edit, export/backup Firestore `content/*` documents and keep the Cloudinary account active. Removing a photo link from the website does not delete the Cloudinary original.
- Deployment changes and environment changes need a new build. Normal text and photo edits do not.

## Known content to confirm with the owner

The business email is theaureviaproductions@gmail.com. Phone, WhatsApp, Instagram and studio address are blank until the administrator adds them. The client will replace them through **Contact details** before sharing the public site. Check the phone link and WhatsApp link as well as the displayed number. The map is a designed placeholder in the code and requires a map integration to become interactive. Email delivery for enquiries has not been connected; the Firestore inbox is the durable record.

## Custom domain cutover (once purchased)

1. Add the exact domain in the Vercel project's **Settings → Domains**. Follow the DNS records Vercel shows for the apex domain and any `www` alias; choose one as primary and redirect the other to it. Do not change DNS blindly—use the values shown for this Vercel project.
2. When Vercel reports the domain verified and HTTPS active, set the **Production** `NEXT_PUBLIC_SITE_URL` to `https://your-domain.example` (no trailing slash) and redeploy. The canonical links, social metadata and sitemap then use the new domain.
3. In Firebase Authentication, add the new domain under **Settings → Authorized domains**. Then test editor sign-in at `https://your-domain.example/admin/login`.
4. Open the public pages, `robots.txt` and `sitemap.xml` on the new domain. Submit and verify a test enquiry, test one admin text save and one photograph upload, and check mobile layout. Keep the Vercel URL working as a fallback.

## Security and account handoff

The Firebase service-account private key was previously shared in chat. Treat that key as exposed: create a replacement key, update `FIREBASE_PRIVATE_KEY` in Vercel Production, redeploy and verify admin sign-in and enquiry storage, then delete the old key in Firebase/Google Cloud. Never paste the replacement key into chat or commit it. The client should receive account access through their own Vercel, Firebase and Cloudinary users, not a shared password or key file.
