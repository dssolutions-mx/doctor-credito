# ✅ Supabase Setup Complete - Next Steps

## What's Been Done

### 1. ✅ Installed Supabase Packages
- `@supabase/supabase-js@2.83.0`
- `@supabase/ssr@0.7.0`

### 2. ✅ Created Supabase Client Files
- **lib/supabase/client.ts** - Browser client for client-side operations
- **lib/supabase/server.ts** - Server client for API routes and server components
- **lib/supabase/database.types.ts** - TypeScript types for all database tables

### 3. ✅ Created API Routes

All API routes are ready to use with proper error handling:

#### Test Route
- **GET /api/test** - Test Supabase connection

#### Leads Routes
- **GET /api/leads** - List all leads (supports `?status=nuevo` filter)
- **GET /api/leads/[id]** - Get single lead with full context
- **PATCH /api/leads/[id]** - Update lead
- **POST /api/leads/create** - Create lead from conversation

#### Interactions Routes
- **POST /api/interactions/log** - Log call/activity

#### Tasks Routes
- **GET /api/tasks** - Get tasks (supports `?status=pendiente&lead_id=xxx`)
- **POST /api/tasks** - Create task
- **PATCH /api/tasks/[id]** - Update/complete task

#### Conversations Routes
- **GET /api/conversations** - Get conversations (supports `?with_phone=true&status=active`)

#### Appointments Routes
- **GET /api/appointments** - Get appointments (supports `?status=programada&lead_id=xxx`)
- **POST /api/appointments** - Create appointment

### 4. ✅ Created Custom React Hooks

**hooks/use-supabase-data.ts** provides:
- `useLeads(status?)` - Fetch leads with optional status filter
- `useLead(id)` - Fetch single lead with full details
- `useTasks(status?, leadId?)` - Fetch tasks
- `useAppointments(status?, leadId?)` - Fetch appointments
- `useConversations(withPhone?, status?)` - Fetch conversations

### 5. ✅ Created Environment Variables Template
- **.env.local.example** - Template for required environment variables

---

## 🚀 Next Steps (TO DO)

### Step 1: Set Environment Variables Locally (For Testing)

**IMPORTANT**: The environment variables are already in GitHub secrets, but you need them locally for development.

1. Get your Supabase keys from:
   https://supabase.com/dashboard/project/xkpmvyayohqorfovcwhn/settings/api

2. Create `.env.local` in the project root:
   ```bash
   cp .env.local.example .env.local
   ```

3. Fill in the actual values:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://xkpmvyayohqorfovcwhn.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=[paste-your-anon-key]
   SUPABASE_SERVICE_ROLE_KEY=[paste-your-service-role-key]
   ```

### Step 2: Test the Connection

1. Start the development server:
   ```bash
   pnpm dev
   ```

2. Test the connection in your browser:
   ```
   http://localhost:3000/api/test
   ```

   **Expected response:**
   ```json
   {
     "connected": true,
     "message": "Successfully connected to Supabase",
     "leadsCount": 0
   }
   ```

3. If you see an error, check:
   - Environment variables are correctly set
   - Supabase project is accessible
   - Your IP is not blocked by Supabase

### Step 3: Update Dashboard Pages

The dashboard pages currently use mock data from `lib/mock-data.ts`. You need to update them to use real Supabase data.

#### Example: Update Leads Page

**Before** (`app/(dashboard)/leads/page.tsx`):
```typescript
import { mockLeads } from "@/lib/mock-data"

export default function LeadsPage() {
  const filteredLeads = mockLeads.filter(...)
  // ...
}
```

**After**:
```typescript
"use client"

import { useLeads } from "@/hooks/use-supabase-data"

