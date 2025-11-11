# MANUAL DE PRUEBAS - DOCTOR DEL CRÉDITO

**Para:** Papá | Sistema BDC Web App

---

## 🎯 OBJETIVO DE ESTAS PRUEBAS

Este manual te guía paso a paso para que pruebes cada función del sistema y nos digas:

✅ **¿Qué funciona bien?** - Lo que te gusta y te ayuda  
⚠️ **¿Qué se siente confuso?** - Lo que no entiendes o es difícil  
❌ **¿Qué está mal?** - Lo que no funciona o hace algo raro  
💡 **¿Qué falta?** - Ideas de cosas que necesitas

**NO necesitas saber de tecnología.** Solo úsalo como lo usarías en tu trabajo diario.

**IMPORTANTE:** Esta es una versión de prueba sin conexión a base de datos real. Los datos que ves son de ejemplo (mock data) para que puedas probar todas las funciones. Cuando guardes algo, puede que no se guarde realmente, pero podrás ver cómo funcionaría.

---

## 📱 CÓMO ACCEDER AL SISTEMA

1. Abre tu navegador (Chrome, Safari, o el que uses)
2. Ve a la URL que Juan te proporcionará
3. Inicia sesión con tus credenciales (si hay login implementado)

**Nota:** Si no hay login aún, simplemente navega directamente a las páginas.

---

## 📊 FLUJO 1: DASHBOARD (Vista Principal)

**¿Qué hace?**  
Es tu "centro de comando" donde ves todo de un vistazo cuando llegas en la mañana.

### Prueba esto:

#### PASO 1: Revisar Métricas del Día

1. Cuando entres al sistema, deberías ver el Dashboard automáticamente
2. En la parte superior verás 4 tarjetas con números:
   - **Leads Activos** (ejemplo: 24)
   - **Citas de Hoy** (ejemplo: 8)
   - **Vehículos Disponibles** (ejemplo: 156)
   - **Tasa de Conversión** (ejemplo: 32%)

**Preguntas para ti:**

- [ ] ¿Ves los números claramente?
- [ ] ¿Los números tienen sentido para ti?
- [ ] ¿Te gustaría ver otras métricas aquí? ¿Cuáles?

---

#### PASO 2: Revisar Leads Recientes

1. En la sección "Leads Recientes" deberías ver una lista de leads
2. Cada lead muestra:
   - Nombre del cliente
   - Vehículo de interés
   - Estado (Nuevo, Contactado, Cita, etc.)
   - Botones para llamar o enviar mensaje

**Prueba:**

- [ ] Haz clic en un lead de la lista
- [ ] ¿Se abre un panel lateral (sheet) con los detalles del lead?
- [ ] Haz clic en el botón de teléfono 📞 en el lead
- [ ] ¿Se abre algo? (Nota: puede que no llame realmente porque es prueba)
- [ ] Haz clic en "Ver todos" arriba a la derecha
- [ ] ¿Te lleva a la lista completa de leads?

**Preguntas:**

- [ ] ¿La información que ves es útil?
- [ ] ¿Falta algo importante que necesitas ver aquí?
- [ ] ¿Los botones son fáciles de encontrar?

---

#### PASO 3: Revisar Citas de Hoy

1. En la sección "Citas de Hoy" deberías ver las citas programadas
2. Cada cita muestra:
   - Hora
   - Nombre del cliente
   - Vehículo
   - Tipo de cita

**Prueba:**

- [ ] Haz clic en una cita
- [ ] ¿Se abre algo con los detalles?
- [ ] Haz clic en "Ver calendario"
- [ ] ¿Te lleva a la vista del calendario completo?

**Preguntas:**

- [ ] ¿Es fácil ver qué citas tienes hoy?
- [ ] ¿Te gustaría ver más información aquí? ¿Qué?

---

#### PASO 4: Probar Acciones Rápidas

1. En la parte inferior del Dashboard hay una sección "Acciones Rápidas"
2. Deberías ver botones para:
   - Agregar Nuevo Lead
   - Agendar Cita
   - Registrar Llamada
   - Enviar Mensaje

