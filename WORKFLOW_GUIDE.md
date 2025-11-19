# Doctor del Crédito BDC - Complete Workflow Guide

**Last Updated**: November 19, 2025

---

## 🎯 Complete Workflow: From N8N Conversation to Closed Deal

### **Phase 1: N8N Captures Lead** (Automated)

**What Happens:**
1. User sends message on Facebook Messenger
2. N8N bot engages in conversation
3. Bot asks qualifying questions (vehicle interest, budget, timeline, credit situation)
4. Bot captures phone number
5. N8N saves to Supabase:
   - `conversations` table → Main conversation record
   - `messages` table → Full chat history
   - `conversation_context` table → Qualification data

**Tables Involved:**
- `conversations` - Status: 'active', phone captured
- `messages` - All user/bot messages
- `conversation_context` - Vehicle interest, budget, urgency, etc.

---

### **Phase 2: Convert to Lead** (Manual)

**How It Works:**

1. **View Available Conversations**
   - Navigate to: **Dashboard → "Ver Conversaciones"** or **/conversations**
   - See all conversations with phone numbers captured
   - Filter: Only showing `status='active'` and `phone_number IS NOT NULL`

2. **Review Conversation Details**
   - Phone number (captured)
   - Vehicle interest
   - Budget range
   - Credit situation
   - Urgency level
   - Full chat history
   - Timeline

3. **Click "Crear Lead"**
   - Confirmation dialog shows:
     - Conversation summary
     - What will be created
   - Click "Crear Lead" to proceed

4. **System Automatically:**
   - Creates lead in `leads` table with:
     - `conversation_id` → Links to N8N conversation
     - `name` → Phone number (to be updated later)
     - `phone` → From conversation
     - `source` → 'facebook'
     - `vehicle_interest` → From conversation_context
     - `budget_range` → From conversation_context
     - `urgency_level` → From conversation urgency
     - `status` → 'nuevo'
   - Creates urgent task in `tasks` table:
     - `title` → "Llamar a nuevo lead"
     - `description` → "Lead caliente de Facebook Messenger"
     - `priority` → 'urgente'
     - `due_at` → NOW + 5 minutes
     - `auto_generated` → true
   - Redirects to lead detail page

**API Endpoint Used:**
```
POST /api/leads/create
Body: { conversation_id: "uuid" }
```

---

### **Phase 3: Initial Contact** (Manual)

**How It Works:**

1. **View Urgent Tasks**
   - Navigate to: **Dashboard → Tasks** or **/tasks**
   - See "Urgente" section with auto-generated task
   - Task shows: "Llamar a nuevo lead" (due in 5 minutes)

2. **Call the Lead**
   - Click task → "Ver Lead" → View full lead details
   - See conversation history from N8N
   - Click "Llamar" button or call directly

3. **Log the Call**
   - After call ends, log interaction
   - Fill in:
     - Outcome: 'answered', 'no_answer', 'voicemail'
     - Notes: What was discussed
     - Duration: Call length in seconds

4. **System Automatically:**
   - Creates interaction in `interactions` table
   - Updates `leads.last_contact_at` → NOW
   - If outcome='answered': Updates `leads.status` → 'contactado'
   - If no answer: Schedule follow-up task

**API Endpoint Used:**
```
POST /api/interactions/log
Body: {
  lead_id: "uuid",
  type: "call_outbound",
  outcome: "answered",
  notes: "Cliente muy interesado...",
  duration_seconds: 180
}
```

---

### **Phase 4: Qualify & Schedule** (Manual)

**How It Works:**

1. **Update Lead Information**
   - Update lead name (if obtained)
   - Update vehicle interest
   - Update budget
   - Add notes

2. **Change Lead Status**
   - From: 'contactado'
   - To: 'calificado' (if qualified)

3. **Schedule Appointment**
   - Click "Agendar Cita"
   - Fill in:
     - Date/time
     - Appointment type: 'showroom', 'test_drive', etc.
     - Vehicle interest
     - Notes

4. **System Automatically:**
   - Creates appointment in `appointments` table
   - Updates `leads.status` → 'cita_programada'
   - Creates reminder task

