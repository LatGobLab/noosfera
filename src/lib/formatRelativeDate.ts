const MONTH_NAMES_ES: string[] = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

  /**
   * Formatea una fecha en formato relativo:
   * - Hace un momento (si es menos de 1 minuto)
   * - Hace X minutos (si es menos de 1 hora)
   * - Hace X horas (si es menos de 24 horas)
   * - Hace X días (si es menos de 14 días)
   * - "Mes Día" (si es más de 14 días)
   */

export default function formatRelativeDate(timestampStr: string): string {
  const eventDate = new Date(timestampStr);

  // Validar si la fecha es válida después de parsearla
  if (isNaN(eventDate.getTime())) {
    return "Fecha inválida"; // O manejar el error como prefieras
  }

  const now = new Date();

  const diffInMilliseconds = now.getTime() - eventDate.getTime();
  // Usamos Math.floor para obtener la diferencia en segundos enteros,
  // redondeando hacia abajo.
  const diffInSeconds = Math.floor(diffInMilliseconds / 1000);

  // Definimos las duraciones en segundos para claridad
  const secondsInMinute = 60;
  const secondsInHour = secondsInMinute * 60; // 3600 segundos
  const secondsInDay = secondsInHour * 24;     // 86400 segundos
  const secondsIn14Days = secondsInDay * 14;   // 1,209,600 segundos

  // Si la fecha del evento es en el futuro
  if (diffInSeconds < 0) {
    // Para fechas futuras, mostramos "Mes Día"
    const month = MONTH_NAMES_ES[eventDate.getMonth()]; // getMonth() es 0-indexado
    const day = eventDate.getDate();
    return `${month} ${day}`;
  }

  // Menos de 1 minuto (0 a 59 segundos)
  if (diffInSeconds < secondsInMinute) {
    return "Hace un momento";
  }

  // Menos de 1 hora (60 segundos a 3599 segundos)
  if (diffInSeconds < secondsInHour) {
    const minutes = Math.floor(diffInSeconds / secondsInMinute);
    return `Hace ${minutes} minuto${minutes > 1 ? "s" : ""}`;
  }

  // Menos de 24 horas (3600 segundos a 86399 segundos)
  if (diffInSeconds < secondsInDay) {
    const hours = Math.floor(diffInSeconds / secondsInHour);
    return `Hace ${hours} hora${hours > 1 ? "s" : ""}`;
  }

  // Menos de 14 días (86400 segundos hasta 13 días, 23 horas, 59 mins, 59 segs)
  if (diffInSeconds < secondsIn14Days) {
    const days = Math.floor(diffInSeconds / secondsInDay);
    return `Hace ${days} día${days > 1 ? "s" : ""}`;
  }

  // Si es hace 14 días o más
  const month = MONTH_NAMES_ES[eventDate.getMonth()];
  const day = eventDate.getDate();
  return `${month} ${day}`;
}