**Prueba cada uno:**

- [ ] Haz clic en "Agregar Nuevo Lead"
  - ¿Te lleva a un formulario?
  - ¿Es fácil de llenar?

- [ ] Haz clic en "Agendar Cita"
  - ¿Te lleva a un formulario para agendar?
  - ¿Puedes seleccionar fecha y hora?

- [ ] Haz clic en "Registrar Llamada"
  - ¿Qué pasa? ¿Se abre algo?

- [ ] Haz clic en "Enviar Mensaje"
  - ¿Qué pasa? ¿Se abre algo?

**Preguntas:**

- [ ] ¿Estas acciones rápidas te ayudan?
- [ ] ¿Falta alguna acción que usas mucho?
- [ ] ¿Están en un lugar fácil de encontrar?

---

## 📋 FLUJO 2: GESTIÓN DE LEADS

**¿Qué hace?**  
Aquí ves y gestionas todos tus leads (clientes potenciales).

### Prueba esto:

#### PASO 1: Ver Lista de Leads

1. En el menú lateral (o menú inferior en móvil), haz clic en "Leads" o "📋 Leads"
2. Deberías ver una lista de todos los leads

**Observa:**

- [ ] ¿Ves la lista de leads?
- [ ] ¿Cada lead muestra información útil? (nombre, teléfono, email, vehículo de interés, estado)
- [ ] ¿Hay una barra de búsqueda arriba?
- [ ] ¿Hay filtros? ¿Dónde están? (deberías ver filtros por Estado y Fuente)

**Prueba los filtros:**

- [ ] Haz clic en el filtro de "Estado" y selecciona "Nuevo"
- [ ] ¿Se filtran los leads mostrando solo los nuevos?
- [ ] Prueba cambiar el filtro a "Contactado"
- [ ] ¿Funciona el filtro?
- [ ] Prueba el filtro de "Fuente" (Facebook, Website, etc.)
- [ ] ¿Funciona?

---

#### PASO 2: Ver Detalles de un Lead (Panel Lateral)

1. Haz clic en cualquier lead de la lista
2. Deberías ver un panel que se desliza desde la derecha (sheet) con los detalles

**Observa las pestañas (tabs):**

- [ ] ¿Ves pestañas que dicen: "Detalles", "Actividad", "Notas"?
- [ ] Haz clic en cada pestaña
- [ ] ¿Cambia el contenido?

**En la pestaña "Detalles":**

- [ ] ¿Ves la información de contacto? (email, teléfono)
- [ ] ¿Ves el vehículo de interés?
- [ ] ¿Ves el rango de presupuesto?
- [ ] ¿Ves la fuente del lead?
- [ ] ¿Ves la prioridad?
- [ ] ¿Hay un selector para cambiar el estado del lead?

**En la pestaña "Actividad":**

- [ ] ¿Ves un historial de actividades? (llamadas, notas, cambios de estado)
- [ ] ¿Está ordenado por fecha?

**En la pestaña "Notas":**

- [ ] ¿Ves las notas existentes del lead?
- [ ] ¿Hay un campo para agregar una nueva nota?
- [ ] ¿Hay un botón "Agregar Nota"?

**Prueba los botones de acción:**

- [ ] ¿Ves botones para "Llamar", "Correo", "SMS" arriba?
- [ ] Haz clic en "Llamar"
- [ ] ¿Se abre algo? (puede que no llame realmente)

**Preguntas:**

- [ ] ¿Toda la información que necesitas está visible?
- [ ] ¿Es fácil encontrar lo que buscas?
- [ ] ¿Falta algo importante?

---

#### PASO 3: Ver Detalles de un Lead (Página Completa)

1. Desde la lista de leads, haz clic en un lead
2. Si hay un botón o enlace que diga "Ver detalles completos" o similar, haz clic
3. O simplemente navega a `/leads/[id]` (Juan te puede ayudar con esto)

**Observa:**

- [ ] ¿Ves una página completa con todos los detalles del lead?
- [ ] ¿Hay más información aquí que en el panel lateral?
- [ ] ¿Ves pestañas? (Actividad, Notas, Calificación, Información)

