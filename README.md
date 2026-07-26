# AkEsevai Customer Portal

A responsive digital service centre website for AkEsevai, Palani. The customer-first flow includes:

- Public home, services, about and contact pages
- Customer portal login UI
- Free OTP verification test flow
- Application creation and status tracking
- Document vault with upload interaction
- Appointment date and time booking
- Responsive mobile navigation

## Project structure

```text
src/
	assets/       Logo, banner and printable media location
	components/   Shared UI component ownership
	config/       AkEsevai business configuration
	data/         Public navigation and service data
	pages/        Public page ownership map and page modules
	styles/       Single CSS entry point
	App.jsx       Application shell and route state
	main.jsx      React entry point
```

Public page navigation is defined in `src/data/pageManifest.js`. Business details are kept in `src/config/siteConfig.js`, so the address and phone number do not need to be searched through the UI code.

## Run locally

```bash
npm.cmd install
npm.cmd run dev
```

Open `http://localhost:5173/`.

## Production build

```bash
npm.cmd run build
npm.cmd run preview
```

The deployable output is generated in `dist/`.

## Deploy

### Vercel

1. Import this folder into Vercel.
2. Framework preset: `Vite`.
3. Build command: `npm run build`.
4. Output directory: `dist`.

### Netlify

1. Connect the repository or upload the project.
2. Build command: `npm run build`.
3. Publish directory: `dist`.

## Production integration notes

### OTP authentication

The portal currently includes a free test OTP gate. Enter any 10-digit mobile number, choose `Send OTP`, then enter `123456`. This verifies the complete customer flow without sending an SMS or requiring a paid provider. For production SMS authentication, connect the `OtpGate` send/verify handlers to Firebase Phone Auth, Twilio Verify, MSG91 or Supabase Auth and keep all provider credentials in server-side environment variables.

The current portal is a polished frontend prototype. The login, applications, document upload and appointment actions use in-browser React state so the full flow can be tested immediately. For live customer data, connect:

- OTP authentication service for the customer login
- Database/API for customers, applications and application status
- Private object storage for documents with signed upload URLs
- Appointment availability API and admin calendar
- SMS/WhatsApp notifications for status changes

Business details configured in the site:

- **Name:** AkEsevai
- **Address:** Mill Road, Sanmugapuram, Palani - 624601
- **Phone:** 96008 71898
- **Working hours:** Monday - Saturday, 9:00 AM - 7:00 PM
