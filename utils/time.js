/**
 * Get current timestamp in Jakarta timezone (WIB - UTC+7)
 * @returns {string} ISO 8601 formatted timestamp in Jakarta timezone
 */
export const getJakartaTimestamp = () => {
  return new Date().toLocaleString("sv-SE", {
    timeZone: "Asia/Jakarta",
  });
};

/**
 * Convert any date to Jakarta timezone
 * @param {Date} date - Date object to convert
 * @returns {string} ISO 8601 formatted timestamp in Jakarta timezone
 */
export const toJakartaTimestamp = (date) => {
  return new Date(date).toLocaleString("sv-SE", {
    timeZone: "Asia/Jakarta",
  });
};
