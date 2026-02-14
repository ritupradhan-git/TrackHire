// server/utils/dateFormatter.js

/**
 * Formats a Date object into a readable string (e.g., "YYYY-MM-DD").
 * @param {Date | string} dateInput The date to format. Can be a Date object or a string parseable by Date.
 * @returns {string} The formatted date string, or "Invalid Date" if parsing fails.
 */
 export const formatDateForDisplay = (dateInput) => {
  let date;
  if (dateInput instanceof Date) {
    date = dateInput;
  } else if (typeof dateInput === 'string') {
    date = new Date(dateInput);
  } else {
    return "Invalid Date";
  }

  if (isNaN(date.getTime())) {
    return "Invalid Date";
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

/**
 * Formats a Date object into a more verbose, locale-specific string.
 * @param {Date | string} dateInput The date to format.
 * @param {string} locale The locale string (e.g., 'en-US', 'es-ES').
 * @param {object} options Options for toLocaleDateString (e.g., { year: 'numeric', month: 'long', day: 'numeric' }).
 * @returns {string} The formatted date string.
 */
export const formatVerboseDate = (dateInput, locale = 'en-US', options = { year: 'numeric', month: 'long', day: 'numeric' }) => {
  let date;
  if (dateInput instanceof Date) {
    date = dateInput;
  } else if (typeof dateInput === 'string') {
    date = new Date(dateInput);
  } else {
    return "Invalid Date";
  }

  if (isNaN(date.getTime())) {
    return "Invalid Date";
  }

  try {
    return date.toLocaleDateString(locale, options);
  } catch (error) {
    console.error(`Error formatting date with locale ${locale}:`, error);
    return formatDateForDisplay(date); // Fallback to simple format
  }
};
