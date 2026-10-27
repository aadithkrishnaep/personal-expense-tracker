/**
 * Custom Input Validator for Expense Operations
 * Author: Aadith Krishna
 * Exit Examination: Full Stack Development (MERN)
 */

const ALLOWED_CATEGORIES = Object.freeze([
  'Food',
  'Travel',
  'Bills',
  'Shopping',
  'Other',
]);

class ExpenseValidator {
  /**
   * Sanitizes and validates incoming expense payload
   * @param {Object} payload 
   * @returns {{ isValid: boolean, sanitized: Object|null, errors: string[] }}
   */
  static validate(payload = {}) {
    const errors = [];
    const { title, amount, category, date } = payload;

    // 1. Title verification
    const cleanTitle = typeof title === 'string' ? title.trim() : '';
    if (!cleanTitle) {
      errors.push('Expense title is mandatory and cannot be whitespace.');
    } else if (cleanTitle.length > 120) {
      errors.push('Expense title cannot exceed 120 characters.');
    }

    // 2. Numeric amount verification
    const parsedAmount = Number(amount);
    if (amount === undefined || amount === null || String(amount).trim() === '') {
      errors.push('Monetary amount is required.');
    } else if (isNaN(parsedAmount) || !Number.isFinite(parsedAmount)) {
      errors.push('Expense amount must be a valid numerical value.');
    } else if (parsedAmount <= 0) {
      errors.push('Expense amount must be strictly greater than zero (no negative or zero values).');
    }

    // 3. Category verification
    const cleanCategory = typeof category === 'string' ? category.trim() : '';
    if (!cleanCategory) {
      errors.push('Category selection is required.');
    } else if (!ALLOWED_CATEGORIES.includes(cleanCategory)) {
      errors.push(`Invalid category "${cleanCategory}". Supported options: ${ALLOWED_CATEGORIES.join(', ')}.`);
    }

    // 4. Date verification
    if (!date) {
      errors.push('A valid transaction date is required.');
    } else {
      const parsedDate = new Date(date);
      if (isNaN(parsedDate.getTime())) {
        errors.push('The provided date string could not be parsed into a valid timestamp.');
      }
    }

    if (errors.length > 0) {
      return {
        isValid: false,
        sanitized: null,
        errors,
        firstError: errors[0],
      };
    }

    return {
      isValid: true,
      sanitized: {
        title: cleanTitle,
        amount: Math.round(parsedAmount * 100) / 100, // round to 2 decimals safely
        category: cleanCategory,
        date: new Date(date),
      },
      errors: [],
      firstError: null,
    };
  }
}

module.exports = {
  ExpenseValidator,
  ALLOWED_CATEGORIES,
};