export default function LeadsPage() {
  const { leads, loading, error } = useLeads()

  if (loading) return <div>Cargando...</div>
  if (error) return <div>Error: {error}</div>

  const filteredLeads = leads.filter(...)
  // ...
}
```

#### Pages to Update:
1. **app/(dashboard)/dashboard/page.tsx** - Main dashboard
   - Replace `recentLeads` with `useLeads()` (limit 4)
   - Replace `todayAppointments` with `useAppointments()` filtered by today
   - Calculate stats from real data

2. **app/(dashboard)/leads/page.tsx** - Leads list
   - Replace `mockLeads` with `useLeads()`

3. **app/(dashboard)/leads/[id]/page.tsx** - Lead detail
   - Replace mock data with `useLead(params.id)`

4. **app/(dashboard)/tasks/page.tsx** - Tasks list
   - Use `useTasks('pendiente')` for pending tasks

5. **app/(dashboard)/appointments/page.tsx** - Appointments list
   - Use `useAppointments()`

### Step 4: Testing the Full Flow

Once you've updated the pages, test this workflow:

1. **View Conversations** (that N8N captured):
   - Create a page to view conversations with phone numbers
   - Filter: `useConversations(true)` (with_phone=true)

2. **Convert Conversation to Lead**:
   ```typescript
   const response = await fetch('/api/leads/create', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({
       conversation_id: 'xxx',
       assigned_to: 'user-id' // optional
     })
   })
   ```

3. **Log a Call**:
   ```typescript
   const response = await fetch('/api/interactions/log', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({
       lead_id: 'xxx',
       outcome: 'answered',
       notes: 'Cliente interesado...',
       duration_seconds: 180
     })
   })
   ```

4. **Create Appointment**:
   ```typescript
   const response = await fetch('/api/appointments', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({
       lead_id: 'xxx',
       scheduled_at: '2025-01-15T10:00:00Z',
       appointment_type: 'showroom',
       notes: 'Primera visita'
     })
   })
   ```

### Step 5: Data Migration (Optional)

If you want to preserve any mock data for testing:

1. Create a script to insert mock data into Supabase
2. Or manually add test data through Supabase Dashboard

---

## 📊 Database Schema Reference

Your Supabase database has these key tables:

### N8N Tables (Read-Only for your app)
- **conversations** - Facebook Messenger conversations
- **messages** - Conversation history
- **conversation_context** - Lead qualification data

### CRM Tables (Your app manages these)
- **leads** - Main CRM records
- **interactions** - Call logs, activities
- **tasks** - Follow-up tasks
- **appointments** - Scheduled meetings

### Support Tables
- **profiles** - User accounts
- **dealers** - Dealership information

---

## 🔍 Debugging Tips

### Connection Issues
```typescript
// Test connection
const response = await fetch('/api/test')
const data = await response.json()
console.log(data)
```

### Check Environment Variables
```bash
# In browser console
console.log(process.env.NEXT_PUBLIC_SUPABASE_URL)
// Should show: https://xkpmvyayohqorfovcwhn.supabase.co
```

### View Supabase Logs
- Go to: https://supabase.com/dashboard/project/xkpmvyayohqorfovcwhn/logs/query
- Check for errors

### Common Errors

1. **"relation does not exist"**
   - Table name is misspelled
   - Wrong project ID

2. **"No API key found"**
   - Environment variables not loaded
   - Restart dev server after adding .env.local

3. **"CORS error"**
   - Using browser client in server component
   - Use `createClient` from `lib/supabase/server.ts` in API routes

---

## 📝 Key Files Reference

```
doctor-credito/
├── .env.local.example          # Environment variables template
├── lib/
│   ├── supabase/
│   │   ├── client.ts          # Browser client
│   │   ├── server.ts          # Server client
│   │   └── database.types.ts  # TypeScript types
├── hooks/
│   └── use-supabase-data.ts   # React hooks for data fetching
├── app/
│   ├── api/
│   │   ├── test/route.ts      # Test connection
│   │   ├── leads/route.ts     # Leads API
│   │   ├── tasks/route.ts     # Tasks API
│   │   ├── interactions/      # Interactions API
│   │   ├── appointments/      # Appointments API
│   │   └── conversations/     # Conversations API
```

---

## ✅ Deployment Checklist

Before deploying to Vercel:

- [ ] Environment variables added to Vercel project settings
- [ ] Test connection works locally
- [ ] All dashboard pages updated to use real data
- [ ] Error handling tested
- [ ] Supabase project is in production mode

---

## 🎯 Success Criteria

You'll know the setup is complete when:

1. ✅ `/api/test` returns `connected: true`
2. ✅ Dashboard shows real leads from Supabase
3. ✅ Can create leads from N8N conversations
4. ✅ Can log calls and update lead status
5. ✅ Tasks are created automatically
6. ✅ No mock data is being used

---

## 🆘 Need Help?

If you encounter issues:

1. Check Supabase Dashboard:
   https://supabase.com/dashboard/project/xkpmvyayohqorfovcwhn

2. Review API route logs in your terminal

3. Check browser console for errors

4. Verify environment variables are loaded:
   ```bash
   pnpm dev
   # Should not show warnings about missing env vars
   ```

---

**Everything is ready! Just add your environment variables and test the connection.**
