const Expense = require('../models/Expense');
const { getDbStatus } = require('../config/db');

// In-memory fallback storage in case MongoDB Atlas is running offline or DNS blocks
let memoryExpenses = [
  {
    _id: 'sample-1',
    id: 'sample-1',
    title: 'Supermarket Grocery & Household',
    amount: 3250.00,
    category: 'Food',
    date: '2026-10-24',
    createdAt: new Date('2026-10-24'),
    updatedAt: new Date('2026-10-24'),
  },
  {
    _id: 'sample-2',
    id: 'sample-2',
    title: 'Monthly Metro Rail Pass',
    amount: 1200.00,
    category: 'Travel',
    date: '2026-10-18',
    createdAt: new Date('2026-10-18'),
    updatedAt: new Date('2026-10-18'),
  },
  {
    _id: 'sample-3',
    id: 'sample-3',
    title: 'High-Speed Fiber Broadband',
    amount: 999.00,
    category: 'Bills',
    date: '2026-10-10',
    createdAt: new Date('2026-10-10'),
    updatedAt: new Date('2026-10-10'),
  },
  {
    _id: 'sample-4',
    id: 'sample-4',
    title: 'Festive Shopping & Apparel',
    amount: 4500.00,
    category: 'Shopping',
    date: '2026-09-28',
    createdAt: new Date('2026-09-28'),
    updatedAt: new Date('2026-09-28'),
  },
  {
    _id: 'sample-5',
    id: 'sample-5',
    title: 'Electricity & Utility Bills',
    amount: 2150.00,
    category: 'Bills',
    date: '2026-09-15',
    createdAt: new Date('2026-09-15'),
    updatedAt: new Date('2026-09-15'),
  },
  {
    _id: 'sample-6',
    id: 'sample-6',
    title: 'Weekend Outing & Dining',
    amount: 2400.00,
    category: 'Food',
    date: '2026-08-22',
    createdAt: new Date('2026-08-22'),
    updatedAt: new Date('2026-08-22'),
  },
  {
    _id: 'sample-7',
    id: 'sample-7',
    title: 'Train Tickets Vacation',
    amount: 3800.00,
    category: 'Travel',
    date: '2026-08-11',
    createdAt: new Date('2026-08-11'),
    updatedAt: new Date('2026-08-11'),
  },
  {
    _id: 'sample-8',
    id: 'sample-8',
    title: 'Electronics & Accessories',
    amount: 1850.00,
    category: 'Shopping',
    date: '2026-07-19',
    createdAt: new Date('2026-07-19'),
    updatedAt: new Date('2026-07-19'),
  },
];

// Helper to validate expense fields
const validateExpenseInput = ({ title, amount, category, date }) => {
  if (!title || typeof title !== 'string' || title.trim() === '') {
    return 'Expense title is required and cannot be empty.';
  }

  const numericAmount = Number(amount);
  if (isNaN(numericAmount) || numericAmount <= 0) {
    return 'Expense amount must be a positive number greater than 0.';
  }

  const validCategories = ['Food', 'Travel', 'Bills', 'Shopping', 'Other'];
  if (!category || !validCategories.includes(category)) {
    return `Category must be one of: ${validCategories.join(', ')}`;
  }

  if (!date || isNaN(new Date(date).getTime())) {
    return 'A valid expense date is required.';
  }

  return null;
};

// @desc    Get all expenses
// @route   GET /api/expenses
// @access  Public
exports.getExpenses = async (req, res) => {
  try {
    if (getDbStatus()) {
      const expenses = await Expense.find().sort({ date: -1, createdAt: -1 });
      const totalAmount = expenses.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
      return res.status(200).json({
        success: true,
        count: expenses.length,
        totalAmount: Number(totalAmount.toFixed(2)),
        data: expenses,
      });
    }

    // Fallback store
    const sorted = [...memoryExpenses].sort((a, b) => new Date(b.date) - new Date(a.date));
    const totalAmount = sorted.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
    return res.status(200).json({
      success: true,
      count: sorted.length,
      totalAmount: Number(totalAmount.toFixed(2)),
      data: sorted,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error fetching expenses: ' + error.message,
    });
  }
};

