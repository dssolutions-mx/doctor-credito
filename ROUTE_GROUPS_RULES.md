# Route Groups - Reglas de Organización del Proyecto

**Última actualización:** Diciembre 2024  
**Proyecto:** Doctor del Crédito - BDC System

---

## 📋 Regla General

**Usa Route Groups `(nombre)` cuando:**
- ✅ Varias páginas comparten el mismo layout (sidebar, RoleProvider, etc.)
- ✅ Quieres organizar páginas relacionadas sin afectar las URLs
- ✅ Las URLs NO necesitan un prefijo específico (ej: `/dashboard`, `/leads`)

**NO uses Route Groups cuando:**
- ❌ La página tiene un layout único y diferente
- ❌ La página no tiene layout personalizado (usa el root)
- ❌ Solo hay 1-2 páginas con ese layout específico
- ❌ **Las URLs necesitan un prefijo específico** (ej: `/dealer/dashboard` → usa carpeta normal `dealer/`)

**⚠️ Regla Crítica:** Los route groups `(nombre)` NO afectan las URLs. Si necesitas que una ruta tenga un prefijo específico (como `/dealer/`), usa una carpeta normal, NO un route group.

---

## 🏗️ Estructura Actual del Proyecto

```
app/
├── layout.tsx                    # Root layout (HTML, body, globals.css)
│
├── (dashboard)/                  # Route Group: BDC Agent Pages
│   ├── layout.tsx               # Sidebar + RoleProvider (BDC)
│   ├── dashboard/page.tsx       → URL: /dashboard
│   ├── leads/                   → URL: /leads
│   ├── appointments/            → URL: /appointments
│   ├── inventory/               → URL: /inventory
│   ├── tasks/                   → URL: /tasks
│   ├── reports/                 → URL: /reports
│   ├── profile/                 → URL: /profile
│   └── settings/                → URL: /settings
│
├── dealer/                       # Carpeta normal (NO route group)
│   ├── layout.tsx               # Sidebar + RoleProvider (Dealer)
│   ├── dashboard/page.tsx       → URL: /dealer/dashboard
│   ├── inventory/               → URL: /dealer/inventory
│   ├── leads/                   → URL: /dealer/leads
│   └── reports/                 → URL: /dealer/reports
│
├── calls/                        # Fuera del route group (layout único)
│   ├── layout.tsx               # Solo RoleProvider (SIN sidebar)
│   ├── active/[id]/page.tsx     → URL: /calls/active/[id]
│   └── history/page.tsx         → URL: /calls/history
│
├── login/                        # Sin layout (usa root)
│   └── page.tsx                 → URL: /login
│
├── forgot-password/              # Sin layout (usa root)
│   └── page.tsx                 → URL: /forgot-password
│
└── page.tsx                      # Home page
```

---

## 📐 Reglas Específicas por Sección

### 1. Route Group `(dashboard)` - BDC Agent

**Layout compartido:**
- Sidebar de navegación (AppSidebar)
- RoleProvider con rol "agent"
- Estructura: Sidebar + Main content

**Páginas que pertenecen aquí:**
- `/dashboard` - Dashboard principal
- `/leads` - Gestión de leads
- `/appointments` - Calendario de citas
- `/inventory` - Catálogo de vehículos
- `/tasks` - Gestión de tareas
- `/reports` - Reportes y analytics
- `/profile` - Perfil de usuario
- `/settings` - Configuración

**Regla:** Si una nueva página necesita el sidebar de BDC Agent, debe ir dentro de `(dashboard)/`

---

### 2. Carpeta `dealer/` - Dealer Pages

**⚠️ IMPORTANTE:** `dealer/` NO es un route group porque necesita el prefijo `/dealer/` en las URLs.

**Layout compartido:**
- Sidebar de navegación (AppSidebar)
- RoleProvider con rol "dealer"
- Estructura: Sidebar + Main content

**Páginas que pertenecen aquí:**
- `/dealer/dashboard` - Dashboard del dealer
- `/dealer/inventory` - Inventario del dealer
- `/dealer/leads` - Leads del dealer
- `/dealer/reports` - Reportes del dealer

**Regla:** Todas las páginas que empiezan con `/dealer/` deben estar dentro de `dealer/` (carpeta normal, NO route group)

**¿Por qué NO es route group?**
- Los route groups `(nombre)` NO afectan las URLs
- Si fuera `(dealer)/dashboard/page.tsx` → URL sería `/dashboard` (conflicto con BDC)
- Necesitamos `/dealer/dashboard`, por eso usamos carpeta normal `dealer/`

---