**Prueba las pestañas:**

- [ ] **Pestaña "Actividad":** ¿Ves la línea de tiempo de actividades?
- [ ] **Pestaña "Notas":** ¿Puedes agregar notas?
- [ ] **Pestaña "Calificación":** ¿Hay un formulario de calificación?
- [ ] **Pestaña "Información":** ¿Ves todos los datos del lead?

**Prueba los botones de acción:**

- [ ] ¿Hay un botón grande "Llamar Ahora"?
- [ ] ¿Hay botones para "Enviar SMS" y "Enviar Correo"?
- [ ] ¿Hay un botón "Agendar Cita"?
- [ ] ¿Funcionan estos botones?

**Prueba las acciones rápidas:**

- [ ] ¿Hay botones para "Marcar como Calificado", "Programar Seguimiento", "Compartir Vehículo", "Marcar Venta Cerrada"?
- [ ] ¿Funcionan?

**Preguntas:**

- [ ] ¿Prefieres ver los detalles en el panel lateral o en la página completa?
- [ ] ¿Toda la información que necesitas está aquí?

---

#### PASO 4: Crear un Nuevo Lead

1. Desde la lista de leads, busca el botón "+" o "Nuevo Lead" o "Agregar Nuevo Lead"
2. Haz clic para crear un nuevo lead

**Prueba llenar el formulario:**

- [ ] ¿Puedes ingresar nombre y apellido?
- [ ] ¿Puedes ingresar teléfono?
- [ ] ¿Puedes ingresar email?
- [ ] ¿Puedes seleccionar la fuente? (Facebook, Website, Teléfono, Referido, Visita Directa)
- [ ] ¿Puedes seleccionar la prioridad? (Baja, Media, Alta, Urgente)
- [ ] ¿Puedes ingresar el vehículo de interés?
- [ ] ¿Puedes ingresar el presupuesto?
- [ ] ¿Puedes agregar notas?
- [ ] ¿Hay un botón "Crear Lead" o "Guardar"?

**Prueba guardar:**

- [ ] Llena el formulario con datos de prueba
- [ ] Haz clic en "Crear Lead"
- [ ] ¿Qué pasa? (Nota: puede que no se guarde realmente porque es prueba, pero deberías ver algún mensaje o redirección)

**Preguntas:**

- [ ] ¿El formulario es fácil de llenar?
- [ ] ¿Todos los campos son claros?
- [ ] ¿Falta algún campo importante?
- [ ] ¿Hay algún campo que no necesitas?

---

## 📅 FLUJO 3: CALENDARIO Y CITAS

**¿Qué hace?**  
Aquí ves y gestionas todas tus citas con clientes.

### Prueba esto:

#### PASO 1: Ver Calendario

1. En el menú, haz clic en "Citas" o "📅 Calendar" o "Appointments"
2. Deberías ver una página con tus citas

**Observa la parte superior:**

- [ ] ¿Ves tarjetas con estadísticas? (Total de Citas, Hoy, Confirmadas, Pendientes)
- [ ] ¿Los números tienen sentido?

**Observa el contenido principal:**

- [ ] ¿Ves dos pestañas? ("Vista de Calendario" y "Vista de Lista")
- [ ] ¿Cuál está seleccionada por defecto?

**Prueba la Vista de Calendario:**

- [ ] Haz clic en la pestaña "Vista de Calendario"
- [ ] ¿Ves un calendario con las citas marcadas?
- [ ] ¿Puedes hacer clic en una cita del calendario?
- [ ] ¿Se abren los detalles?

**Prueba la Vista de Lista:**

- [ ] Haz clic en la pestaña "Vista de Lista"
- [ ] ¿Ves una lista de todas las citas?
- [ ] ¿Cada cita muestra: fecha, hora, cliente, vehículo, tipo de cita, estado?
- [ ] ¿Están ordenadas por fecha?
- [ ] Haz clic en una cita de la lista
- [ ] ¿Se abren los detalles?

**Preguntas:**

