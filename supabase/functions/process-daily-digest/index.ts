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
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    const yesterdayStart = new Date(today)
    yesterdayStart.setDate(yesterdayStart.getDate() - 1)
    const staleThreshold = new Date()
    staleThreshold.setHours(staleThreshold.getHours() - 48)

    const { data: profiles, error: profilesError } = await supabase
      .from("profiles")
      .select("id, email, metadata")

    if (profilesError || !profiles?.length) {
      return new Response(JSON.stringify({ ok: true, sent: 0, message: "No profiles" }), { headers: { "Content-Type": "application/json" } })
    }

    let sent = 0
    for (const profile of profiles) {
      if (!profile.email) continue

      const prefs = (profile as { metadata?: { notification_preferences?: Record<string, boolean> } }).metadata?.notification_preferences
      if (prefs?.emailNotifications !== true) continue

      const { data: tasks } = await supabase
        .from("tasks")
        .select(`
          id,
          title,
          due_at,
          lead:leads(id, name)
        `)
        .eq("assigned_to", profile.id)
        .eq("status", "pendiente")
        .lte("due_at", tomorrow.toISOString())
        .order("due_at", { ascending: true })

      const { data: leadIds } = await supabase
        .from("leads")
        .select("id")
        .eq("assigned_to", profile.id)

      const ids = (leadIds || []).map((l: { id: string }) => l.id)
      let appointmentsToday: Array<{ id: string; scheduled_at: string; appointment_type?: string; lead?: { name?: string } }> = []
      if (ids.length > 0) {
        const { data: appts } = await supabase
          .from("appointments")
          .select(`
            id,
            scheduled_at,
            appointment_type,
            lead:leads(id, name)
          `)
          .in("lead_id", ids)
          .gte("scheduled_at", today.toISOString())
          .lt("scheduled_at", tomorrow.toISOString())
          .order("scheduled_at", { ascending: true })
        appointmentsToday = (appts || []).map((a: any) => ({
          id: a.id,
          scheduled_at: a.scheduled_at,
          appointment_type: a.appointment_type,
          lead: Array.isArray(a.lead) ? a.lead[0] : a.lead,
        }))
      }

      const { data: staleLeads } = await supabase
        .from("leads")
        .select("id, name")
        .eq("assigned_to", profile.id)
        .in("status", ["nuevo", "contactado", "calificado", "cita_programada", "negociacion"])
        .or(`last_contact_at.is.null,last_contact_at.lt.${staleThreshold.toISOString()}`)

      const { count: callsCount } = await supabase
        .from("interactions")
        .select("id", { count: "exact", head: true })
        .eq("user_id", profile.id)
        .gte("created_at", yesterdayStart.toISOString())
        .lt("created_at", today.toISOString())
        .ilike("type", "%call%")

      const { count: leadsCount } = await supabase
        .from("leads")
        .select("id", { count: "exact", head: true })
        .eq("assigned_to", profile.id)
        .gte("created_at", yesterdayStart.toISOString())
        .lt("created_at", today.toISOString())

      const { count: dealsCount } = await supabase
        .from("leads")
        .select("id", { count: "exact", head: true })
        .eq("assigned_to", profile.id)
        .eq("status", "cerrado")
        .gte("deal_closed_at", yesterdayStart.toISOString())
        .lt("deal_closed_at", today.toISOString())

      const taskCount = (tasks || []).length
      const apptCount = appointmentsToday.length
      const staleCount = (staleLeads || []).length

      let bodyHtml = ""
      if (taskCount > 0) {
        bodyHtml += `
      <h3 style="font-size:14px;margin:0 0 8px;color:#18181b;">Tareas de hoy (${taskCount})</h3>
      <ul style="margin:0 0 16px;padding-left:20px;font-size:14px;">
        ${(tasks || [])
          .slice(0, 5)
          .map((t: any) => `<li>${t.title}${t.lead?.name ? ` - ${t.lead.name}` : ""}</li>`)
          .join("")}
        ${taskCount > 5 ? `<li>... y ${taskCount - 5} más</li>` : ""}
      </ul>
    `
      }
      if (apptCount > 0) {
        bodyHtml += `
      <h3 style="font-size:14px;margin:0 0 8px;color:#18181b;">Citas de hoy (${apptCount})</h3>
      <ul style="margin:0 0 16px;padding-left:20px;font-size:14px;">
        ${appointmentsToday
          .slice(0, 5)
          .map((a) => `<li>${a.lead?.name || "Lead"} - ${new Date(a.scheduled_at).toLocaleTimeString("es", { hour: "2-digit", minute: "2-digit" })}</li>`)
          .join("")}
        ${apptCount > 5 ? `<li>... y ${apptCount - 5} más</li>` : ""}
      </ul>
    `
      }
      if (staleCount > 0) {
        bodyHtml += `
      <h3 style="font-size:14px;margin:0 0 8px;color:#dc2626;">Leads sin contacto 48h+ (${staleCount})</h3>
      <ul style="margin:0 0 16px;padding-left:20px;font-size:14px;">
        ${(staleLeads || [])
          .slice(0, 5)
          .map((l: { name?: string }) => `<li>${l.name || "Sin nombre"}</li>`)
          .join("")}
        ${staleCount > 5 ? `<li>... y ${staleCount - 5} más</li>` : ""}
      </ul>
    `
      }
      if (callsCount || leadsCount || dealsCount) {
        bodyHtml += `
      <p style="margin:16px 0 0;font-size:13px;color:#71717a;">
        Ayer: ${callsCount || 0} llamadas · ${leadsCount || 0} leads creados · ${dealsCount || 0} ventas cerradas
      </p>
    `
      }
      if (!bodyHtml) {
        bodyHtml = "<p>No hay actividades pendientes para hoy.</p>"
      }
      bodyHtml += `<p style="margin-top:16px;"><a href="${FRONTEND_URL.replace(/\/+$/, "")}/dashboard" style="color:#2563eb;text-decoration:none;">Abrir CRM</a></p>`

      const subject = "Resumen del día - Doctor del Crédito CRM"
      const htmlBody = baseTemplate("Resumen diario", bodyHtml)

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

      if (res.ok) sent++
      else console.error(`[process-daily-digest] SendGrid failed for ${profile.email}:`, await res.text())
    }

    return new Response(JSON.stringify({ ok: true, sent, total: profiles.length }), { headers: { "Content-Type": "application/json" } })
  } catch (e) {
    console.error("[process-daily-digest] Error:", e)
    return new Response(JSON.stringify({ error: "Internal error" }), { status: 500, headers: { "Content-Type": "application/json" } })
  }
})
