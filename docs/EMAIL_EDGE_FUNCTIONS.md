# Email Notifications via Supabase Edge Functions

Email sending follows the same pattern as maintenance-dashboard and cotizador-dc: **Supabase Edge Functions** handle templates and SendGrid, invoked by Next.js (immediate) or pg_cron (scheduled).

## Edge Functions

| Function | Trigger | Purpose |
|----------|---------|---------|
| `send-new-lead-alert` | POST from Next.js after lead create | New lead email to assigned agent |
| `send-appointment-created` | POST from Next.js after appointment create | "Cita programada" email |
| `process-appointment-reminders` | pg_cron every 5 min | 1-hour-before reminders |
| `process-daily-digest` | pg_cron daily 12:00 UTC | Morning digest (tasks, appointments, stale leads) |

## Supabase Secrets (required)

In **Supabase Dashboard → Project Settings → Edge Functions → Secrets**, add:

- `SENDGRID_API_KEY` – SendGrid API key
- `EMAIL_FROM` – Sender address (default: notificaciones@doctordelcredito.com)
- `EMAIL_FROM_NAME` – Sender name (default: Doctor del Crédito CRM)
- `FRONTEND_URL` – App URL for links (e.g. https://doctor-credito.vercel.app)
- `CRON_SECRET` – Shared secret for pg_cron auth (same value as in `cron_config.cron_secret`)

## pg_cron Config

The `cron_config` table stores:

- `edge_appointment_reminders_url` – process-appointment-reminders URL
- `edge_daily_digest_url` – process-daily-digest URL  
- `cron_secret` – Bearer token for cron requests

After deploy, set `cron_secret`:

```sql
UPDATE cron_config SET value = 'your-secret-here' WHERE key = 'cron_secret';
```

## Local Development

For local Edge Function testing:

```bash
supabase functions serve send-new-lead-alert --env-file .env.local
```

Ensure `.env.local` has the same keys as Supabase secrets.
