# Aurevia website handover

Live site: https://aurelia-productions.vercel.app/

Editor: https://aurelia-productions.vercel.app/admin/login

The public website can render its original content without external services. Editing requires Firebase Authentication and Firestore; photo uploads also require Cloudinary. These are deployment settings, so source code alone cannot create an editor account or connect the live deployment.

## One-time production setup

1. In Firebase, enable **Authentication → Email/Password** and create the editor's user. Create a Firestore database in the same project. Deploy `firestore.rules` from this repository; browsers must not have direct read/write access.
2. In Firebase project settings, create a service account and a web app. Copy their values into the **Production** environment of the Vercel project. Use `.env.example` as the exact variable checklist. For `FIREBASE_PRIVATE_KEY`, preserve the `\n` escapes and include the full BEGIN/END lines. Set `ADMIN_EMAILS` to the editor's email address; separate multiple addresses with commas. Never commit secrets or send them in chat.
3. In Cloudinary, copy the cloud name, API key and API secret into the matching Vercel variables. Set `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` to the same cloud name as `CLOUDINARY_CLOUD_NAME`.
4. Set `NEXT_PUBLIC_SITE_URL=https://aurelia-productions.vercel.app` unless a custom domain is in use. Redeploy **after** changing environment variables: public variables are bundled at build time.
5. Open `/admin/login`, sign in with the Firebase user, edit a short headline, save, and confirm the public page reflects it. Upload a photo in `/admin/media` and confirm it appears in its frame. Sign out and confirm `/admin` redirects to login.

If the live `/admin/login` shows an error, check the Vercel function logs and the server Firebase variables first. The app now handles a malformed service account by showing a setup message, so a newly deployed build should no longer return a blank 500 solely because the key is invalid.

## Editor's daily workflow

- **Dashboard:** choose the page or site-wide section to edit. Navigation labels and logo wording are under **Header** and **Brand**. Service copy is under **The five pillars**; the section labels shared by service pages have their own card.
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

The shipped phone, email, WhatsApp, Instagram, address and map are placeholders until confirmed. Replace the contact values through **Contact details**. The map is a designed placeholder in the code and requires a map integration to become interactive. Email delivery for enquiries has not been connected; the Firestore inbox is the durable record.
