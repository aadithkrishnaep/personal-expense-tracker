const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide an expense title'],
      trim: true,
      minlength: [1, 'Title cannot be empty'],
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    amount: {
      type: Number,
      required: [true, 'Please provide an amount'],
      min: [0.01, 'Amount must be greater than zero'],
      validate: {
        validator: function (v) {
          return typeof v === 'number' && !isNaN(v) && v > 0;
        },
        message: 'Amount must be a positive number',
      },
    },
    category: {
      type: String,
      required: [true, 'Please select a category'],
      enum: {
        values: ['Food', 'Travel', 'Bills', 'Shopping', 'Other'],
        message: '{VALUE} is not a supported category',
      },
      default: 'Other',
    },
    date: {
      type: Date,
      required: [true, 'Please provide a date'],
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Virtual field or transform to ensure clean JSON output
expenseSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id;
    return ret;
  },
});

module.exports = mongoose.model('Expense', expenseSchema);
