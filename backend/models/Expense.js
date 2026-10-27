/**
 * Mongoose Schema & Data Model for Personal Expenses
 * Author: Aadith Krishna
 * Exit Examination: Full Stack Development (MERN)
 */

const mongoose = require('mongoose');
const { ALLOWED_CATEGORIES } = require('../validators/expenseValidator');

const expenseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Expense title is required'],
      trim: true,
      maxlength: [120, 'Title cannot exceed 120 characters'],
    },
    amount: {
      type: Number,
      required: [true, 'Monetary amount is required'],
      min: [0.01, 'Amount must be greater than zero'],
      validate: {
        validator: (val) => typeof val === 'number' && Number.isFinite(val) && val > 0,
        message: 'Amount must be a positive non-zero number',
      },
    },
    category: {
      type: String,
      required: [true, 'Expense category is required'],
      enum: {
        values: ALLOWED_CATEGORIES,
        message: '{VALUE} is not a valid category',
      },
      default: 'Other',
    },
    date: {
      type: Date,
      required: [true, 'Expense transaction date is required'],
      default: Date.now,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_, record) => {
        record.id = record._id.toString();
        delete record.__v;
        return record;
      },
    },
  }
);

// Performance index for frequent date-based sorting and category queries
expenseSchema.index({ date: -1, createdAt: -1 });
expenseSchema.index({ category: 1 });

/**
 * Aggregation helper to compute total expenditure and categorical counts
 */
expenseSchema.statics.computeSummaryStats = async function () {
  const result = await this.aggregate([
    {
      $group: {
        _id: null,
        totalExpenditure: { $sum: '$amount' },
        totalEntries: { $sum: 1 },
        peakExpense: { $max: '$amount' },
      },
    },
  ]);

  if (!result || result.length === 0) {
    return {
      totalAmount: 0,
      count: 0,
      peakExpense: 0,
    };
  }

  const stat = result[0];
  return {
    totalAmount: Math.round(stat.totalExpenditure * 100) / 100,
    count: stat.totalEntries,
    peakExpense: Math.round(stat.peakExpense * 100) / 100,
  };
};

module.exports = mongoose.model('Expense', expenseSchema);