- [ ] ¿Prefieres ver el calendario o la lista?
- [ ] ¿Es fácil ver qué citas tienes hoy?
- [ ] ¿Te gustaría ver más información aquí? ¿Qué?

---

#### PASO 2: Ver Detalles de una Cita

1. Haz clic en cualquier cita (del calendario o de la lista)
2. Deberías ver un diálogo o panel con los detalles

**Observa:**

- [ ] ¿Ves toda la información del cliente? (nombre, teléfono, email)
- [ ] ¿Ves el vehículo relacionado?
- [ ] ¿Ves el tipo de cita?
- [ ] ¿Ves el estado (Confirmada, Pendiente, etc.)?
- [ ] ¿Ves la fecha y hora?
- [ ] ¿Ves la duración?
- [ ] ¿Ves notas?

**Prueba las acciones:**

- [ ] ¿Puedes llamar al cliente desde aquí?
- [ ] ¿Puedes enviar un recordatorio?
- [ ] ¿Puedes reprogramar la cita?
- [ ] ¿Puedes cancelar la cita?
- [ ] ¿Puedes marcar la cita como completada?

**Preguntas:**

- [ ] ¿Toda la información que necesitas está aquí?
- [ ] ¿Las acciones son fáciles de encontrar?

---

#### PASO 3: Agendar una Nueva Cita

1. Busca el botón "+" o "Nueva Cita" o "Agendar Cita" en la página de citas
2. Haz clic para crear una nueva cita

**Prueba llenar el formulario:**

**Sección "Customer Information":**

- [ ] ¿Puedes seleccionar un lead de una lista desplegable?
- [ ] ¿Puedes ingresar el nombre del cliente manualmente?
- [ ] ¿Puedes ingresar el teléfono?
- [ ] ¿Puedes ingresar el vehículo de interés?

**Sección "Detalles de la Cita":**

- [ ] ¿Puedes seleccionar una fecha? (debería haber un calendario)
- [ ] ¿Puedes seleccionar una hora? (debería haber una lista de horarios disponibles)
- [ ] ¿Puedes seleccionar el tipo de cita? (Prueba de Manejo, Aprobación de Crédito, Entrega, Evaluación de Cambio, Consulta)
- [ ] ¿Puedes seleccionar la duración? (30 min, 1 hora, etc.)
- [ ] ¿Puedes agregar notas?

**Sección "Confirmation":**

- [ ] ¿Hay información sobre confirmación automática por SMS y email?

**Prueba guardar:**

- [ ] Llena el formulario con datos de prueba
- [ ] Haz clic en "Confirmar Cita" o "Guardar"
- [ ] ¿Qué pasa? (Nota: puede que no se guarde realmente porque es prueba)

**Preguntas:**

- [ ] ¿El proceso de agendar es fácil?
- [ ] ¿Te muestra horas disponibles?
- [ ] ¿Te avisa si hay conflictos (dos citas a la misma hora)?
- [ ] ¿Falta algo en el proceso?



## 🚗 FLUJO 4: INVENTARIO DE VEHÍCULOS

**¿Qué hace?**  
Aquí ves y gestionas todos los vehículos disponibles para vender.

### Prueba esto:

#### PASO 1: Ver Lista de Inventario

1. En el menú, haz clic en "Inventario" o "🚗 Inventory"
2. Deberías ver una página con el inventario

**Observa la parte superior:**

- [ ] ¿Ves tarjetas con estadísticas? (Inventario Total, Disponibles, Pendientes, Valor Total)
- [ ] ¿Los números tienen sentido?

**Observa los filtros:**

- [ ] ¿Hay una barra de búsqueda?
- [ ] ¿Hay un filtro por marca?
- [ ] ¿Hay un filtro por estado? (Disponible, Pendiente, Vendido)

**Prueba los filtros:**

- [ ] Escribe algo en la búsqueda (ej: "Honda")
- [ ] ¿Se filtran los vehículos?
- [ ] Selecciona una marca en el filtro
- [ ] ¿Funciona el filtro?
- [ ] Selecciona un estado
- [ ] ¿Funciona?

**Observa la cuadrícula de vehículos:**

