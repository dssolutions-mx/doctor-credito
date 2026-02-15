import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
const SENDGRID_API_KEY = Deno.env.get("SENDGRID_API_KEY")
const CRON_SECRET = Deno.env.get("CRON_SECRET")
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
    const authHeader = req.headers.get("authorization")
    const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null
    if (CRON_SECRET && token !== CRON_SECRET) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { "Content-Type": "application/json" } })
    }

    if (!SENDGRID_API_KEY) {
      return new Response(JSON.stringify({ ok: true, sent: 0, message: "SENDGRID_API_KEY not set" }), { headers: { "Content-Type": "application/json" } })
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
    const now = new Date()
    const windowStart = new Date(now.getTime() + 55 * 60 * 1000)
    const windowEnd = new Date(now.getTime() + 70 * 60 * 1000)

    const { data: appointments, error } = await supabase
      .from("appointments")
      .select(`
        id,
        scheduled_at,
        appointment_type,
        lead:leads(id, name, assigned_to)
      `)
      .gte("scheduled_at", windowStart.toISOString())
      .lte("scheduled_at", windowEnd.toISOString())
      .or("reminder_sent.is.null,reminder_sent.eq.false")

    if (error) {
      console.error("[process-appointment-reminders] query error:", error)
      return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { "Content-Type": "application/json" } })
    }

    let sent = 0
    for (const apt of appointments || []) {
      const lead = Array.isArray(apt.lead) ? apt.lead[0] : apt.lead
      const assignedTo = lead?.assigned_to
      if (!assignedTo) continue

      const { data: profile } = await supabase
        .from("profiles")
        .select("email, metadata")
        .eq("id", assignedTo)
        .single()

      if (!profile?.email) continue

      const prefs = (profile.metadata as { notification_preferences?: Record<string, boolean> })?.notification_preferences
      const immediateOk = prefs?.immediateEmailAlerts !== false
      const apptOk = prefs?.appointmentReminders !== false
      if (!immediateOk || !apptOk) continue

      const leadName = lead?.name || "Lead"
      const type = appointmentTypeLabel(apt.appointment_type)
      const date = new Date(apt.scheduled_at)
      const timeStr = date.toLocaleTimeString("es", { hour: "2-digit", minute: "2-digit" })
      const subject = `Cita en 1 hora: ${leadName} - ${type} ${timeStr}`
      const link = `${FRONTEND_URL.replace(/\/+$/, "")}/appointments`

      const htmlBody = baseTemplate(
        "Cita en 1 hora",
        `
    <p><strong>Recordatorio:</strong> Tienes una cita en aproximadamente 1 hora.</p>
    <ul style="margin:8px 0;padding-left:20px;">
      <li>Cliente: ${leadName}</li>
      <li>Tipo: ${type}</li>
      <li>Hora: ${timeStr}</li>
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

      if (res.ok) {
        await supabase
          .from("appointments")
          .update({ reminder_sent: true, reminder_sent_at: new Date().toISOString() })
          .eq("id", apt.id)
        sent++
      } else {
        console.error(`[process-appointment-reminders] SendGrid failed for appt ${apt.id}:`, await res.text())
      }
    }

    return new Response(JSON.stringify({ ok: true, sent, total: (appointments || []).length }), { headers: { "Content-Type": "application/json" } })
  } catch (e) {
    console.error("[process-appointment-reminders] Error:", e)
    return new Response(JSON.stringify({ error: "Internal error" }), { status: 500, headers: { "Content-Type": "application/json" } })
  }
})