### 3. Carpeta `calls/` - Fuera del Route Group

**Layout único:**
- Solo RoleProvider
- SIN sidebar (pantallas full-screen)
- Diseñado para interfaz de llamadas

**Páginas:**
- `/calls/active/[id]` - Interfaz de llamada activa
- `/calls/history` - Historial de llamadas

**Regla:** Páginas con layout único (sin sidebar) NO van en route groups

---

### 4. Páginas sin Layout Personalizado

**Páginas que usan solo el root layout:**
- `/login` - Pantalla de login
- `/forgot-password` - Recuperación de contraseña
- `/` - Home page

**Regla:** Si una página no necesita sidebar ni layout especial, va directamente en `app/`

---

## 🚫 Errores Comunes a Evitar

### ❌ Error 1: Crear route group para 1-2 páginas
```
❌ MAL:
app/
├── (auth)/
│   ├── layout.tsx
│   └── login/page.tsx

✅ BIEN:
app/
└── login/page.tsx
```

### ❌ Error 2: Poner páginas con layouts diferentes en el mismo route group
```
❌ MAL:
app/
├── (dashboard)/
│   ├── layout.tsx          # Con sidebar
│   ├── dashboard/page.tsx
│   └── calls/              # SIN sidebar (layout diferente)
│       └── layout.tsx

✅ BIEN:
app/
├── (dashboard)/
│   ├── layout.tsx          # Con sidebar
│   └── dashboard/page.tsx
└── calls/                  # Fuera, layout diferente
    └── layout.tsx
```

### ❌ Error 3: Duplicar carpetas dentro y fuera del route group
```
❌ MAL:
app/
├── (dashboard)/
│   └── dashboard/page.tsx
└── dashboard/page.tsx      # DUPLICADO - causa error de build

✅ BIEN:
app/
└── (dashboard)/
    └── dashboard/page.tsx
```

---

## ✅ Checklist para Nuevas Páginas

Antes de crear una nueva página, pregúntate:

1. **¿Necesita sidebar?**
   - ✅ Sí → ¿Es para BDC Agent o Dealer?
     - BDC Agent → `(dashboard)/nueva-pagina/`
     - Dealer → `(dealer)/nueva-pagina/`
   - ❌ No → Continúa con pregunta 2

2. **¿Necesita RoleProvider u otro layout especial?**
   - ✅ Sí → Crea carpeta con `layout.tsx` propio
   - ❌ No → Va directamente en `app/`

3. **¿Hay otras páginas con el mismo layout?**
   - ✅ Sí → Considera crear un route group
   - ❌ No → Carpeta individual con su propio layout

---

## 📝 Ejemplos de Decisión

### Ejemplo 1: Nueva página "Notifications"
**Pregunta:** ¿Necesita sidebar? → Sí, es para BDC Agent  
**Decisión:** `app/(dashboard)/notifications/page.tsx`

### Ejemplo 2: Nueva página "Help Center"
**Pregunta:** ¿Necesita sidebar? → No, es pantalla simple  
**Pregunta:** ¿Necesita layout especial? → No  
**Decisión:** `app/help/page.tsx`

### Ejemplo 3: Nueva página "Dealer Settings"
**Pregunta:** ¿Necesita sidebar? → Sí, es para Dealer  
**Pregunta:** ¿La URL debe empezar con `/dealer/`? → Sí  
**Decisión:** `app/dealer/settings/page.tsx` (carpeta normal, NO route group)

### Ejemplo 4: Nueva página "Video Call" (full-screen)
**Pregunta:** ¿Necesita sidebar? → No, es full-screen  
**Pregunta:** ¿Necesita RoleProvider? → Sí  
**Decisión:** `app/video-call/layout.tsx` y `app/video-call/page.tsx` (fuera de route groups)

---

## 🔄 Migración de Páginas Existentes

Si necesitas mover una página existente:

1. **Identifica su layout actual**
2. **Determina si comparte layout con otras páginas**
3. **Mueve a la ubicación correcta según las reglas**
4. **Actualiza todas las referencias de rutas**
5. **Ejecuta `npm run build` para verificar**

---

## 📚 Referencias

- [Next.js Route Groups Documentation](https://nextjs.org/docs/app/building-your-application/routing/route-groups)
- [Next.js Layouts Documentation](https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts)

---

## ✅ Build Verification

Después de cualquier cambio en la estructura:
```bash
npm run build
```

El build debe completarse sin errores y mostrar todas las rutas correctamente.

---

**Mantén este documento actualizado cuando agregues nuevas secciones o cambies la estructura del proyecto.**