- [ ] ¿Ves los vehículos en tarjetas o cuadrícula?
- [ ] ¿Cada vehículo muestra: foto, año, marca, modelo, precio, millas, estado?
- [ ] ¿Hay un botón para ver detalles?

**Preguntas:**

- [ ] ¿Es fácil encontrar un vehículo específico?
- [ ] ¿Los filtros te ayudan?
- [ ] ¿Falta algún filtro que necesitas?

---

#### PASO 2: Ver Detalles de un Vehículo

1. Haz clic en cualquier vehículo de la lista
2. Deberías ver un diálogo o panel con los detalles

**Observa:**

- [ ] ¿Ves una galería de fotos?
- [ ] ¿Puedes pasar las fotos?
- [ ] ¿Ves toda la información del vehículo? (año, marca, modelo, trim, precio, millas, color, VIN, stock)
- [ ] ¿Ves el estado (Disponible, Pendiente, Vendido)?

**Prueba las acciones:**

- [ ] ¿Hay un botón para compartir el vehículo con un lead?
- [ ] ¿Funciona el botón de compartir?
- [ ] ¿Puedes ver qué leads están interesados en este vehículo?
- [ ] ¿Puedes editar la información del vehículo?

**Preguntas:**

- [ ] ¿Toda la información que necesitas está visible?
- [ ] ¿Es fácil compartir vehículos con clientes?

---

#### PASO 3: Agregar un Nuevo Vehículo

1. Busca el botón "+" o "Agregar Vehículo" o "Add Vehicle"
2. Haz clic para agregar un nuevo vehículo

**Prueba llenar el formulario:**

**Sección "Basic Information":**

- [ ] ¿Puedes ingresar año, marca, modelo?
- [ ] ¿Puedes ingresar trim y color?

**Sección "Identification":**

- [ ] ¿Puedes ingresar VIN?
- [ ] ¿Hay un botón para escanear VIN con la cámara? (puede que no funcione realmente)
- [ ] ¿Puedes ingresar número de stock?

**Sección "Pricing & Details":**

- [ ] ¿Puedes ingresar precio?
- [ ] ¿Puedes ingresar millas?
- [ ] ¿Puedes agregar una descripción?

**Sección "Photos":**

- [ ] ¿Hay un área para subir fotos?
- [ ] ¿Puedes hacer clic para seleccionar fotos? (Nota: puede que no suba realmente porque es prueba)

**Sección "Facebook Posting":**

- [ ] ¿Hay una casilla para publicar en Facebook?
- [ ] ¿Puedes marcarla o desmarcarla?

**Prueba guardar:**

- [ ] Llena el formulario con datos de prueba
- [ ] Haz clic en "Guardar Vehículo" o "Guardar y Publicar en Facebook"
- [ ] ¿Qué pasa? (Nota: puede que no se guarde realmente porque es prueba)

**Preguntas:**

- [ ] ¿El formulario es fácil de llenar?
- [ ] ¿Todos los campos son necesarios?
- [ ] ¿Falta algún campo importante?
- [ ] ¿El proceso de subir fotos es fácil?

---

## 📞 FLUJO 5: REGISTRO DE LLAMADAS

**¿Qué hace?**  
Aquí registras las llamadas que haces a los clientes.

### Prueba esto:

#### PASO 1: Registrar una Llamada desde un Lead

1. Ve a la lista de leads
2. Haz clic en el botón de teléfono 📞 en cualquier lead
3. O haz clic en un lead y luego en el botón "Llamar"

**Observa:**

- [ ] ¿Se abre un modal o diálogo para registrar la llamada?
- [ ] ¿Dice el nombre del lead en el título?

**Prueba llenar el formulario:**

- [ ] ¿Ves opciones para el resultado de la llamada?
  - Contestó - Hablé con el lead
  - Dejé mensaje de voz
  - No contestó
  - Número incorrecto
- [ ] ¿Puedes seleccionar una opción?

**Si seleccionaste "Contestó - Hablé con el lead":**

- [ ] ¿Aparece un campo para "Próxima Acción"?
- [ ] ¿Puedes seleccionar: Agendar cita, Programar seguimiento, Enviar información, Marcar como calificado, No está interesado?

