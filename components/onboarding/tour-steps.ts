import type { Tour } from "nextstepjs"

const agentTourSteps: Tour[] = [
  {
    tour: "agent-onboarding",
    steps: [
      {
        icon: "👋",
        title: "Bienvenido a Doctor del Crédito",
        content:
          "Te guiaremos por las funciones principales del sistema. Es rápido y puedes saltarlo en cualquier momento.",
        side: "bottom",
        showControls: true,
        showSkip: true,
        pointerPadding: 10,
        pointerRadius: 8,
      },
      {
        icon: "📋",
        title: "Menú de navegación",
        content:
          "Desde aquí accedes a Conversaciones, Tareas, Leads, Pipeline, Citas, Inventario y Reportes.",
        selector: "#sidebar-nav",
        side: "right",
        showControls: true,
        showSkip: true,
        pointerPadding: 10,
        pointerRadius: 8,
      },
      {
        icon: "💬",
        title: "Conversaciones",
        content:
          "Aquí puedes ver las conversaciones capturadas por el bot de Facebook. Cuando tengan teléfono, puedes convertirlas en leads.",
        selector: '[data-tour="conversations-nav"]',
        side: "right",
        showControls: true,
        showSkip: true,
        pointerPadding: 10,
        pointerRadius: 8,
      },
      {
        icon: "📊",
        title: "Resumen en tiempo real",
        content:
          "Tu resumen diario: leads activos, citas de hoy, conversiones y tasa de cierre.",
        selector: "#stats-grid",
        side: "bottom",
        showControls: true,
        showSkip: true,
        pointerPadding: 10,
        pointerRadius: 8,
      },
      {
        icon: "⚡",
        title: "Acciones rápidas",
        content:
          "Atajos para tu día a día: agregar un lead, agendar cita o ver tus leads.",
        selector: "#quick-actions",
        side: "top",
        showControls: true,
        showSkip: true,
        pointerPadding: 10,
        pointerRadius: 8,
      },
      {
        icon: "✅",
        title: "¡Listo!",
        content:
          "Ya conoces lo esencial. Puedes repetir esta guía desde Configuración cuando quieras.",
        side: "bottom",
        showControls: true,
        showSkip: false,
        pointerPadding: 10,
        pointerRadius: 8,
      },
    ],
  },
]

const dealerTourSteps: Tour[] = [
  {
    tour: "dealer-onboarding",
    steps: [
      {
        icon: "👋",
        title: "Bienvenido al panel de concesionario",
        content: "Te guiaremos por las funciones principales. Puedes saltar en cualquier momento.",
        side: "bottom",
        showControls: true,
        showSkip: true,
        pointerPadding: 10,
        pointerRadius: 8,
      },
      {
        icon: "📋",
        title: "Menú de navegación",
        content:
          "Desde aquí accedes a Leads Activos, Inventario, Citas y Reportes.",
        selector: "#sidebar-nav",
        side: "right",
        showControls: true,
        showSkip: true,
        pointerPadding: 10,
        pointerRadius: 8,
      },
      {
        icon: "📊",
        title: "Tu resumen de rendimiento",
        content:
          "Ingresos, vehículos vendidos, leads activos y citas programadas.",
        selector: "#dealer-metrics",
        side: "bottom",
        showControls: true,
        showSkip: true,
        pointerPadding: 10,
        pointerRadius: 8,
      },
      {
        icon: "✅",
        title: "¡Listo!",
        content:
          "Ya conoces lo esencial. Puedes repetir esta guía desde Configuración cuando quieras.",
        side: "bottom",
        showControls: true,
        showSkip: false,
        pointerPadding: 10,
        pointerRadius: 8,
      },
    ],
  },
]

export function getTourStepsForRole(role?: string): Tour[] {
  if (role === "dealer") {
    return dealerTourSteps
  }
  return agentTourSteps
}
