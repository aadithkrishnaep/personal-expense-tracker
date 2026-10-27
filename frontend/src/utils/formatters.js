/**
 * Formatters and Data Presentation Utilities
 * Author: Aadith Krishna
 * Exit Examination: Full Stack Development (MERN)
 */

export const formatCurrencyINR = (amount = 0) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  }).format(amount || 0);
};

export const formatCalendarDate = (rawDate) => {
  if (!rawDate) return 'N/A';
  const parsed = new Date(rawDate);
  if (isNaN(parsed.getTime())) return String(rawDate);
  return parsed.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

export const getIsoDateOnly = (dateInput) => {
  if (!dateInput) return new Date().toISOString().split('T')[0];
  if (typeof dateInput === 'string' && dateInput.includes('T')) {
    return dateInput.split('T')[0];
  }
  const dateObj = new Date(dateInput);
  return isNaN(dateObj.getTime())
    ? new Date().toISOString().split('T')[0]
    : dateObj.toISOString().split('T')[0];
};