**Campo de Notas:**

- [ ] ¿Hay un campo para agregar notas sobre la llamada?
- [ ] ¿Puedes escribir notas?

**Prueba guardar:**

- [ ] Selecciona un resultado
- [ ] Si contestó, selecciona una próxima acción
- [ ] Agrega algunas notas
- [ ] Haz clic en "Guardar Registro de Llamada" o "Guardar y Agendar Cita"
- [ ] ¿Qué pasa? (Nota: puede que no se guarde realmente porque es prueba)

**Preguntas:**

- [ ] ¿Es fácil registrar las llamadas?
- [ ] ¿Tienes todas las opciones que necesitas?
- [ ] ¿Falta algo importante?

---

#### PASO 2: Registrar una Llamada desde el Dashboard

1. Ve al Dashboard
2. Busca la sección "Acciones Rápidas"
3. Haz clic en "Registrar Llamada"

**Observa:**

- [ ] ¿Se abre el mismo modal de registro de llamada?
- [ ] ¿Puedes seleccionar el lead desde aquí o tienes que escribir el nombre?

**Preguntas:**

- [ ] ¿Es útil tener esta opción en el Dashboard?
- [ ] ¿Prefieres registrar llamadas desde el lead o desde el Dashboard?

---

## 📊 FLUJO 6: REPORTES

**¿Qué hace?**  
Aquí ves estadísticas y reportes de tu trabajo.

### Prueba esto:

#### PASO 1: Ver Reportes

1. En el menú, haz clic en "Reportes" o "📊 Reports"
2. Deberías ver una página con estadísticas

**Observa la parte superior:**

- [ ] ¿Ves un selector de período? (Últimos 7 días, 30 días, 90 días, Este año)
- [ ] ¿Puedes cambiar el período?

**Observa las métricas principales:**

- [ ] ¿Ves tarjetas con: Total Leads, Appointments, Customers, Revenue, Conversion?
- [ ] ¿Los números tienen sentido?
- [ ] ¿Ves porcentajes de cambio? (ej: "+12% from last month")

**Observa las pestañas:**

- [ ] ¿Ves pestañas: "Performance", "Lead Analytics", "Appointments"?
- [ ] Haz clic en cada pestaña

**Pestaña "Performance":**

- [ ] ¿Ves gráficos de líneas mostrando tendencias mensuales?
- [ ] ¿Ves un gráfico de barras de ingresos?
- [ ] ¿Los gráficos son fáciles de entender?

**Pestaña "Lead Analytics":**

- [ ] ¿Ves un gráfico circular (pie chart) de fuentes de leads?
- [ ] ¿Ves un gráfico de barras del embudo de conversión de leads?
- [ ] ¿Ves métricas de actividad? (Llamadas telefónicas, SMS enviados, Tiempo promedio de respuesta, Seguimientos)

**Pestaña "Appointments":**

- [ ] ¿Ves un gráfico circular de tipos de citas?
- [ ] ¿Ves estadísticas de estado de citas?
- [ ] ¿Ves métricas de desempeño? (Tasa de asistencia, Duración promedio, Conversión)

**Sección "Team Performance":**

- [ ] ¿Ves una tabla o lista con el desempeño del equipo?
- [ ] ¿Muestra: Leads, Appointments, Sales, Conversion para cada agente?

**Preguntas:**

- [ ] ¿Las métricas que ves son útiles?
- [ ] ¿Te ayudan a entender tu desempeño?
- [ ] ¿Falta alguna métrica importante?
- [ ] ¿Los gráficos son fáciles de entender?

---

## 🏢 FLUJO 7: VISTA DE CONCESIONARIO (DEALER)

**¿Qué hace?**  
Esta es la vista que vería el dealer/concesionario.

### Prueba esto:

#### PASO 1: Ver Dashboard del Dealer

1. Navega a `/dealer/dashboard` (o busca en el menú si hay opción para cambiar de vista)
2. Deberías ver un dashboard diferente

**Observa las métricas principales:**