// @desc    Get single expense by ID
// @route   GET /api/expenses/:id
// @access  Public
exports.getExpenseById = async (req, res) => {
  try {
    const { id } = req.params;

    if (getDbStatus()) {
      const expense = await Expense.findById(id);
      if (!expense) {
        return res.status(404).json({ success: false, message: 'Expense not found' });
      }
      return res.status(200).json({ success: true, data: expense });
    }

    const item = memoryExpenses.find((exp) => exp._id === id || exp.id === id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Expense not found' });
    }
    return res.status(200).json({ success: true, data: item });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error retrieving expense: ' + error.message,
    });
  }
};

// @desc    Create new expense
// @route   POST /api/expenses
// @access  Public
exports.createExpense = async (req, res) => {
  try {
    const { title, amount, category, date } = req.body;

    const validationError = validateExpenseInput({ title, amount, category, date });
    if (validationError) {
      return res.status(400).json({
        success: false,
        message: validationError,
      });
    }

    const parsedAmount = Number(parseFloat(amount).toFixed(2));
    const parsedDate = new Date(date);

    if (getDbStatus()) {
      const newExpense = await Expense.create({
        title: title.trim(),
        amount: parsedAmount,
        category,
        date: parsedDate,
      });

      return res.status(201).json({
        success: true,
        message: 'Expense added successfully',
        data: newExpense,
      });
    }

    // In-memory fallback
    const id = 'exp-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6);
    const newRecord = {
      _id: id,
      id,
      title: title.trim(),
      amount: parsedAmount,
      category,
      date: date.includes('T') ? date.split('T')[0] : date,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    memoryExpenses.unshift(newRecord);

    return res.status(201).json({
      success: true,
      message: 'Expense added successfully',
      data: newRecord,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: 'Failed to create expense: ' + error.message,
    });
  }
};

// @desc    Update existing expense
// @route   PUT /api/expenses/:id
// @access  Public
exports.updateExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, amount, category, date } = req.body;

    const validationError = validateExpenseInput({ title, amount, category, date });
    if (validationError) {
      return res.status(400).json({
        success: false,
        message: validationError,
      });
    }

    const parsedAmount = Number(parseFloat(amount).toFixed(2));
    const parsedDate = new Date(date);

    if (getDbStatus()) {
      const updated = await Expense.findByIdAndUpdate(
        id,
        {
          title: title.trim(),
          amount: parsedAmount,
          category,
          date: parsedDate,
        },
        { new: true, runValidators: true }
      );

      if (!updated) {
        return res.status(404).json({ success: false, message: 'Expense not found to update' });
      }

      return res.status(200).json({
        success: true,
        message: 'Expense updated successfully',
        data: updated,
      });
    }

    // In-memory fallback
    const index = memoryExpenses.findIndex((exp) => exp._id === id || exp.id === id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Expense not found to update' });
    }

    memoryExpenses[index] = {
      ...memoryExpenses[index],
      title: title.trim(),
      amount: parsedAmount,
      category,
      date: date.includes('T') ? date.split('T')[0] : date,
      updatedAt: new Date(),
    };

    return res.status(200).json({
      success: true,
      message: 'Expense updated successfully',
      data: memoryExpenses[index],
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: 'Failed to update expense: ' + error.message,
    });
  }
};

// @desc    Delete expense
// @route   DELETE /api/expenses/:id
// @access  Public
exports.deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;

    if (getDbStatus()) {
      const deleted = await Expense.findByIdAndDelete(id);
      if (!deleted) {
        return res.status(404).json({ success: false, message: 'Expense not found to delete' });
      }

      return res.status(200).json({
        success: true,
        message: 'Expense deleted successfully',
      });
    }

    // In-memory fallback
    const index = memoryExpenses.findIndex((exp) => exp._id === id || exp.id === id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Expense not found to delete' });
    }

    memoryExpenses.splice(index, 1);

    return res.status(200).json({
      success: true,
      message: 'Expense deleted successfully',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to delete expense: ' + error.message,
    });
  }
};
