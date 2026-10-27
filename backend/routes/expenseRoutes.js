/**
 * Expense RESTful API Route Definitions
 * Author: Aadith Krishna
 * Exit Examination: Full Stack Development (MERN)
 */

const express = require('express');
const router = express.Router();
const ExpenseController = require('../controllers/expenseController');

router
  .route('/')
  .get(ExpenseController.handleGetExpenses)
  .post(ExpenseController.handleCreateExpense);

router
  .route('/:id')
  .get(ExpenseController.handleGetExpenseById)
  .put(ExpenseController.handleUpdateExpense)
  .delete(ExpenseController.handleDeleteExpense);

module.exports = router;
