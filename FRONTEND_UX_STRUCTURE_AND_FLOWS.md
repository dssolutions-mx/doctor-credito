# DOCTOR DEL CRÉDITO - FRONTEND UX STRUCTURE & USER FLOWS
## Complete Design Blueprint Based on Apple HIG + Liquid Glass (iOS 26)

**Document Version:** 1.0  
**Last Updated:** November 10, 2025  
**Target Platform:** Web (Mobile-first, Responsive)

---

## TABLE OF CONTENTS

1. [Design Principles](#design-principles)
2. [User Roles & Permissions](#user-roles--permissions)
3. [Navigation Architecture](#navigation-architecture)
4. [Complete Page Inventory](#complete-page-inventory)
5. [Detailed Page Specifications](#detailed-page-specifications)
6. [User Flows](#user-flows)
7. [Design System](#design-system)
8. [Mobile Optimization](#mobile-optimization)
9. [Responsive Breakpoints](#responsive-breakpoints)
10. [Development Priority](#development-priority)

---

## DESIGN PRINCIPLES

### Apple Human Interface Guidelines (2025 - Liquid Glass)

**Core Principles:**
1. **Clarity** - Every element has purpose, no clutter
2. **Deference** - Content over chrome (UI doesn't distract from content)
3. **Depth** - Translucency, layers, fluid motion (Liquid Glass design language)
4. **Consistency** - Familiar patterns, predictable interactions

**Visual Language:**
- **Translucent backgrounds** (frosted glass effect on cards)
- **Fluid animations** (smooth transitions between states)
- **Depth hierarchy** (shadows and layering for context)
- **Touch-first interactions** (minimum 44pt touch targets)
- **Gestural navigation** (swipe, long-press, drag-drop)

**Typography:**
- System font: SF Pro (Apple's native)
- Clear hierarchy with size and weight
- Ample white space for readability
- Minimum 17pt for body text

**Design Philosophy for Doctor del Crédito:**
- **Speed over features** - Dad needs to act fast
- **Glanceable information** - See what matters in <5 seconds
- **One-tap actions** - Minimize steps to complete tasks
- **Natural language** - Professional Spanish (not Spanglish)
- **Forgiving design** - Undo actions, auto-save, confirmations on destructive actions

---

## USER ROLES & PERMISSIONS

### Role 1: BDC/Sales Agent (Dad & Future Team)

**Primary Goal:** Process leads quickly, set appointments, close deals

**Permissions:**
- ✅ View all leads assigned to them
- ✅ Create/edit/close leads
- ✅ Add call logs and notes
- ✅ Book/manage appointments
- ✅ **Add/edit inventory** (with dealer selection)
- ✅ View inventory across all dealers (with filters)
- ✅ Share vehicles with leads
- ✅ View reports (their own performance)
- ❌ Delete leads (archive only)
- ❌ Delete inventory (mark as sold only)
- ❌ Access other agents' private notes

**Default View:** Task-focused dashboard

---

### Role 2: Dealer/Dealership Staff

**Primary Goal:** Monitor pipeline, manage inventory, track ROI

**Permissions:**
- ✅ View all leads for their dealership
- ✅ View all agents' activity on their leads
- ✅ Add/edit/delete inventory for their dealership
- ✅ Post vehicles to Facebook
- ✅ View detailed analytics and reports
- ✅ Manage appointments for their location
- ✅ View commission/revenue metrics
- ❌ Edit leads directly (observe only)
- ❌ Access other dealerships' data

**Default View:** Dashboard with overview metrics

---

### Role 3: Admin (Future - Post-MVP)

**Permissions:** Full system access, user management, multi-dealership view

---

## NAVIGATION ARCHITECTURE

### BDC/Sales Agent Navigation

**Primary Navigation (Bottom Tab Bar - Mobile):**
```
┌─────────────────────────────────────────────────────────────┐
│ [🏠 Tasks] [📋 Leads] [📅 Calendar] [🚗 Inventory] [👤 Me] │
└─────────────────────────────────────────────────────────────┘
```

**Desktop/Tablet (Left Sidebar):**
```
┌─ DOCTOR DEL CRÉDITO ─┐
│                       │
│ 🏠 Tasks              │
│ 📋 Leads              │
│ 📅 Calendar           │
│ 🚗 Inventory          │
│ 📊 Reports            │
│ 👤 Profile            │
│                       │
│ [+ NEW LEAD]          │
└───────────────────────┘
```

---

### Dealer Navigation

**Primary Navigation (Bottom Tab Bar - Mobile):**
```
┌──────────────────────────────────────────────────────────────┐
│ [🏠 Dashboard] [📋 Leads] [🚗 Inventory] [📊 Reports] [⚙️]  │
└──────────────────────────────────────────────────────────────┘
```

**Desktop/Tablet (Left Sidebar):**
```
┌─ METRO HONDA ─────────┐
│                       │
│ 🏠 Dashboard          │
│ 📋 Active Leads       │
│ 🚗 Inventory          │
│ 📅 Appointments       │
│ 📊 Reports            │
│ ⚙️ Settings           │
│                       │
│ [+ ADD VEHICLE]       │
└───────────────────────┘
```

---

### Contextual Navigation Patterns

**Top Bar (Always Present):**
- **Left:** Back button (when in deep navigation)
- **Center:** Page title
- **Right:** Context-specific action (+ Add, Edit, Filter, etc.)

**Floating Action Button (FAB):**
- Used for primary action on list views
- Position: Bottom right, 16pt from edges
- Examples:
  - Leads list → "+ New Lead"
  - Calendar → "+ Book Appointment"
  - Inventory → "+ Add Vehicle"

---

## COMPLETE PAGE INVENTORY

### Authentication & Onboarding
- `/login` - Universal login with role-based routing
- `/forgot-password` - Password recovery
- `/onboarding` - First-time user setup (Future)

### BDC/Sales Agent Pages

**Dashboard & Tasks:**
- `/dashboard` - Task-focused home with priorities
- `/tasks` - Full task list with filters

**Lead Management:**
- `/leads` - Lead list view (default)
- `/leads/pipeline` - Kanban pipeline view
- `/leads/new` - Create new lead form
- `/leads/[id]` - Lead detail with full history
- `/leads/[id]/edit` - Edit lead information

**Call Management:**
- `/calls/active/[lead-id]` - Active call interface with quick logging
- `/calls/history` - Call log history

**Appointments:**
- `/appointments` - Calendar view (week default)
- `/appointments/book` - Quick booking modal/page
- `/appointments/[id]` - Appointment detail view
- `/appointments/[id]/edit` - Reschedule appointment

**Inventory:**
- `/inventory` - Vehicle catalog (filterable by dealer)
- `/inventory/new` - Add new vehicle form
- `/inventory/[id]` - Vehicle detail view
- `/inventory/[id]/edit` - Edit vehicle information

**Reporting:**
- `/reports` - Performance dashboard
- `/reports/conversion` - Conversion funnel analytics

**Profile & Settings:**
- `/profile` - User profile and preferences
- `/settings` - App settings and notifications

---

### Dealer Pages

**Dashboard:**
- `/dealer/dashboard` - Dealer-specific overview with metrics

**Lead Visibility:**
- `/dealer/leads` - All leads for their dealership
- `/dealer/leads/[id]` - Lead detail (read-only with full visibility)

**Inventory Management:**
- `/dealer/inventory` - Their vehicles with full control
- `/dealer/inventory/new` - Add vehicle (pre-filled with dealer info)
- `/dealer/inventory/[id]` - Vehicle detail with edit/delete options
- `/dealer/inventory/[id]/edit` - Edit vehicle

**Appointments:**
- `/dealer/appointments` - All appointments at their location

**Analytics:**
- `/dealer/reports` - Enhanced analytics with ROI metrics
- `/dealer/reports/performance` - Agent performance comparison

**Settings:**
- `/dealer/settings` - Dealership configuration
- `/dealer/settings/users` - User management (Future)
- `/dealer/settings/integrations` - Facebook/Twilio settings

---

## DETAILED PAGE SPECIFICATIONS

### 🔐 AUTHENTICATION

#### Page: `/login`

**UX Goal:** Fast, secure entry - get users working immediately

**Layout:**
```
┌─────────────────────────────────────┐
│                                     │
│         [LOGO]                      │
│     Doctor del Crédito              │
│                                     │
│  ┌─────────────────────────────┐   │
│  │  Email or Phone             │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │  Password          [👁️]     │   │
│  └─────────────────────────────┘   │
│                                     │
│  [ Remember me ]  [Forgot?]         │
│                                     │
│  ┌─────────────────────────────┐   │
│  │      SIGN IN                │   │
│  └─────────────────────────────┘   │
│                                     │
│  ─────── or sign in with ──────    │
│                                     │
│  [Touch ID / Face ID]               │
│                                     │
└─────────────────────────────────────┘
```

**Design Details:**
- Centered card with translucent background (Liquid Glass)
- Large input fields (48pt height)
- Clear labels above fields (not placeholder text)
- Password visibility toggle
- Biometric option on supported devices
- Auto-focus on email field
- Enter key submits form

**Post-Login Routing:**
- BDC Agent → `/dashboard` (tasks)
- Dealer → `/dealer/dashboard` (metrics overview)

---

### 🏠 BDC DASHBOARD

#### Page: `/dashboard`

**UX Goal:** Immediate situational awareness - what needs attention NOW

**Layout (Mobile - Vertical Scroll):**

**1. Hero Stats** (Top section - Glanceable)
```
┌─────────────────────────────────────────────┐
│  TODAY                                       │
│  ┌─────┐  ┌─────┐  ┌─────┐  ┌─────┐        │
│  │  8  │  │  3  │  │ 42% │  │  2  │        │
│  │ New │  │Appts│  │Conv │  │Sold │        │
│  │Leads│  │     │  │Rate │  │     │        │
│  └─────┘  └─────┘  └─────┘  └─────┘        │
└─────────────────────────────────────────────┘
```

**2. Urgent Tasks** (Priority section - Red accent)
```
┌─────────────────────────────────────────────┐
│  🔴 URGENT (2)                              │
├─────────────────────────────────────────────┤
│  Call Maria Lopez                      2hr  │
│  Re: 2019 Honda Civic - No answer          │
│  [CALL NOW] [SNOOZE] [DONE]                │
├─────────────────────────────────────────────┤
│  Confirm: Juan Perez                   1hr  │
│  Tomorrow 2pm - 2020 Toyota Camry          │
│  [CALL] [TEXT] [✓ CONFIRMED]               │
└─────────────────────────────────────────────┘
```

**3. Today's Priorities** (Main action list)
```
┌─────────────────────────────────────────────┐
│  TODAY'S PRIORITIES (15)                    │
├─────────────────────────────────────────────┤
│  🟡 Call new lead: Carlos Martinez          │
│     Re: 2021 Ford F-150 - 12 mins ago       │
│     [CALL] [VIEW LEAD] [SNOOZE]             │
├─────────────────────────────────────────────┤
│  🟡 Follow up: Ana Rodriguez                │
│     No-show yesterday - Reschedule          │
│     [CALL] [TEXT] [MARK LOST]               │
├─────────────────────────────────────────────┤
│  🟢 Check in: Roberto Silva                 │
│     Weekly follow-up - Still shopping       │
│     [CALL] [EMAIL] [SKIP]                   │
└─────────────────────────────────────────────┘
```

**4. Quick Inventory Snapshot**
```
┌─────────────────────────────────────────────┐
│  INVENTORY SNAPSHOT                          │
│  18 available • 5 pending • 3 sold this week│
│  [VIEW ALL INVENTORY →]                     │
└─────────────────────────────────────────────┘
```

**5. Upcoming Section** (Collapsed by default)
```
┌─────────────────────────────────────────────┐
│  UPCOMING (8)                         [▼]   │
│  Later today, Tomorrow, This week...        │
└─────────────────────────────────────────────┘
```

**Interaction Patterns:**
- **Pull to refresh** - Updates task list
- **Swipe left on task** - Quick actions (snooze, skip, mark done)
- **Tap task** - Expands to show full details
- **Tap "Call Now"** - Initiates call + transitions to call interface
- **Color coding:**
  - 🔴 Red = Overdue/Urgent
  - 🟡 Yellow = Today's priority
  - 🟢 Green = Low priority/optional

**User Story:** *"I open the app at 9am and immediately see I have 2 overdue calls, 3 appointments to confirm, and 15 leads to work today"*

---

### 📋 LEADS LIST

#### Page: `/leads`

**UX Goal:** Scan, filter, and act on leads quickly

**Top Bar:**
```
┌─────────────────────────────────────────────┐
│  Leads                          [List/Kanban]│
└─────────────────────────────────────────────┘
```

**Filter Bar (Horizontal scroll chips):**
```
[All] [My Leads] [🔥 Hot] [Today] [Overdue] [+Filter]
```

**Lead Cards (List View):**
```
┌─────────────────────────────────────────────┐
│  Maria Lopez                           🔥   │
│  (555) 123-4567                             │
│  2019 Honda Civic • Facebook • 2 hrs ago    │
│  Status: Contacted • Next: Call today       │
│  [CALL] [TEXT] [VIEW →]                     │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│  Juan Perez                            ⏰   │
│  (555) 234-5678                             │
│  2020 Toyota Camry • Referral • Yesterday   │
│  Status: Qualified • Next: Set appointment  │
│  [CALL] [TEXT] [VIEW →]                     │
└─────────────────────────────────────────────┘
```

**Card Design Details:**
- 16pt padding, 12pt rounded corners
- Translucent background (Liquid Glass effect)
- Priority indicator (🔥 Hot, ⏰ Warm, ❄️ Cold)
- Color-coded left border (red/yellow/blue)
- Minimum 80pt height for touch comfort

**Swipe Actions:**
- **Swipe left** - Quick actions (Call, Text, Mark Dead)
- **Swipe right** - Add to appointment, Share

**FAB (Floating Action Button):**
- Bottom right: `[+ NEW LEAD]`
- Primary brand color
- 56x56pt size

**Empty State:**
```
┌─────────────────────────────────────────────┐
│                                             │
│            [Illustration]                   │
│                                             │
│       No leads match your filters           │
│                                             │
│  Try adjusting your filters or              │
│  [+ ADD A NEW LEAD]                         │
│                                             │
└─────────────────────────────────────────────┘
```

---

#### Page: `/leads/pipeline` (Kanban View)

**UX Goal:** Visual sales funnel, drag-and-drop workflow

**Layout (Horizontal scroll columns):**
```
┌─────────┬─────────┬─────────┬─────────┬─────────┬─────────┐
│  NEW    │CONTACTED│QUALIFIED│APPT SET │ SHOWED  │  SOLD   │
│   (8)   │  (12)   │   (7)   │   (5)   │   (3)   │   (2)   │
├─────────┼─────────┼─────────┼─────────┼─────────┼─────────┤
│┌───────┐│┌───────┐│┌───────┐│┌───────┐│┌───────┐│┌───────┐│
││Maria  ││││Juan   ││││Carlos ││││Ana    ││││Jose  ││││Pedro ││││
││Lopez  ││││Perez  ││││Mart.  ││││Rod.   ││││Silva ││││Gomez ││││
││🔥     ││││⏰     ││││🔥     ││││⏰     ││││⏰    ││││✅    ││││
││Civic  ││││Camry  ││││F-150  ││││Accord ││││CR-V  ││││Civic ││││
││2hrs   ││││1 day  ││││3 days ││││Today  ││││+3hrs ││││Done  ││││
│└───────┘│└───────┘│└───────┘│└───────┘│└───────┘│└───────┘│
│         │         │         │         │         │         │
│┌───────┐│┌───────┐│         │         │         │         │
││Carlos ││││Roberto││         │         │         │         │
│└───────┘│└───────┘│         │         │         │         │
└─────────┴─────────┴─────────┴─────────┴─────────┴─────────┘
```

**Interaction:**
- **Drag card** between columns to change status
- **Tap card** - Opens preview sheet (swipe up for full detail)
- **Horizontal scroll** - See all pipeline stages
- **Haptic feedback** when dropping card in new column
- **Smooth animation** as card moves

**Mobile Optimization:**
- 2-3 columns visible at once
- Swipe horizontally to see more stages
- Column headers sticky on scroll

---

#### Page: `/leads/[id]` (Lead Detail)

**UX Goal:** Complete client history + quick actions in one scrollable view

**Layout (Vertical scroll):**

**1. Header (Sticky on scroll):**
```
┌─────────────────────────────────────────────┐
│  [←]  Maria Lopez                    [⋮]    │
│  (555) 123-4567 [Call] • maria@email.com    │
│  Status: Contacted    Priority: 🔥 Hot      │
└─────────────────────────────────────────────┘
```

**2. Quick Actions Bar:**
```
┌─────────────────────────────────────────────┐
│  [📞 CALL] [💬 TEXT] [📧 EMAIL] [📅 BOOK]  │
└─────────────────────────────────────────────┘
```

**3. Lead Intelligence (Expandable sections):**

```
┌─────────────────────────────────────────────┐
│  📋 CONTACT INFO                      [▼]   │
├─────────────────────────────────────────────┤
│  Phone: (555) 123-4567 (Mobile)             │
│  Email: maria@email.com                     │
│  Preferred: Phone calls (español)           │
│  Best time: Weekdays after 5pm              │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│  🚗 VEHICLE INTEREST                  [▼]   │
├─────────────────────────────────────────────┤
│  Primary: 2019 Honda Civic EX               │
│  [View Vehicle Details →]                   │
│  Alternatives shown:                        │
│  • 2020 Toyota Corolla                      │
│  • 2018 Honda Accord                        │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│  💰 QUALIFICATION                     [▼]   │
├─────────────────────────────────────────────┤
│  Credit: Good (680-720 range)               │
│  Down payment: $3,000-5,000                 │
│  Trade-in: 2015 Honda Civic (needs eval)    │
│  Timeline: 1-3 months                       │
│  Employment: Full-time, $4,500/mo           │
│  [Edit Qualification →]                     │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│  📝 NOTES & REMINDERS                 [▼]   │
├─────────────────────────────────────────────┤
│  • Has 3 kids - needs reliable car          │
│  • Prefers Saturday appointments            │
│  • Referred by cousin Maria Gonzalez        │
│  [+ Add Note]                               │
└─────────────────────────────────────────────┘
```

**4. Activity Timeline:**
```
┌─────────────────────────────────────────────┐
│  📅 ACTIVITY TIMELINE                       │
├─────────────────────────────────────────────┤
│  [+ Quick Note]                             │
├─────────────────────────────────────────────┤
│  TODAY, 2:34 PM                             │
│  📞 Outbound call - 8 min                   │
│  "Discussed financing options. Wants to     │
│  bring trade-in for evaluation. Booking     │
│  appointment for Saturday."                 │
│  - You                                      │
├─────────────────────────────────────────────┤
│  TODAY, 11:20 AM                            │
│  💬 SMS sent                                │
│  "Hi Maria! Following up about the Civic.   │
│  Still available. When can you come see it?"│
│  - Automated                                │
├─────────────────────────────────────────────┤
│  YESTERDAY, 4:15 PM                         │
│  📞 Outbound call - No answer               │
│  Left voicemail                             │
│  - You                                      │
├─────────────────────────────────────────────┤
│  NOV 8, 3:22 PM                             │
│  📧 Auto-response sent                      │
│  Initial contact template                   │
│  - System                                   │
├─────────────────────────────────────────────┤
│  NOV 8, 3:20 PM                             │
│  ⭐ Lead created                            │
│  Source: Facebook - 2019 Civic listing      │
│  - System                                   │
└─────────────────────────────────────────────┘
```

**5. Quick Stats Card:**
```
┌─────────────────────────────────────────────┐
│  📊 ENGAGEMENT METRICS                      │
├─────────────────────────────────────────────┤
│  Days since first contact: 3                │
│  Contact attempts: 5                        │
│  Successful conversations: 2                │
│  Last contact: Today at 2:34 PM             │
│  Next action: Book appointment              │
└─────────────────────────────────────────────┘
```

**Interaction Patterns:**
- **Tap phone/email** - Direct action (call/email)
- **Tap vehicle name** - Opens vehicle detail
- **Sections collapse** to save space
- **Pull down** - Refresh timeline
- **Timeline items expandable** for full details
- **Quick note** always accessible at top of timeline

---

### 📞 CALL INTERFACE

#### Page: `/calls/active/[lead-id]`

**UX Goal:** Zero-distraction calling with easy note-taking

**During Call (Full screen):**
```
┌─────────────────────────────────────────────┐
│                                             │
│           Maria Lopez                       │
│         (555) 123-4567                      │
│                                             │
│            [Photo/Avatar]                   │
│                                             │
│             00:03:42                        │
│                                             │
│                                             │
│  ┌───┐  ┌───┐  ┌───┐  ┌───┐  ┌───┐        │
│  │🔇 │  │📞 │  │🔊 │  │123│  │...│        │
│  │Mute│  │Hold│  │Spkr│  │Pad│  │More│     │
│  └───┘  └───┘  └───┘  └───┘  └───┘        │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │        [END CALL]                   │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  ⬆ Swipe up for notes                      │
└─────────────────────────────────────────────┘
```

**Quick Notes Sheet (Swipe up from bottom):**
```
┌─────────────────────────────────────────────┐
│  === CALL NOTES ===                         │
├─────────────────────────────────────────────┤
│  Quick Tags (tap to add):                   │
│  [Got Phone #] [Interested] [Not Now]       │
│  [Wrong #] [Call Back] [Appointment Set]    │
├─────────────────────────────────────────────┤
│  Notes:                                     │
│  ┌─────────────────────────────────────┐   │
│  │ Type notes here...                  │   │
│  │                                     │   │
│  └─────────────────────────────────────┘   │
├─────────────────────────────────────────────┤
│  Quick Actions:                             │
│  [📅 Schedule Callback] [📧 Send Email]     │
└─────────────────────────────────────────────┘
```

**Post-Call Modal (Appears after call ends):**
```
┌─────────────────────────────────────────────┐
│  Call Log: Maria Lopez              [✕]    │
│  Duration: 3 min 42 sec                     │
├─────────────────────────────────────────────┤
│  Outcome: [Dropdown ▼]                      │
│    ● Appointment Set                        │
│    ● Got phone number                       │
│    ● No answer / Voicemail                  │
│    ● Not interested                         │
│    ● Call back later                        │
│    ● Wrong number                           │
├─────────────────────────────────────────────┤
│  Notes:                                     │
│  ┌─────────────────────────────────────┐   │
│  │ [Auto-filled from in-call notes]    │   │
│  │                                     │   │
│  └─────────────────────────────────────┘   │
├─────────────────────────────────────────────┤
│  Next Action: [Dropdown ▼]                  │
│    ● Book appointment                       │
│    ● Call back [Select date/time]           │
│    ● Send more info                         │
│    ● Mark as closed                         │
│    ● None (manual follow-up)                │
├─────────────────────────────────────────────┤
│  [CANCEL] [SAVE & CONTINUE]                 │
└─────────────────────────────────────────────┘
```

**Workflow:**
1. User taps "Call" from anywhere in app
2. **Smooth transition** to call interface
3. Phone dials (tel: link on mobile, VoIP option future)
4. **During call:** Swipe up for notes
5. **After call ends:** Modal appears
6. Fill outcome + next action
7. Tap "Save & Continue"
8. Returns to previous screen with updated lead status

---

### 📅 APPOINTMENTS

#### Page: `/appointments` (Calendar View)

**UX Goal:** Clear schedule visualization + quick booking

**Top Bar:**
```
┌─────────────────────────────────────────────┐
│  [Today] November 10, 2025    [Day/Week/Month]│
└─────────────────────────────────────────────┘
```

**Week View (Default):**
```
     Mon    Tue    Wed    Thu    Fri    Sat
     11     12     13     14     15     16
┌─────────────────────────────────────────────┐
│ 9am │      │      │      │      │      │      │
│10am │ Maria│      │      │      │      │      │
│11am │ Lopez│      │Juan  │      │      │      │
│12pm │      │      │Perez │      │      │      │
│ 1pm │      │      │      │      │      │      │
│ 2pm │      │Carlos│      │      │      │      │
│ 3pm │      │      │      │      │      │Ana R.│
│ 4pm │      │      │      │      │      │      │
│ 5pm │      │      │      │      │      │      │
└─────────────────────────────────────────────┘

[+ BOOK APPOINTMENT] (FAB bottom right)
```

**Appointment Card (When tapped):**
```
┌─────────────────────────────────────────────┐
│  Maria Lopez                                │
│  Tomorrow, Nov 11 • 10:00 AM                │
│  Test Drive - 2019 Honda Civic              │
│  Status: ✅ Confirmed                       │
├─────────────────────────────────────────────┤
│  📱 (555) 123-4567                          │
│  📧 maria@email.com                         │
│  📍 Metro Honda, 123 Main St                │
├─────────────────────────────────────────────┤
│  Notes: Bringing trade-in for evaluation    │
├─────────────────────────────────────────────┤
│  [CALL] [TEXT REMINDER] [RESCHEDULE] [✕ CANCEL]│
└─────────────────────────────────────────────┘
```

**Color Coding:**
- 🟢 **Confirmed** (green tint)
- 🟡 **Pending confirmation** (amber tint)
- 🔴 **No-show** (red tint)
- ⚪ **Completed** (gray)

---

#### Page: `/appointments/book` (Quick Booking)

**UX Goal:** Schedule appointment in 3 taps or less

**Modal/Page:**
```
┌─────────────────────────────────────────────┐
│  Book Appointment                    [✕]   │
├─────────────────────────────────────────────┤
│  Lead: [Search or Select ▼]                │
│  ┌─────────────────────────────────────┐   │
│  │ Maria Lopez (555-123-4567)          │   │
│  └─────────────────────────────────────┘   │
├─────────────────────────────────────────────┤
│  Date: [Calendar picker]                    │
│  📅 Tomorrow, Nov 11, 2025                  │
├─────────────────────────────────────────────┤
│  Time: [Time slot picker]                   │
│  🕐 [10am] [11am] [2pm] [3pm] [4pm]        │
│     (Available slots shown)                 │
├─────────────────────────────────────────────┤
│  Type: [Dropdown ▼]                         │
│    ● Test Drive                             │
│    ● Finance Meeting                        │
│    ● Vehicle Delivery                       │
│    ● General Showroom Visit                 │
├─────────────────────────────────────────────┤
│  Vehicle: [Select from inventory ▼]         │
│  2019 Honda Civic EX - Metro Honda          │
├─────────────────────────────────────────────┤
│  Notes (optional):                          │
│  ┌─────────────────────────────────────┐   │
│  │                                     │   │
│  └─────────────────────────────────────┘   │
├─────────────────────────────────────────────┤
│  Send confirmation:                         │
│  [✓] SMS  [✓] Email                         │
├─────────────────────────────────────────────┤
│  [CANCEL] [CONFIRM APPOINTMENT]             │
└─────────────────────────────────────────────┘
```

**Smart Features:**
- **Pre-fill lead** if coming from lead detail
- **Suggest next available** time slots
- **Filter by dealership hours**
- **Conflict detection** (overlapping appointments)
- **Auto-send confirmation** via SMS/Email

---

### 🚗 INVENTORY MANAGEMENT

#### Page: `/inventory` (Vehicle Catalog)

**UX Goal:** Quick reference of available vehicles, easy filtering

**Top Bar:**
```
┌─────────────────────────────────────────────┐
│  Inventory                       [Grid/List]│
└─────────────────────────────────────────────┘
```

**Filter Bar:**
```
┌─────────────────────────────────────────────┐
│ [Search: "Honda Civic"...]                  │
├─────────────────────────────────────────────┤
│ [All Dealers ▼] [Available] [Price ▼] [+]  │
└─────────────────────────────────────────────┘
```

**Dealer Filter Dropdown:**
```
┌─────────────────────────────────────────────┐
│  ✓ All Dealers                              │
│  ☐ Metro Honda (12 vehicles)                │
│  ☐ Central Auto (8 vehicles)                │
│  ☐ Trucks Plus (6 vehicles)                 │
│  [APPLY]                                    │
└─────────────────────────────────────────────┘
```

**Grid View (Mobile - 1 column, Tablet - 2 columns):**
```
┌─────────────────────────────────────────────┐
│  [Large Photo - 16:9 ratio]                 │
│  2019 Honda Civic EX                        │
│  Metro Honda                                │
│  $18,500 • 45,000 mi                        │
│  🟢 Available                               │
│  2 active leads on this vehicle             │
│  [SHARE] [VIEW DETAILS →]                   │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│  [Large Photo - 16:9 ratio]                 │
│  2020 Toyota Camry LE                       │
│  Central Auto                               │
│  $22,000 • 32,000 mi                        │
│  🟡 Pending                                 │
│  1 lead (Maria Lopez)                       │
│  [SHARE] [VIEW DETAILS →]                   │
└─────────────────────────────────────────────┘
```

**Status Indicators:**
- 🟢 **Available** - Green with 20% opacity background
- 🟡 **Pending** - Amber with 20% opacity background
- 🔴 **Sold** - Red with 20% opacity background

**Card Interactions:**
- **Tap card** - Opens vehicle detail
- **Long-press photo** - Quick share menu (SMS, WhatsApp, Email)
- **Swipe right** - Quick share to last contacted lead

**FAB:**
- Bottom right: `[+ ADD VEHICLE]`

**Empty State:**
```
┌─────────────────────────────────────────────┐
│                                             │
│            [Car Illustration]               │
│                                             │
│      No vehicles in inventory yet           │
│                                             │
│  Start by adding your first vehicle         │
│  [+ ADD VEHICLE]                            │
│                                             │
└─────────────────────────────────────────────┘
```

---

#### Page: `/inventory/new` (Add Vehicle)

**UX Goal:** Add vehicle inventory in under 2 minutes

**Form Layout (Progressive Disclosure):**

**Step 1: Dealership Selection** (BDC Agent only)
```
┌─────────────────────────────────────────────┐
│  Select Dealership: [Dropdown ▼]            │
│  ┌─────────────────────────────────────┐   │
│  │ Metro Honda                         │   │
│  └─────────────────────────────────────┘   │
└─────────────────────────────────────────────┘
```

**Step 2: Basic Vehicle Info**
```
┌─────────────────────────────────────────────┐
│  Year:  [2019 ▼]                            │
│  Make:  [Honda ▼] (Auto-suggest)            │
│  Model: [Civic ▼] (Filtered by make)        │
│  Trim:  [EX ▼] (Optional)                   │
└─────────────────────────────────────────────┘
```

**Step 3: Details** (Expands after Step 2 complete)
```
┌─────────────────────────────────────────────┐
│  VIN:     [_________________]  [📷 Scan]    │
│  Price:   $[________]                       │
│  Mileage: [________] miles                  │
│  Color:   [Blue ▼] (Optional)               │
└─────────────────────────────────────────────┘
```

**Step 4: Photos**
```
┌─────────────────────────────────────────────┐
│  Photos (Up to 8):                          │
│  ┌───┐ ┌───┐ ┌───┐ ┌───┐                   │
│  │ + │ │   │ │   │ │   │                   │
│  │📷 │ │   │ │   │ │   │                   │
│  └───┘ └───┘ └───┘ └───┘                   │
│    1     2     3     4                      │
│                                             │
│  ┌───┐ ┌───┐ ┌───┐ ┌───┐                   │
│  │   │ │   │ │   │ │   │                   │
│  │   │ │   │ │   │ │   │                   │
│  └───┘ └───┘ └───┘ └───┘                   │
│    5     6     7     8                      │
│                                             │
│  [📷 Take Photo] [📁 Upload from Device]    │
└─────────────────────────────────────────────┘
```

**Step 5: Facebook Description** (Auto-generated, editable)
```
┌─────────────────────────────────────────────┐
│  Facebook Description:                      │
│  ┌─────────────────────────────────────┐   │
│  │ 🚗 2019 Honda Civic EX 🚗           │   │
│  │                                     │   │
│  │ ✅ Low mileage: 45,000              │   │
│  │ ✅ Clean title                      │   │
│  │ ✅ Financing available              │   │
│  │                                     │   │
│  │ 💰 Precio especial: $18,500         │   │
│  │ 📱 Llámame: (555) 123-4567          │   │
│  │ 📍 Metro Honda                      │   │
│  │                                     │   │
│  │ ¡No dejes pasar esta oportunidad!  │   │
│  └─────────────────────────────────────┘   │
└─────────────────────────────────────────────┘
```

**Bottom Actions:**
```
┌─────────────────────────────────────────────┐
│  [SAVE DRAFT]  [SAVE & POST TO FACEBOOK →]  │
└─────────────────────────────────────────────┘
```

**When "Save & Post to Facebook" tapped:**
```
┌─────────────────────────────────────────────┐
│  Post to Facebook?                   [✕]   │
├─────────────────────────────────────────────┤
│  This will post the vehicle to:             │
│  ✓ Facebook Marketplace                     │
│  ✓ Metro Honda Page                         │
│                                             │
│  Preview:                                   │
│  [Photo carousel]                           │
│  2019 Honda Civic EX - $18,500              │
│  [Description preview...]                   │
├─────────────────────────────────────────────┤
│  [CANCEL] [CONFIRM & POST]                  │
└─────────────────────────────────────────────┘
```

**Design Features:**
- **Auto-save** as user types (cloud icon animates)
- **Smart defaults** (dealer phone, location)
- **Photo compression** (optimizes before upload)
- **VIN scan** using device camera + OCR
- **Template system** for descriptions (customizable per dealer)
- **Progress indicator** (5 dots showing completion)

---

#### Page: `/inventory/[id]` (Vehicle Detail)

**UX Goal:** Complete vehicle info + quick actions

**Layout:**

**Photo Gallery (Top - Full width, swipeable):**
```
┌─────────────────────────────────────────────┐
│  [Large Photo 1 of 5]              < ● ● >  │
│                                             │
│  [Swipeable carousel]                       │
└─────────────────────────────────────────────┘
```

**Vehicle Header:**
```
┌─────────────────────────────────────────────┐
│  2019 Honda Civic EX                        │
│  Metro Honda                                │
│  $18,500 • 45,000 miles                     │
│  Status: 🟢 Available                       │
│  VIN: 1HGBH41JXMN109186                     │
└─────────────────────────────────────────────┘
```

**Quick Actions (BDC View):**
```
┌─────────────────────────────────────────────┐
│  [SHARE WITH LEAD] [VIEW FACEBOOK POST]     │
└─────────────────────────────────────────────┘
```

**Quick Actions (Dealer View - Additional):**
```
┌─────────────────────────────────────────────┐
│  [EDIT] [MARK AS SOLD] [DELETE]             │
└─────────────────────────────────────────────┘
```

**Active Leads Section:**
```
┌─────────────────────────────────────────────┐
│  ACTIVE LEADS (2)                           │
├─────────────────────────────────────────────┤
│  🔥 Maria Lopez                             │
│     Hot lead • Last contact: Today          │
│     [CALL] [VIEW LEAD →]                    │
├─────────────────────────────────────────────┤
│  ⏰ Juan Perez                               │
│     Warm • Sent more info yesterday         │
│     [CALL] [VIEW LEAD →]                    │
└─────────────────────────────────────────────┘
```

**Vehicle Details (Expandable):**
```
┌─────────────────────────────────────────────┐
│  📋 SPECIFICATIONS                    [▼]   │
├─────────────────────────────────────────────┤
│  Year: 2019                                 │
│  Make: Honda                                │
│  Model: Civic                               │
│  Trim: EX                                   │
│  Mileage: 45,000 miles                      │
│  Color: Blue                                │
│  VIN: 1HGBH41JXMN109186                     │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│  📝 DESCRIPTION                       [▼]   │
├─────────────────────────────────────────────┤
│  [Full Facebook description text]           │
└─────────────────────────────────────────────┘
```

**Performance Stats (Dealer View Only):**
```
┌─────────────────────────────────────────────┐
│  📊 PERFORMANCE                       [▼]   │
├─────────────────────────────────────────────┤
│  Posted: 3 days ago                         │
│  Facebook reach: 1,200 people               │
│  Lead inquiries: 5                          │
│  Appointments set: 2                        │
│  Closed deals: 0                            │
└─────────────────────────────────────────────┘
```

**Share Modal (When "Share with Lead" tapped):**
```
┌─────────────────────────────────────────────┐
│  Share Vehicle                       [✕]   │
├─────────────────────────────────────────────┤
│  Select lead: [Search/Dropdown ▼]          │
│  ┌─────────────────────────────────────┐   │
│  │ Maria Lopez                         │   │
│  └─────────────────────────────────────┘   │
├─────────────────────────────────────────────┤
│  Share via:                                 │
│  [💬 SMS] [📧 Email] [WhatsApp]             │
├─────────────────────────────────────────────┤
│  Message preview:                           │
│  "Hi Maria! Check out this 2019 Honda       │
│  Civic - perfect match for what you're      │
│  looking for. $18,500, low miles..."        │
│  [Edit message]                             │
├─────────────────────────────────────────────┤
│  Include: [✓] Photos [✓] Price [✓] Link    │
├─────────────────────────────────────────────┤
│  [CANCEL] [SEND]                            │
└─────────────────────────────────────────────┘
```

---

### 🏠 DEALER DASHBOARD

#### Page: `/dealer/dashboard`

**UX Goal:** Give dealers confidence through visibility and metrics

**Hero Stats Card (Top):**
```
┌─────────────────────────────────────────────┐
│  METRO HONDA - NOVEMBER 2025                │
│                                             │
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌──────┐│
│  │   82   │ │   24   │ │   11   │ │$3,850││
│  │ Leads  │ │ Appts  │ │ Deals  │ │ Due  ││
│  │ +12%   │ │ 29%    │ │ 46%    │ │      ││
│  └────────┘ └────────┘ └────────┘ └──────┘│
└─────────────────────────────────────────────┘
```

**Active Pipeline (Scrollable):**
```
┌─────────────────────────────────────────────┐
│  🔥 HOT LEADS (5)                           │
├─────────────────────────────────────────────┤
│  Maria Lopez                                │
│  Appt tomorrow 2pm • 2019 Civic             │
│  Good credit • Called 3x                    │
│  [VIEW DETAILS →]                           │
├─────────────────────────────────────────────┤
│  Juan Perez                                 │
│  Hot • 2020 Camry                           │
│  Needs to confirm appointment               │
│  [VIEW DETAILS →]                           │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│  ⏰ WARM LEADS (10)                         │
│  [View all...]                              │
└─────────────────────────────────────────────┘
```

**This Week's Calendar (Mini):**
```
┌─────────────────────────────────────────────┐
│  📅 UPCOMING APPOINTMENTS                   │
├─────────────────────────────────────────────┤
│  Today: 2 appointments                      │
│  Tomorrow: 3 appointments                   │
│  Rest of week: 4 appointments               │
│  [VIEW FULL CALENDAR →]                     │
└─────────────────────────────────────────────┘
```

**Inventory Status:**
```
┌─────────────────────────────────────────────┐
│  🚗 YOUR INVENTORY                          │
├─────────────────────────────────────────────┤
│  ● 12 Available for sale                    │
│  ● 3 Pending (in negotiation)               │
│  ● 2 Sold this week                         │
│  [MANAGE INVENTORY →]                       │
└─────────────────────────────────────────────┘
```

**Recent Activity Feed:**
```
┌─────────────────────────────────────────────┐
│  📋 RECENT ACTIVITY                         │
├─────────────────────────────────────────────┤
│  10 min ago: Maria Lopez - Appointment      │
│  confirmed for tomorrow                     │
├─────────────────────────────────────────────┤
│  1 hour ago: 2019 Civic posted to Facebook  │
│  Reached 450 people so far                  │
├─────────────────────────────────────────────┤
│  3 hours ago: Carlos Martinez - New lead    │
│  on 2021 F-150                              │
└─────────────────────────────────────────────┘
```

---

### 📊 REPORTS & ANALYTICS

#### Page: `/reports` (BDC View - Performance Dashboard)

**Date Range Selector (Top):**
```
┌─────────────────────────────────────────────┐
│  [Last 7 Days ▼] [This Month] [Custom]     │
└─────────────────────────────────────────────┘
```

**Key Metrics (Glanceable):**
```
┌─────────────────────────────────────────────┐
│  THIS WEEK                                  │
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌──────┐│
│  │   32   │ │   12   │ │  15%   │ │   4  ││
│  │ Calls  │ │ Appts  │ │ Conv   │ │Closed││
│  │  Made  │ │  Set   │ │ Rate   │ │      ││
│  └────────┘ └────────┘ └────────┘ └──────┘│
└─────────────────────────────────────────────┘
```

**Conversion Funnel (Visual):**
```
┌─────────────────────────────────────────────┐
│  📊 SALES FUNNEL                            │
├─────────────────────────────────────────────┤
│  82 Leads                                   │
│  ████████████████████████████ 100%          │
│                                             │
│  60 Contacted (73%)                         │
│  █████████████████████ 73%                  │
│                                             │
│  24 Appointments Set (29%)                  │
│  ████████ 29%                               │
│                                             │
│  17 Showed Up (71% show rate)               │
│  ██████ 21%                                 │
│                                             │
│  11 Closed (65% close rate)                 │
│  ████ 13%                                   │
└─────────────────────────────────────────────┘
```

**Performance Trends (Line Chart):**
```
┌─────────────────────────────────────────────┐
│  📈 TREND: LEADS PROCESSED                  │
│  [Last 4 Weeks]                             │
│  40│                                   •    │
│  30│              •           •             │
│  20│       •                                │
│  10│  •                                     │
│   0└─────────────────────────────────────   │
│     W1    W2    W3    W4                    │
└─────────────────────────────────────────────┘
```

**Top Performing Vehicles:**
```
┌─────────────────────────────────────────────┐
│  🚗 MOST INQUIRED VEHICLES                  │
├─────────────────────────────────────────────┤
│  1. Honda Civic (12 leads)                  │
│  2. Toyota Camry (9 leads)                  │
│  3. Ford F-150 (7 leads)                    │
└─────────────────────────────────────────────┘
```

---

#### Page: `/dealer/reports` (Dealer View - Enhanced Analytics)

**All BDC metrics PLUS:**

**ROI Summary:**
```
┌─────────────────────────────────────────────┐
│  💰 REVENUE & ROI                           │
├─────────────────────────────────────────────┤
│  Deals Closed: 11                           │
│  Average Commission: $350                   │
│  Total Revenue: $3,850                      │
│  Service Cost: $480                         │
│  Cost per Deal: $44                         │
│  ROI: 700%                                  │
└─────────────────────────────────────────────┘
```

**Agent Performance (if multiple agents):**
```
┌─────────────────────────────────────────────┐
│  👥 AGENT PERFORMANCE                       │
├─────────────────────────────────────────────┤
│  Dad's BDC                                  │
│  82 leads • 15% conversion • 11 deals       │
│  [View details →]                           │
└─────────────────────────────────────────────┘
```

---

## USER FLOWS

### FLOW 1: New Lead from Facebook → Call → Appointment → Close

**Trigger:** Lead messages on Facebook about 2019 Honda Civic

```
1. Facebook Webhook
   ↓
2. System creates lead automatically
   ↓
3. Auto-response sent within 60 seconds
   "Sí, el Civic está disponible. ¿Me permite su número?"
   ↓
4. Task created for Dad
   "Call Maria Lopez about 2019 Civic - New lead 2 min ago"
   ↓
5. Dad opens app → Sees task on dashboard
   ↓
6. Taps "CALL NOW" → Phone dials Maria
   ↓
7. During call → Dad swipes up for notes
   Types: "Interested, good credit, has trade-in"
   ↓
8. Call ends → Post-call modal appears
   Outcome: "Appointment Set"
   Next: "Book appointment"
   ↓
9. Redirected to quick booking
   Pre-filled: Maria Lopez, 2019 Civic
   Selects: Tomorrow 2pm, Test Drive
   ↓
10. Taps "CONFIRM"
    System sends SMS/Email confirmation to Maria
    ↓
11. Appointment appears on calendar
    Lead status → "Appointment Set"
    ↓
12. Next day → Maria shows up
    Dad marks appointment as "Completed"
    ↓
13. Test drive goes well → Maria wants to buy
    Dad goes to Lead Detail
    Taps "Mark Deal Closed"
    ↓
14. System prompts:
    "Mark 2019 Civic as sold?"
    Dad confirms
    ↓
15. Vehicle status → Sold
    Lead status → Closed/Won
    Dealer dashboard updates → +1 deal, +$350 commission
```

**Touchpoints:**
- Facebook Messenger
- `/dashboard` (task list)
- `/calls/active/[id]` (call interface)
- `/appointments/book` (booking)
- `/leads/[id]` (lead detail)
- `/inventory/[id]` (vehicle detail)

---

### FLOW 2: Dealer Adds New Inventory → BDC Sees It → Shares with Lead

**Trigger:** Dealer gets new car on lot

```
1. Dealer logs in → Dealer Dashboard
   ↓
2. Taps "+ ADD VEHICLE" (FAB)
   ↓
3. Opens `/inventory/new`
   ↓
4. Fills form:
   - Year: 2020
   - Make: Toyota
   - Model: Camry
   - Trim: LE
   - VIN: [Scans with camera]
   - Price: $22,000
   - Mileage: 32,000
   ↓
5. Uploads 6 photos from phone
   ↓
6. Reviews auto-generated description
   Edits slightly
   ↓
7. Taps "SAVE & POST TO FACEBOOK"
   ↓
8. Confirmation modal:
   "Post to Marketplace + Metro Honda Page?"
   Dealer taps "CONFIRM & POST"
   ↓
9. System:
   - Saves to database
   - Posts to Facebook
   - Sends notification to Dad: "New inventory: 2020 Camry"
   ↓
10. Dad gets notification
    Opens `/inventory`
    Sees new 2020 Camry at top
    ↓
11. Dad remembers Juan Perez wanted a Camry
    Taps vehicle card → Vehicle Detail
    ↓
12. Taps "SHARE WITH LEAD"
    Selects: Juan Perez
    ↓
13. Share modal opens
    Selects: SMS
    Reviews message preview
    Taps "SEND"
    ↓
14. Juan receives SMS with:
    - Photos
    - Price
    - Link to details
    ↓
15. Juan calls back interested
    Dad books appointment
    Links appointment to 2020 Camry
```

**Touchpoints:**
- `/dealer/dashboard`
- `/inventory/new`
- `/inventory` (Dad's view)
- `/inventory/[id]`
- `/leads/[id]`
- `/appointments/book`

---

### FLOW 3: Car Gets Sold → Update System → Close Leads

**Trigger:** Maria Lopez buys the 2019 Honda Civic

```
1. Dad marks deal as closed
   From: `/leads/[maria-id]`
   Taps: "Mark Deal Closed"
   ↓
2. Modal appears:
   "Select vehicle purchased:"
   [Dropdown shows: 2019 Honda Civic EX]
   Dad selects Civic
   ↓
3. System asks:
   "Mark this vehicle as sold?"
   "Note: 1 other active lead on this vehicle"
   Options: [Yes, Mark Sold] [No, Keep Available]
   ↓
4. Dad taps "Yes, Mark Sold"
   ↓
5. System automatically:
   - Lead (Maria) → Status: Closed/Won
   - Vehicle (Civic) → Status: Sold
   - Other lead (Juan) → Task created: "Civic sold, offer alternatives"
   - Dealer dashboard → +1 closed deal
   - Facebook post → Removed/marked sold
   ↓
6. Dad gets notification:
   "Juan Perez also wanted this Civic - suggest alternatives"
   ↓
7. Dad opens Juan's lead
   Taps "Share Vehicle"
   Filters inventory → Available Civics
   Selects 2018 Civic
   Sends to Juan
```

**Touchpoints:**
- `/leads/[id]` (Maria's detail)
- `/inventory/[id]` (Civic detail)
- `/dashboard` (notification about Juan)
- `/leads/[juan-id]` (Juan's detail)
- `/inventory` (finding alternatives)

---

### FLOW 4: Morning Routine (Dad Starts His Day)

**Trigger:** Dad arrives at dealership at 9am

```
1. Opens app → Auto-logs in (Face ID)
   Lands on: `/dashboard`
   ↓
2. Sees Hero Stats:
   "8 New Leads • 3 Appointments Today • 42% Conversion"
   ↓
3. Checks "URGENT" section:
   - 2 overdue calls
   - 1 appointment needs confirmation
   ↓
4. Taps first urgent task:
   "Call Maria Lopez - 2 hrs overdue"
   ↓
5. Taps "CALL NOW" → Makes call
   Updates outcome: "Appointment confirmed"
   ↓
6. Returns to dashboard
   Urgent section now shows: "1 urgent"
   ↓
7. Scrolls to "TODAY'S PRIORITIES"
   Sees 15 tasks
   ↓
8. Filters: Taps "Hot" chip
   Now sees only 5 hot leads
   ↓
9. Works through hot leads one by one
   - Call → Log → Next action
   ↓
10. Swipes to Calendar tab
    Reviews today's 3 appointments
    ↓
11. 10:30am appointment approaching
    Gets notification: "Maria Lopez arriving in 30 min"
    ↓
12. Swipes to Inventory tab
    Pulls up 2019 Civic details
    Reviews notes about Maria's needs
    ↓
13. Ready for showroom appointment
```

**Touchpoints:**
- `/login` (auto Face ID)
- `/dashboard` (main hub)
- `/calls/active/[id]` (multiple calls)
- `/leads` (filtered view)
- `/appointments` (calendar check)
- `/inventory/[id]` (prep for appointment)

---

### FLOW 5: Dealer Checks Weekly Performance

**Trigger:** Monday morning, dealer wants to see results

```
1. Dealer logs in → `/dealer/dashboard`
   ↓
2. Sees Hero Stats:
   "82 Leads (+12%) • 24 Appts • 11 Deals • $3,850 Due"
   ↓
3. Wants more detail → Taps "Reports" tab
   Opens: `/dealer/reports`
   ↓
4. Changes date range:
   From "Last 7 Days" to "This Month"
   ↓
5. Reviews funnel:
   82 leads → 60 contacted (73%)
   → 24 appointments (29%)
   → 17 showed (71% show rate)
   → 11 closed (65% close rate)
   ↓
6. Scrolls to ROI section:
   "Cost per deal: $44 • ROI: 700%"
   ↓
7. Satisfied with performance
   Swipes to "Active Leads" tab
   ↓
8. Sees 5 hot leads being worked
   Taps one to review progress
   ↓
9. Reads activity timeline:
   Sees Dad called 3 times, sent info, booked appointment
   ↓
10. Returns to dashboard
    Taps "Inventory"
    ↓
11. Sees 3 cars pending
    Clicks one to check performance:
    "1,200 reach • 5 inquiries • 2 appointments"
    ↓
12. Decides to add 2 more vehicles today
    Taps "+ ADD VEHICLE"
```

**Touchpoints:**
- `/dealer/dashboard`
- `/dealer/reports`
- `/dealer/leads`
- `/dealer/leads/[id]`
- `/dealer/inventory`
- `/dealer/inventory/[id]`
- `/inventory/new`

---

## DESIGN SYSTEM

### Color Palette (Liquid Glass + Brand)

**Primary Colors:**
```
Brand Primary:   #1E3A8A (Deep Blue - Trust, professionalism)
Primary Light:   #3B82F6 (Bright Blue - Interactive elements)
Primary Dark:    #1E40AF (Dark Blue - Headers, emphasis)
```

**Status Colors:**
```
Success:  #10B981 (Green - Confirmed, available, positive)
Warning:  #F59E0B (Amber - Pending, follow-up needed)
Danger:   #EF4444 (Red - Overdue, dead lead, sold)
Info:     #3B82F6 (Blue - Informational, neutral)
```

**Neutral Palette:**
```
Background (Light): #FFFFFF
Background (Dark):  #111827
Surface (Light):    #F9FAFB
Surface (Dark):     #1F2937
Border (Light):     #E5E7EB
Border (Dark):      #374151
Text Primary:       #111827 / #F9FAFB (light/dark mode)
Text Secondary:     #6B7280 / #9CA3AF (light/dark mode)
Text Tertiary:      #9CA3AF / #6B7280 (light/dark mode)
```

**Translucency (Liquid Glass):**
```
Card Background:     rgba(255, 255, 255, 0.7) + backdrop-blur
Overlay:             rgba(0, 0, 0, 0.5) + backdrop-blur
Hover State:         +10% opacity
Active State:        -10% opacity
```

---

### Typography

**Font Family:**
```
Primary: -apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", sans-serif
Monospace: "SF Mono", Consolas, monospace (for VIN, phone numbers)
```

**Type Scale:**
```
H1: 34pt / 44pt line height / 700 weight (Page titles)
H2: 28pt / 36pt line height / 600 weight (Section headers)
H3: 22pt / 28pt line height / 600 weight (Card titles)
Body: 17pt / 24pt line height / 400 weight (Main text)
Body Small: 15pt / 20pt line height / 400 weight (Secondary text)
Caption: 13pt / 18pt line height / 400 weight (Metadata, timestamps)
Label: 11pt / 16pt line height / 600 weight (Input labels, badges)
```

**Weight Hierarchy:**
```
Regular: 400 (Body text)
Medium: 500 (Subheadings)
Semibold: 600 (Headers)
Bold: 700 (Emphasis, CTAs)
```

---

### Spacing System (8pt Grid)

```
XXS: 4pt   (Icon spacing, tight padding)
XS:  8pt   (Compact spacing)
SM:  12pt  (Between related elements)
MD:  16pt  (Standard padding, card padding)
LG:  24pt  (Between sections)
XL:  32pt  (Page margins, major sections)
XXL: 48pt  (Hero section padding)
```

**Component Spacing:**
- Card padding: 16pt
- Button padding: 12pt vertical, 24pt horizontal
- Input padding: 12pt vertical, 16pt horizontal
- Between cards: 12pt
- Between sections: 24pt

---

### Touch Targets & Accessibility

**Minimum Sizes:**
```
Touch target: 44 x 44pt (Apple HIG standard)
Button height: 48pt (comfortable thumb reach)
Input height: 48pt
Icon size: 24pt (legible, tappable)
FAB size: 56 x 56pt
```

**Safe Zones:**
```
Bottom navigation: 16pt from screen edge
Top bar: Status bar + 8pt
Side margins: 16pt (mobile), 24pt (tablet)
FAB margins: 16pt from bottom-right corner
```

**Accessibility:**
- Minimum contrast ratio: 4.5:1 (WCAG AA)
- Focus indicators: 2pt solid outline
- Dynamic type support (scales with system settings)
- Voice Over support (all elements labeled)
- Reduced motion option (respects system preference)

---

### Shadows & Depth (Liquid Glass)

**Elevation Levels:**
```
Level 0 (Flat):
  box-shadow: none

Level 1 (Card):
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12),
              0 1px 2px rgba(0, 0, 0, 0.24)

Level 2 (Raised Card):
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.15),
              0 2px 4px rgba(0, 0, 0, 0.12)

Level 3 (Modal):
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15),
              0 3px 6px rgba(0, 0, 0, 0.10)

Level 4 (Floating):
  box-shadow: 0 15px 25px rgba(0, 0, 0, 0.15),
              0 5px 10px rgba(0, 0, 0, 0.05)
```

**Translucent Backgrounds (Liquid Glass):**
```
backdrop-filter: blur(20px) saturate(180%)
background: rgba(255, 255, 255, 0.7)
border: 1px solid rgba(255, 255, 255, 0.18)
```

---

### Animation & Transitions

**Duration:**
```
Instant: 0ms (toggle states)
Fast: 150ms (hover effects, tooltips)
Normal: 250ms (page transitions, modals)
Slow: 350ms (complex animations)
Very Slow: 500ms (attention-grabbing)
```

**Easing:**
```
Ease Out: cubic-bezier(0.0, 0.0, 0.2, 1) - Elements entering
Ease In: cubic-bezier(0.4, 0.0, 1, 1) - Elements exiting
Ease In Out: cubic-bezier(0.4, 0.0, 0.2, 1) - Movement
```

**Common Transitions:**
```
Fade In:
  opacity: 0 → 1
  duration: 250ms
  easing: ease-out

Slide Up (Modal):
  transform: translateY(100%) → translateY(0)
  duration: 350ms
  easing: ease-out

Scale In (Button press):
  transform: scale(1) → scale(0.95) → scale(1)
  duration: 150ms
  easing: ease-in-out

Swipe (Card action):
  transform: translateX(0) → translateX(-100px)
  duration: 250ms
  easing: ease-out
```

---

### Icons

**Icon Set:** SF Symbols (Apple) + Heroicons (fallback)

**Common Icons:**
```
Navigation:
- Home: house.fill
- Leads: list.bullet.rectangle
- Calendar: calendar
- Inventory: car.fill
- Reports: chart.bar.fill
- Profile: person.circle.fill

Actions:
- Add: plus.circle.fill
- Edit: pencil.circle.fill
- Delete: trash.fill
- Call: phone.fill
- Text: message.fill
- Email: envelope.fill
- Search: magnifyingglass

Status:
- Hot: flame.fill
- Warm: clock.fill
- Cold: snowflake
- Complete: checkmark.circle.fill
- Warning: exclamationmark.triangle.fill
- Error: xmark.circle.fill
```

---

### Component Library Structure

```
/components
├── /ui (Base components)
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── Select.tsx
│   ├── Checkbox.tsx
│   ├── Radio.tsx
│   ├── Switch.tsx
│   ├── Badge.tsx
│   ├── Avatar.tsx
│   ├── Card.tsx
│   ├── Modal.tsx
│   ├── Toast.tsx
│   ├── Dropdown.tsx
│   └── Tabs.tsx
│
├── /layout
│   ├── Header.tsx
│   ├── Sidebar.tsx
│   ├── BottomNav.tsx
│   ├── PageContainer.tsx
│   └── Section.tsx
│
├── /leads
│   ├── LeadCard.tsx
│   ├── LeadList.tsx
│   ├── LeadKanban.tsx
│   ├── LeadForm.tsx
│   ├── LeadDetail.tsx
│   ├── LeadStatusBadge.tsx
│   └── LeadTimeline.tsx
│
├── /appointments
│   ├── Calendar.tsx
│   ├── AppointmentCard.tsx
│   ├── QuickBooking.tsx
│   └── TimeSlotPicker.tsx
│
├── /inventory
│   ├── VehicleCard.tsx
│   ├── VehicleGrid.tsx
│   ├── VehicleForm.tsx
│   ├── VehicleDetail.tsx
│   ├── PhotoGallery.tsx
│   └── VehicleStatusBadge.tsx
│
├── /calls
│   ├── ActiveCall.tsx
│   ├── CallLogger.tsx
│   ├── CallHistory.tsx
│   └── QuickNotes.tsx
│
├── /reports
│   ├── MetricCard.tsx
│   ├── FunnelChart.tsx
│   ├── LineChart.tsx
│   ├── BarChart.tsx
│   └── PieChart.tsx
│
└── /shared
    ├── LoadingSpinner.tsx
    ├── ErrorBoundary.tsx
    ├── EmptyState.tsx
    ├── FilterBar.tsx
    └── SearchBar.tsx
```

---

## MOBILE OPTIMIZATION

### Mobile-First Principles

1. **Thumb-Friendly Design**
   - Primary actions within thumb reach (bottom 60% of screen)
   - Bottom navigation for main tabs
   - FAB in bottom-right corner
   - Top bar for context, not primary actions

2. **Gesture-Based Navigation**
   - Swipe left: Quick actions
   - Swipe right: Back/dismiss
   - Pull down: Refresh
   - Long-press: Context menu
   - Drag: Reorder (kanban)

3. **Progressive Disclosure**
   - Show essential info first
   - Expand sections as needed
   - Collapse completed sections
   - Hide advanced features in "More" menu

4. **Touch Targets**
   - Minimum 44 x 44pt
   - Spacing between tappable elements: 8pt minimum
   - Buttons: 48pt height
   - List items: 64pt minimum height

---

### Mobile-Specific UI Patterns

**Bottom Sheets** (Instead of modals)
- Swipe up to expand
- Swipe down to dismiss
- Partial view shows summary
- Full view shows details

**Pull-to-Refresh**
- Standard on all list views
- Spinner animation
- Haptic feedback on trigger

**Infinite Scroll**
- Load more as user scrolls
- Loading indicator at bottom
- "Load more" button fallback

**Sticky Headers**
- Section headers stick on scroll
- Page title shrinks to compact mode
- Quick actions remain accessible

---

### Offline Functionality (Future)

**Core offline features:**
- View cached leads
- View cached inventory
- Add notes (sync later)
- View appointments
- Read-only mode indicator

**Sync strategy:**
- Auto-sync on network restore
- Manual "Sync Now" button
- Conflict resolution (server wins)
- Offline indicator in top bar

---

## RESPONSIVE BREAKPOINTS

### Breakpoint System

```
Mobile Small:  320px - 374px (iPhone SE)
Mobile:        375px - 428px (iPhone 14 Pro Max)
Tablet:        744px - 1023px (iPad)
Desktop:       1024px+ (Desktop, large iPad)
```

### Layout Adaptations

**Mobile (375px):**
- Single column layout
- Bottom tab navigation
- Stacked cards (full width)
- Collapsible sections
- Minimal chrome

**Tablet (744px):**
- Two-column grid (inventory, leads)
- Side navigation drawer (swipe from left)
- Split view (list + detail)
- More actions visible (less "More" menu)

**Desktop (1024px+):**
- Persistent left sidebar
- Three-column grid (inventory)
- Multi-panel layouts (kanban full width)
- Hover states
- Keyboard shortcuts

---

### Component Responsiveness

**Cards:**
```
Mobile:   Full width - 32pt margin
Tablet:   2 columns - 48pt margin
Desktop:  3 columns - 64pt margin
```

**Navigation:**
```
Mobile:   Bottom tabs (5 items)
Tablet:   Bottom tabs or side drawer
Desktop:  Left sidebar (always visible)
```

**Forms:**
```
Mobile:   Stacked fields (1 column)
Tablet:   2 columns where logical
Desktop:  2-3 columns, side-by-side layout
```

**Tables:**
```
Mobile:   Card view (no tables)
Tablet:   Simplified table (fewer columns)
Desktop:  Full table with all columns
```

---

## DEVELOPMENT PRIORITY

### Phase 1: Core MVP (Week 1-2)

**Must-Have (Launch Blockers):**
1. ✅ Authentication (`/login`)
2. ✅ BDC Dashboard (`/dashboard`)
3. ✅ Lead List (`/leads`)
4. ✅ Lead Detail (`/leads/[id]`)
5. ✅ Create Lead (`/leads/new`)
6. ✅ Call Logging (post-call modal)
7. ✅ Appointment Calendar (`/appointments`)
8. ✅ Quick Booking (`/appointments/book`)
9. ✅ Inventory List (`/inventory`)
10. ✅ Add Vehicle (`/inventory/new`)
11. ✅ Vehicle Detail (`/inventory/[id]`)
12. ✅ Basic Reports (`/reports`)

**Build Order:**
```
Day 1-2: Project setup, auth, navigation shell
Day 3-4: Dashboard + task list
Day 5-6: Lead list + lead detail
Day 7-8: Appointment calendar + booking
Day 9-10: Inventory list + add vehicle
Day 11-12: Call logging + reports
Day 13-14: Integration + bug fixes
```

---

### Phase 2: Enhancement (Week 3)

**Nice-to-Have (Post-Launch Additions):**
1. ⭐ Kanban Pipeline (`/leads/pipeline`)
2. ⭐ Active Call Interface (`/calls/active/[id]`)
3. ⭐ Dealer Dashboard (`/dealer/dashboard`)
4. ⭐ Enhanced Reports (charts, trends)
5. ⭐ Lead Qualification Form (in lead detail)
6. ⭐ Vehicle Share Feature (SMS/WhatsApp)
7. ⭐ Facebook Post Integration
8. ⭐ Auto-response Templates (admin)

---

### Phase 3: Polish (Week 4+)

**Future Improvements:**
1. 🚀 Real-time notifications (WebSocket)
2. 🚀 Voice memos for notes
3. 🚀 Photo editing (crop, rotate)
4. 🚀 Advanced search/filters
5. 🚀 Export reports (PDF, Excel)
6. 🚀 Team management
7. 🚀 Multi-language support
8. 🚀 AI-powered insights (far future)

---

## TECHNICAL NOTES

### State Management

**Recommended:** React Context + Hooks (simple, sufficient for MVP)

**State Structure:**
```
- AuthContext: User, role, permissions
- LeadsContext: Active leads, filters
- AppointmentsContext: Calendar data
- InventoryContext: Vehicles, filters
- UIContext: Theme, sidebar state, modals
```

**Future (if needed):** Zustand or Redux Toolkit

---

### Data Fetching

**Strategy:** React Query (or SWR)
- Automatic caching
- Background refetching
- Optimistic updates
- Pagination support

**API Routes:**
```
/api/leads - GET, POST, PATCH, DELETE
/api/appointments - GET, POST, PATCH, DELETE
/api/inventory - GET, POST, PATCH, DELETE
/api/calls - POST (log call)
/api/reports - GET (metrics)
/api/auth - POST (login), GET (session)
```

---

### Performance Targets

**Core Web Vitals:**
- **LCP** (Largest Contentful Paint): < 2.5s
- **FID** (First Input Delay): < 100ms
- **CLS** (Cumulative Layout Shift): < 0.1

**Page Load Times:**
- Dashboard: < 1.5s
- Lead detail: < 1s
- Inventory list: < 2s (with images)

**Optimization Strategies:**
- Image lazy loading
- Route-based code splitting
- Prefetch on hover (links)
- Debounced search
- Virtual scrolling (long lists)

---

## APPENDIX

### Key UX Decisions

1. **Why task-focused dashboard for BDC?**
   - Dad's workflow is action-oriented
   - Needs to know "what's next" immediately
   - Reduces decision fatigue

2. **Why manual vehicle selection for leads?**
   - Starting simple to validate workflow
   - Auto-matching complex (multiple vehicles match)
   - Gives Dad flexibility to suggest alternatives

3. **Why require Facebook post confirmation?**
   - Prevents accidental posts
   - Dealer maintains control
   - Can review description before public

4. **Why filter inventory by dealer?**
   - Dad works with multiple dealers
   - Needs to know which inventory to offer
   - Avoids confusion/errors

5. **Why bottom navigation on mobile?**
   - Thumb-friendly (Apple HIG guideline)
   - Always accessible
   - Industry standard pattern

6. **Why translucent backgrounds (Liquid Glass)?**
   - Modern, premium feel
   - Visual hierarchy through depth
   - Aligns with iOS 26 design language

---

### Success Metrics

**User Experience:**
- Time to complete key tasks < 30 seconds
- Dad uses app daily without training
- Zero navigation confusion
- < 5 support questions per week

**Technical:**
- 99% uptime
- < 2s page loads
- < 5% error rate
- Mobile responsive on all devices

**Business:**
- Handles 100+ leads/month
- Tracks all appointments accurately
- Enables 15%+ conversion rate
- Saves Dad 10+ hours/week

---

**END OF DOCUMENT**

*This UX structure is a living document and will evolve based on user feedback during the 90-day pilot.*

*Next Steps:*
1. Review and approve this structure
2. Create visual mockups/wireframes
3. Begin frontend development
4. User testing with Dad
5. Iterate based on real usage

*For questions or clarifications, refer to the user flows and component specifications above.*
