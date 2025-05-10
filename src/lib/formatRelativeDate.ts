const MONTH_NAMES_ES = [
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
   * - Hace X segundos (si es menos de 1 minuto)
   * - Hace X minutos (si es menos de 1 hora)
   * - Hace X horas (si es menos de 24 horas)
   * - Hace X días (si es menos de 14 días)
   * - "Mes Día" (si es más de 14 días)
   */
  const formatRelativeDate = (dateString: string): string => {
    if (!dateString) return "";
  
    const date = new Date(dateString);
    const now = new Date();
  
    // Calcular diferencia en milisegundos
    const diffMs = now.getTime() - date.getTime();
    
    // Si la fecha es futura o inválida, retornar mensaje apropiado
    if (diffMs < 0 || isNaN(diffMs)) {
      return "Hace un momento";
    }
  
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
    // Formato relativo
    if (diffSeconds < 60) {
      return `Hace ${diffSeconds} ${diffSeconds === 1 ? "segundo" : "segundos"}`;
    } else if (diffMinutes < 60) {
      return `Hace ${diffMinutes} ${diffMinutes === 1 ? "minuto" : "minutos"}`;
    } else if (diffHours < 24) {
      return `Hace ${diffHours} ${diffHours === 1 ? "hora" : "horas"}`;
    } else if (diffDays < 14) {
      return `Hace ${diffDays} ${diffDays === 1 ? "día" : "días"}`;
    } else {
      // Formato "Mes Día"
      const month = MONTH_NAMES_ES[date.getMonth()];
      const day = date.getDate();
      return `${month} ${day}`;
    }
  };

  export default formatRelativeDate;