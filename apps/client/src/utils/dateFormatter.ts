/**
 * Convertit une date vers le format DD-MM-YYYY attendu par le serveur
 * Gère les formats: YYYY-MM-DD, DD-MM-YYYY, ISO (YYYY-MM-DDTHH:mm:ss.sssZ)
 */
export const ensureDDMMYYYY = (dateString: string): string => {
  if (!dateString) return dateString;

  // Si c'est une date ISO, extraire juste la partie date
  if (dateString.includes('T')) {
    dateString = dateString.split('T')[0];
  }

  const parts = dateString.split('-');
  if (parts.length !== 3) return dateString;

  // Si le premier élément a 4 caractères, c'est YYYY-MM-DD
  if (parts[0].length === 4) {
    const [year, month, day] = parts;
    return `${day}-${month}-${year}`;
  }

  // Sinon c'est déjà DD-MM-YYYY
  return dateString;
};

/**
 * Convertit DD-MM-YYYY vers YYYY-MM-DD pour les inputs date HTML
 */
export const toInputDateFormat = (dateString: string): string => {
  if (!dateString || !dateString.includes("-")) return dateString;

  const parts = dateString.split("-");
  if (parts.length === 3 && parts[0].length === 2) {
    // Format DD-MM-YYYY
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  }

  return dateString; // Déjà au bon format
};
