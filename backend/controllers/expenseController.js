/**
 * REST Controller for Personal Expense Tracker
 * Author: Aadith Krishna
 * Exit Examination: Full Stack Development (MERN)
 */

const ExpenseService = require('../services/expenseService');
const { ExpenseValidator } = require('../validators/expenseValidator');

/**
 * Controller class managing HTTP endpoints for expense operations
 */
class ExpenseController {
  /**
   * GET /api/expenses
   * Fetches all expenses and calculated aggregate statistics
   */
  static async handleGetExpenses(req, res, next) {
    try {
      const { items, totalAmount, count, peakExpense } = await ExpenseService.fetchAllExpenses();

      return res.status(200).json({
        success: true,
        count,
        totalAmount,
        peakExpense,
        data: items,
        retrievedAt: new Date().toISOString(),
      });
    } catch (err) {
      return next(err);
    }
  }

  /**
   * GET /api/expenses/:id
   * Retrieves single expense by primary identifier
   */
  static async handleGetExpenseById(req, res, next) {
    try {
      const { id } = req.params;
      const record = await ExpenseService.fetchExpenseById(id);

      if (!record) {
        return res.status(404).json({
          success: false,
          message: `Expense with identifier "${id}" was not located.`,
        });
      }

      return res.status(200).json({
        success: true,
        data: record,
      });
    } catch (err) {
      return next(err);
    }
  }

  /**
   * POST /api/expenses
   * Creates a new validated expense entry
   */
  static async handleCreateExpense(req, res, next) {
    try {
      const validation = ExpenseValidator.validate(req.body);

      if (!validation.isValid) {
        return res.status(400).json({
          success: false,
          message: validation.firstError,
          errors: validation.errors,
        });
      }

      const createdEntry = await ExpenseService.insertExpense(validation.sanitized);

      return res.status(201).json({
        success: true,
        message: 'Expense added successfully',
        data: createdEntry,
      });
    } catch (err) {
      return next(err);
    }
  }

  /**
   * PUT /api/expenses/:id
   * Modifies an existing expense entry after validation
   */
  static async handleUpdateExpense(req, res, next) {
    try {
      const { id } = req.params;
      const validation = ExpenseValidator.validate(req.body);

      if (!validation.isValid) {
        return res.status(400).json({
          success: false,
          message: validation.firstError,
          errors: validation.errors,
        });
      }

      const updatedEntry = await ExpenseService.modifyExpense(id, validation.sanitized);

      if (!updatedEntry) {
        return res.status(404).json({
          success: false,
          message: `Unable to update: expense "${id}" does not exist.`,
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Expense updated successfully',
        data: updatedEntry,
      });
    } catch (err) {
      return next(err);
    }
  }

  /**
   * DELETE /api/expenses/:id
   * Removes an existing expense entry
   */
  static async handleDeleteExpense(req, res, next) {
    try {
      const { id } = req.params;
      const removedEntry = await ExpenseService.removeExpense(id);

      if (!removedEntry) {
        return res.status(404).json({
          success: false,
          message: `Unable to delete: expense "${id}" does not exist.`,
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Expense deleted successfully',
      });
    } catch (err) {
      return next(err);
    }
  }
}

module.exports = ExpenseController;
