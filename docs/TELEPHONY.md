# Phase 3 — Click-to-call telephony

Employees enter their personal phone once (SMS verify). Artemis rings that phone, then bridges the prospect. Prospects see the **company** caller ID.

## 1. Apply SQL

Paste `supabase/apply_phase3_telephony.sql` in the Supabase SQL Editor (or `supabase db push`).

## 2. Twilio account

1. Create a [Twilio](https://www.twilio.com) account
2. Buy a phone number (or verify a Caller ID)
3. Put keys in `.env` / host env (never commit):

```
TWILIO_ACCOUNT_SID=ACxxxx
TWILIO_AUTH_TOKEN=xxxx
TWILIO_PHONE_NUMBER=+357xxxxxxxx
APP_URL=https://www.project-artemis.ai
```

Optional: `TWILIO_VERIFY_SERVICE_SID` for Twilio Verify instead of custom SMS OTP.

## 3. Company setup (owner/admin)

1. Open **/ceo/telephony**
2. Enter the company caller ID (Twilio number)
3. Save & enable

## 4. Employee setup (every hire)

1. **/app/settings** or dialer banner → enter personal mobile
2. SMS code → confirm
3. Dial from **/app/dialer**

## 5. Webhooks

Twilio must reach your public app:

- `POST /api/twilio/voice` — connect prospect after agent answers
- `POST /api/twilio/status` — call status
- `POST /api/twilio/recording` — download recording → Storage → AI pipeline

`APP_URL` must match the URL Twilio calls (production domain).

## Flow

```
Employee taps Call
  → Twilio rings employee phone (handset)
  → Employee answers
  → TwiML dials prospect with company caller ID
  → Recording callback stores audio + runs analysis
```
