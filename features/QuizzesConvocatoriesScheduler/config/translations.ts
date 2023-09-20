import { Translations } from "@aldabil/react-scheduler/types";

export const TRANSLATIONS: Translations = {
  navigation: {
    month: "Mes",
    week: "Semana",
    day: "Día",
    today: "Hoy",
  },
  form: {
    addTitle: "Agregar convocatoria",
    editTitle: "Editar convocatoria",
    confirm: "Confirmar",
    delete: "Eliminar",
    cancel: "Cancelar",
  },
  event: {
    title: "Examen",
    start: "Inicio",
    end: "Fin",
    allDay: "Todo el día",
  },
  moreEvents: "Más...",
  loading: "Cargando...",
} as const;

export default TRANSLATIONS;
