// Utilidades para manejo de fechas
export const dateUtils = {
  /**
   * Obtiene fechas futuras a partir de hoy
   * @param {number} days - Número de días a futuro
   * @returns {Array} Array de objetos con fechas formateadas
   */
  getFutureDates(days = 7) {
    const dates = [];
    const today = new Date();

    // Nombres de días y meses en español e inglés
    const diasEs = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const diasEn = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const mesesEs = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
    const mesesEn = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    for (let i = 1; i <= days; i++) {
      const futureDate = new Date(today);
      futureDate.setDate(today.getDate() + i);

      const dayNum = futureDate.getDate();
      const monthNum = futureDate.getMonth();
      const year = futureDate.getFullYear();
      const dayOfWeek = futureDate.getDay();

      dates.push({
        fecha: futureDate.toISOString().split('T')[0], // Formato YYYY-MM-DD
        diaEs: `${diasEs[dayOfWeek]} ${dayNum} ${mesesEs[monthNum]}`,
        diaEn: `${diasEn[dayOfWeek]} ${monthNum + 1}/${dayNum}`,
        horas: this.getAvailableTimeSlots()
      });
    }

    return dates;
  },

  /**
   * Genera horarios disponibles aleatorios
   * @returns {Array} Array de horarios en formato "HH:MM"
   */
  getAvailableTimeSlots() {
    const allSlots = [
      '08:00', '09:00', '10:00', '11:00', '12:00',
      '13:00', '14:00', '15:00', '16:00', '17:00',
      '18:00', '19:00', '20:00', '21:00', '22:00'
    ];

    // Selecciona aleatoriamente entre 3 y 5 horarios
    const numSlots = Math.floor(Math.random() * 3) + 3;
    const shuffled = allSlots.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, numSlots).sort();
  },

  /**
   * Formatea una fecha según el locale
   * @param {string} dateString - Fecha en formato ISO
   * @param {string} locale - Locale (es o en)
   * @returns {string} Fecha formateada
   */
  formatDate(dateString, locale = 'es') {
    if (!dateString || dateString === 'Invalid Date') return locale === 'es' ? 'Fecha no disponible' : 'Date not available';

    const date = new Date(dateString);
    if (isNaN(date.getTime())) return locale === 'es' ? 'Fecha inválida' : 'Invalid date';

    return date.toLocaleDateString(locale === 'es' ? 'es-ES' : 'en-US', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  },

  /**
   * Obtiene el día de hoy en formato ISO
   * @returns {string} Fecha de hoy en formato YYYY-MM-DD
   */
  getTodayISO() {
    return new Date().toISOString().split('T')[0];
  },

  /**
   * Obtiene fecha mínima para input date (hoy)
   * @returns {string} Fecha de hoy en formato YYYY-MM-DD
   */
  getMinDate() {
    return this.getTodayISO();
  }
};
