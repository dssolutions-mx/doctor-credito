import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
const SENDGRID_API_KEY = Deno.env.get("SENDGRID_API_KEY")
const EMAIL_FROM = Deno.env.get("EMAIL_FROM") || "notificaciones@doctordelcredito.com"
const EMAIL_FROM_NAME = Deno.env.get("EMAIL_FROM_NAME") || "Doctor del Crédito CRM"
const FRONTEND_URL = Deno.env.get("FRONTEND_URL") || "https://doctor-credito.vercel.app"

function baseTemplate(title: string, body: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#f4f4f5;">
  <div style="max-width:600px;margin:24px auto;padding:24px;background:#fff;border-radius:12px;box-shadow:0 1px 3px rgba(0,0,0,0.08);">
    <h2 style="margin:0 0 16px;font-size:18px;color:#18181b;">${title}</h2>
    <div style="color:#3f3f46;line-height:1.6;font-size:14px;">
      ${body}
    </div>
    <p style="margin:24px 0 0;font-size:12px;color:#71717a;">Doctor del Crédito CRM</p>
  </div>
</body>
</html>
`.trim()
}

function appointmentTypeLabel(t?: string | null): string {
  if (t === "test_drive") return "Prueba de manejo"
  if (t === "credit_approval") return "Aprobación de crédito"
  if (t === "delivery") return "Entrega"
  return t || "Cita"
}

serve(async (req) => {
  try {
    if (req.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "POST, OPTIONS" } })
    }
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405 })
    }

    const body = await req.json()
    const {
      agent_user_id,
      appointment,
      lead_name,
    } = body as {
      agent_user_id: string
      appointment: { id: string; scheduled_at: string; appointment_type?: string | null }
      lead_name?: string | null
    }

    if (!agent_user_id || !appointment?.id) {
      return new Response(JSON.stringify({ error: "Missing agent_user_id or appointment" }), { status: 400, headers: { "Content-Type": "application/json" } })
    }

    if (!SENDGRID_API_KEY) {
      console.warn("[send-appointment-created] SENDGRID_API_KEY not set")
      return new Response(JSON.stringify({ success: true, skipped: "no_sendgrid" }), { headers: { "Content-Type": "application/json" } })
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

    const { data: profile } = await supabase
      .from("profiles")
      .select("email, metadata")
      .eq("id", agent_user_id)
      .single()

    if (!profile?.email) {
      return new Response(JSON.stringify({ success: true, skipped: "no_email" }), { headers: { "Content-Type": "application/json" } })
    }

    const prefs = (profile.metadata as { notification_preferences?: Record<string, boolean> })?.notification_preferences
    const immediateOk = prefs?.immediateEmailAlerts !== false
    const apptOk = prefs?.appointmentReminders !== false
    if (!immediateOk || !apptOk) {
      return new Response(JSON.stringify({ success: true, skipped: "preferences" }), { headers: { "Content-Type": "application/json" } })
    }

    const leadName = lead_name || "Lead"
    const type = appointmentTypeLabel(appointment.appointment_type)
    const date = new Date(appointment.scheduled_at)
    const dateStr = date.toLocaleString("es", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
    const subject = `Cita programada: ${leadName} - ${type} ${dateStr}`
    const link = `${FRONTEND_URL.replace(/\/+$/, "")}/appointments`

    const htmlBody = baseTemplate(
      "Cita programada",
      `
    <p>Se ha programado una cita para <strong>${leadName}</strong>.</p>
    <ul style="margin:8px 0;padding-left:20px;">
      <li>Tipo: ${type}</li>
      <li>Fecha y hora: ${dateStr}</li>
    </ul>
    <p><a href="${link}" style="color:#2563eb;text-decoration:none;">Ver citas en el CRM</a></p>
  `
    )

    const res = await fetch("https://api.sendgrid.com/v3/mail/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${SENDGRID_API_KEY}`,
      },
      body: JSON.stringify({
        personalizations: [{ to: [{ email: profile.email }], tracking_settings: { click_tracking: { enable: false }, open_tracking: { enable: false } } }],
        from: { email: EMAIL_FROM, name: EMAIL_FROM_NAME },
        subject,
        content: [{ type: "text/html", value: htmlBody }],
      }),
    })

    if (!res.ok) {
      const err = await res.text()
      console.error("[send-appointment-created] SendGrid error:", err)
      return new Response(JSON.stringify({ error: `SendGrid ${res.status}` }), { status: 500, headers: { "Content-Type": "application/json" } })
    }

    return new Response(JSON.stringify({ success: true }), { headers: { "Content-Type": "application/json" } })
  } catch (e) {
    console.error("[send-appointment-created] Error:", e)
    return new Response(JSON.stringify({ error: "Internal error" }), { status: 500, headers: { "Content-Type": "application/json" } })
  }
})