**API Endpoint Used:**
```
POST /api/appointments
Body: {
  lead_id: "uuid",
  scheduled_at: "2025-01-15T10:00:00Z",
  appointment_type: "showroom",
  notes: "Primera visita"
}
```

---

### **Phase 5: Close Deal** (Manual)

**How It Works:**

1. **After Appointment**
   - Mark appointment as 'completada' or 'no_show'

2. **If Deal Closes:**
   - Update lead status → 'cerrado'
   - Enter deal details:
     - `deal_amount` → Sale price
     - `commission_amount` → Your commission
     - `deal_closed_at` → NOW

3. **If Deal Lost:**
   - Update lead status → 'perdido'
   - Add notes explaining why

---

## 📊 Data Flow Summary

```
┌─────────────────────────────────────────────────────────────────┐
│ PHASE 1: N8N AUTOMATION (No user action required)              │
├─────────────────────────────────────────────────────────────────┤
│ Facebook Messenger → N8N Bot → Supabase                        │
│ Tables: conversations, messages, conversation_context          │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ PHASE 2: LEAD CREATION (User clicks "Crear Lead")              │
├─────────────────────────────────────────────────────────────────┤
│ /conversations → View list → Click "Crear Lead"                │
│ POST /api/leads/create                                          │
│ Creates: 1 lead + 1 urgent task                                │
│ Tables: leads, tasks                                            │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ PHASE 3: INITIAL CONTACT (User calls lead)                     │
├─────────────────────────────────────────────────────────────────┤
│ /tasks → See urgent task → Call lead → Log call                │
│ POST /api/interactions/log                                      │
│ Updates: leads.last_contact_at, leads.status                   │
│ Tables: interactions, leads                                     │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ PHASE 4: QUALIFY & SCHEDULE (User schedules appointment)       │
├─────────────────────────────────────────────────────────────────┤
│ /leads/[id] → Update info → Schedule appointment               │
│ POST /api/appointments                                          │
│ Updates: leads.status → 'cita_programada'                      │
│ Tables: appointments, leads                                     │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ PHASE 5: CLOSE DEAL (User closes or loses deal)                │
├─────────────────────────────────────────────────────────────────┤
│ /leads/[id] → Update status → Enter deal details               │
│ PATCH /api/leads/[id]                                           │
│ Updates: leads.status, deal_amount, commission_amount          │
│ Tables: leads                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔑 Key Pages

### 1. **Dashboard** (`/dashboard`)
- Overview stats (active leads, appointments, conversion rate)
- Recent leads
- Today's appointments
- Quick actions

### 2. **Conversations** (`/conversations`) ⭐ KEY PAGE
- View N8N conversations with phone captured
- See conversation details and context
- **Convert to Lead** button
- This is where the N8N → CRM workflow begins

### 3. **Leads** (`/leads`)
- List all leads
- Filter by status, source
- Search by name/phone
- View lead cards with urgency indicators

### 4. **Lead Detail** (`/leads/[id]`)
- Full lead information
- Conversation history from N8N
- Interactions timeline
- Tasks list
- Appointments
- Action buttons (call, update status, schedule)

### 5. **Tasks** (`/tasks`)
- Urgent tasks (overdue + high priority)
- Today's tasks
- Upcoming tasks
- Auto-generated tasks (from lead creation)

### 6. **Appointments** (`/appointments`)
- Today's appointments
- Upcoming appointments
- Appointment management

---

## 🎛️ Status Flow

### Lead Status Progression:
```
nuevo → contactado → calificado → cita_programada →
negociacion → cerrado | perdido | no_show
```

### Status Meanings:
- **nuevo** - Just created from conversation, not yet contacted
- **contactado** - Initial call made, lead answered
- **calificado** - Lead is qualified and interested
- **cita_programada** - Appointment scheduled
- **negociacion** - Actively negotiating deal
- **cerrado** - Deal closed successfully ✅
- **perdido** - Deal lost ❌
- **no_show** - Didn't show up to appointment

---

## 🚨 Critical Rules

### 1. **Never Modify Financial Tables**
The Supabase project has other tables (`financial_reports`, `financial_data`, etc.) for another project.
**DO NOT TOUCH THESE TABLES.**

### 2. **Always Link Lead to Conversation**
Every lead MUST have a `conversation_id` to preserve the N8N chat history.

### 3. **Log Every Interaction**
Every call, SMS, email should be logged in `interactions` table for full audit trail.

### 4. **Auto-Tasks Are Your Friend**
The system auto-creates urgent tasks when leads are created. Don't ignore them!

---

## 🧪 Testing the Workflow

### Test Scenario: End-to-End

1. **Create Test Conversation** (Manually in Supabase or wait for N8N)
   - Insert into `conversations` with phone number
   - Insert into `conversation_context` with vehicle interest

2. **Convert to Lead**
   - Go to `/conversations`
   - Click "Crear Lead" on the test conversation
   - Verify:
     - ✅ Lead created with status 'nuevo'
     - ✅ Task created with priority 'urgente'
     - ✅ Redirected to lead detail page

3. **Log a Call**
   - From lead detail page, log interaction
   - Select outcome: 'answered'
   - Add notes
   - Verify:
     - ✅ Interaction created
     - ✅ Lead status changed to 'contactado'
     - ✅ Last contact timestamp updated

4. **Schedule Appointment**
   - Schedule a test appointment
   - Verify:
     - ✅ Appointment created
     - ✅ Lead status changed to 'cita_programada'
     - ✅ Appointment shows in dashboard

5. **Close Deal**
   - Update lead status to 'cerrado'
   - Add deal amount
   - Verify:
     - ✅ Lead marked as closed
     - ✅ Deal amount saved
     - ✅ Shows in conversion stats

---

## 📱 User Journey Example

**María** (your lead) messages on Facebook:
1. "Hola, busco un auto usado"
2. N8N bot asks questions
3. María shares: "Honda Civic 2020, presupuesto $20k, teléfono: 555-1234"
4. **Conversation closes**, phone captured ✅

**You** (BDC agent):
1. Open dashboard → See "Ver Conversaciones" button
2. Click → See María's conversation
3. Review: Honda Civic interest, $20k budget, medium urgency
4. Click "Crear Lead" → System creates lead + urgent task
5. Go to Tasks → See "Llamar a nuevo lead" (due in 5 min)
6. Call María → She answers, very interested!
7. Log call → Outcome: 'answered', Notes: "Wants to see car tomorrow"
8. Schedule appointment → Tomorrow 2PM, type: 'showroom'
9. **Next day** → María visits, test drives, loves the car
10. Close deal → Status: 'cerrado', Amount: $18,500

**Result**: Full audit trail from Facebook message to closed deal! 🎉

---

## 🎯 Success Metrics

Track these in your dashboard:
- **Active Leads** - Leads not yet closed/lost
- **Conversion Rate** - (Closed Deals / Total Leads) × 100
- **Today's Appointments** - Scheduled for today
- **Response Time** - Time from lead creation to first call
- **Show Rate** - (Completed Appointments / Total Scheduled) × 100

---

## 🔧 Troubleshooting

### "No conversations showing"
- Check N8N is running and capturing leads
- Verify conversations have `phone_number NOT NULL`
- Check conversations table in Supabase dashboard

### "Lead creation fails"
- Verify conversation_id exists
- Check API route logs
- Ensure Supabase connection is active

### "Tasks not showing"
- Check tasks table for `status='pendiente'`
- Verify task was created with lead
- Check API endpoint: `GET /api/tasks?status=pendiente`

### "Can't see conversation history in lead"
- Verify lead has `conversation_id`
- Check messages table has records for that conversation
- Check API query includes conversation join

---

## 📚 Additional Resources

- **Supabase Dashboard**: https://supabase.com/dashboard/project/xkpmvyayohqorfovcwhn
- **API Documentation**: See `SUPABASE_SETUP_COMPLETE.md`
- **Database Schema**: See guide document (tables section)

---

**Everything is connected. The workflow is complete. Ship it!** 🚀