- [ ] ¿Ves tarjetas con: Total Revenue, Vehicles Sold, Active Leads, Appointments?
- [ ] ¿Los números tienen sentido para un dealer?

**Observa "Team Performance":**

- [ ] ¿Ves una lista de agentes con sus métricas?
- [ ] ¿Muestra: Leads, Conversions, Revenue para cada agente?

**Observa "Inventory Status":**

- [ ] ¿Ves estadísticas del inventario? (Total Vehicles, Available, Pending, Sold This Month)

**Observa "Lead Sources":**

- [ ] ¿Ves un desglose de fuentes de leads? (Facebook, Website, Referral)

**Preguntas:**

- [ ] ¿Esta vista tiene sentido para un dealer?
- [ ] ¿Le falta algo importante?
- [ ] ¿Hay algo que no debería ver el dealer?

---

## 🔄 FLUJO 8: NAVEGACIÓN GENERAL

### Prueba esto:

#### PASO 1: Probar el Menú de Navegación

1. Observa el menú lateral (en desktop) o inferior (en móvil)
2. Prueba hacer clic en cada opción

**Preguntas:**

- [ ] ¿Es fácil encontrar lo que buscas?
- [ ] ¿Los iconos son claros?
- [ ] ¿El menú está en un lugar cómodo?
- [ ] ¿Prefieres menú lateral o inferior?

---

#### PASO 2: Probar en Móvil (si tienes acceso)

1. Abre el sistema en tu teléfono
2. Navega por las diferentes secciones

**Observa:**

- [ ] ¿Se ve bien en el teléfono?
- [ ] ¿Los botones son fáciles de tocar?
- [ ] ¿El texto se lee bien?
- [ ] ¿Es fácil navegar con el pulgar?

**Preguntas:**

- [ ] ¿Prefieres usar el sistema en computadora o teléfono?
- [ ] ¿Hay algo que no funciona bien en móvil?

---

## ✅ RESUMEN FINAL

### Por favor, responde estas preguntas generales:

1. **¿Qué te gustó más del sistema?**
   ```
   _________________________________________________
   _________________________________________________
   ```

2. **¿Qué fue lo más confuso o difícil de usar?**
   ```
   _________________________________________________
   _________________________________________________
   ```

3. **¿Qué funciones faltan que necesitas en tu trabajo diario?**
   ```
   _________________________________________________
   _________________________________________________
   ```

4. **¿Qué cambiarías o mejorarías?**
   ```
   _________________________________________________
   _________________________________________________
   ```

5. **En una escala del 1 al 10, ¿qué tan fácil fue usar el sistema?**
   - [ ] 1 - Muy difícil
   - [ ] 2
   - [ ] 3
   - [ ] 4
   - [ ] 5 - Neutral
   - [ ] 6
   - [ ] 7
   - [ ] 8
   - [ ] 9
   - [ ] 10 - Muy fácil

6. **¿Usarías este sistema en tu trabajo diario?**
   - [ ] Sí, definitivamente
   - [ ] Sí, pero con algunos cambios
   - [ ] Tal vez
   - [ ] No

7. **¿Tienes alguna otra sugerencia o comentario?**
   ```
   _________________________________________________
   _________________________________________________
   _________________________________________________
   _________________________________________________
   ```

---

## 📝 NOTAS ADICIONALES

**Espacio para cualquier otra observación que quieras compartir:**

```
_________________________________________________
_________________________________________________
_________________________________________________
_________________________________________________
_________________________________________________
_________________________________________________
_________________________________________________
_________________________________________________
```

---

## 🎯 INSTRUCCIONES FINALES

1. **Tómate tu tiempo** - No hay prisa, prueba todo con calma
2. **Sé honesto** - Tu opinión es muy valiosa, di lo que realmente piensas
3. **Anota todo** - Cualquier detalle que notes es importante
4. **No te preocupes por romper algo** - Es una versión de prueba, no puedes romper nada
5. **Pregunta si tienes dudas** - Juan está disponible para ayudarte

**¡Gracias por tu tiempo y por ayudarnos a mejorar el sistema!** 🙏

---

*Última actualización: Enero 2025*
