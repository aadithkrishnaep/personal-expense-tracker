/**
 * Expense Add & Edit Form Component
 * Author: Aadith Krishna
 * Exit Examination: Full Stack Development (MERN)
 */

import React, { useState, useEffect } from 'react';
import { getIsoDateOnly } from '../utils/formatters';

const ExpenseForm = ({
  onSubmit,
  editingExpense,
  onCancelEdit,
  isSubmitting,
}) => {
  const blankFormState = {
    title: '',
    amount: '',
    category: 'Food',
    date: getIsoDateOnly(new Date()),
  };

  const [formData, setFormData] = useState(blankFormState);
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    if (editingExpense) {
      setFormData({
        title: editingExpense.title || '',
        amount: editingExpense.amount || '',
        category: editingExpense.category || 'Food',
        date: getIsoDateOnly(editingExpense.date),
      });
      setFieldErrors({});
    } else {
      setFormData(blankFormState);
      setFieldErrors({});
    }
  }, [editingExpense]);

  const validateInputs = () => {
    const errs = {};
    const trimmedTitle = formData.title?.trim();

    if (!trimmedTitle) {
      errs.title = 'Title field cannot be empty.';
    } else if (trimmedTitle.length > 120) {
      errs.title = 'Title must be 120 characters or fewer.';
    }

    const numericAmount = parseFloat(formData.amount);
    if (!formData.amount || isNaN(numericAmount)) {
      errs.amount = 'Please enter a valid numeric value.';
    } else if (numericAmount <= 0) {
      errs.amount = 'Amount must be strictly greater than zero (no negative amounts allowed).';
    }

    if (!formData.category) {
      errs.category = 'Category must be specified.';
    }

    if (!formData.date) {
      errs.date = 'Date must be selected.';
    }

    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleFormSubmission = (e) => {
    e.preventDefault();
    if (!validateInputs()) return;

    onSubmit({
      title: formData.title.trim(),
      amount: parseFloat(formData.amount),
      category: formData.category,
      date: formData.date,
    });
  };

  const categoryOptions = [
    { label: 'Food', icon: 'bi-cup-hot-fill' },
    { label: 'Travel', icon: 'bi-airplane-fill' },
    { label: 'Bills', icon: 'bi-receipt-cutoff' },
    { label: 'Shopping', icon: 'bi-bag-check-fill' },
    { label: 'Other', icon: 'bi-tag-fill' },
  ];

  return (
    <div className="xtr-panel" id="expense-form-panel">
      <div className="xtr-panel-header">
        <div className="d-flex align-items-center gap-2">
          <div
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '9px',
              background: editingExpense ? '#ede9fe' : '#e0e7ff',
              color: editingExpense ? '#6d28d9' : '#3730a3',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <i className={`bi ${editingExpense ? 'bi-pencil-square' : 'bi-plus-circle'}`}></i>
          </div>
          <div>
            <h5 className="mb-0 fw-bold">
              {editingExpense ? 'Modify Expense Record' : 'Record New Expense'}
            </h5>
            <small className="text-muted">
              {editingExpense
                ? 'Update fields and save your changes to the database'
                : 'Input transaction details to log daily expenditure'}
            </small>
          </div>
        </div>

        {editingExpense && (
          <button
            type="button"
            className="btn btn-sm btn-outline-secondary rounded-pill px-3"
            onClick={onCancelEdit}
          >
            <i className="bi bi-x-circle me-1"></i> Cancel Edit
          </button>
        )}
      </div>

      <form onSubmit={handleFormSubmission} noValidate>
        <div className="row g-3">
          {/* Title */}
          <div className="col-12 col-md-6">
            <label className="form-label small fw-bold text-secondary" htmlFor="expense-title">
              Expense Title <span className="text-danger">*</span>
            </label>
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0 text-muted">
                <i className="bi bi-card-text"></i>
              </span>
              <input
                type="text"
                id="expense-title"
                name="title"
                className={`form-control xtr-input border-start-0 ${
                  fieldErrors.title ? 'is-invalid' : ''
                }`}
                placeholder="e.g. Metro rail recharge, Team lunch"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
            </div>
            {fieldErrors.title && (
              <div className="text-danger small mt-1">
                <i className="bi bi-exclamation-circle me-1"></i>
                {fieldErrors.title}
              </div>
            )}
          </div>

          {/* Amount */}
          <div className="col-12 col-md-6">
            <label className="form-label small fw-bold text-secondary" htmlFor="expense-amount">
              Amount (₹) <span className="text-danger">*</span>
            </label>
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0 text-muted">
                <i className="bi bi-currency-rupee"></i>
              </span>
              <input
                type="number"
                id="expense-amount"
                name="amount"
                step="0.01"
                min="0.01"
                className={`form-control xtr-input border-start-0 ${
                  fieldErrors.amount ? 'is-invalid' : ''
                }`}
                placeholder="0.00"
                value={formData.amount}
                onChange={handleInputChange}
                required
              />
            </div>
            {fieldErrors.amount && (
              <div className="text-danger small mt-1">
                <i className="bi bi-exclamation-circle me-1"></i>
                {fieldErrors.amount}
              </div>
            )}
          </div>

          {/* Category */}
          <div className="col-12 col-md-6">
            <label className="form-label small fw-bold text-secondary" htmlFor="expense-category">
              Category <span className="text-danger">*</span>
            </label>
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0 text-muted">
                <i className="bi bi-tag"></i>
              </span>
              <select
                id="expense-category"
                name="category"
                className={`form-select xtr-select border-start-0 ${
                  fieldErrors.category ? 'is-invalid' : ''
                }`}
                value={formData.category}
                onChange={handleInputChange}
                required
              >
                {categoryOptions.map((opt) => (
                  <option key={opt.label} value={opt.label}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            {fieldErrors.category && (
              <div className="text-danger small mt-1">
                <i className="bi bi-exclamation-circle me-1"></i>
                {fieldErrors.category}
              </div>
            )}
          </div>

          {/* Date */}
          <div className="col-12 col-md-6">
            <label className="form-label small fw-bold text-secondary" htmlFor="expense-date">
              Transaction Date <span className="text-danger">*</span>
            </label>
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0 text-muted">
                <i className="bi bi-calendar3"></i>
              </span>
              <input
                type="date"
                id="expense-date"
                name="date"
                className={`form-control xtr-input border-start-0 ${
                  fieldErrors.date ? 'is-invalid' : ''
                }`}
                value={formData.date}
                onChange={handleInputChange}
                required
              />
            </div>
            {fieldErrors.date && (
              <div className="text-danger small mt-1">
                <i className="bi bi-exclamation-circle me-1"></i>
                {fieldErrors.date}
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="col-12 d-flex justify-content-end gap-2 mt-3 pt-2 border-top">
            {editingExpense && (
              <button
                type="button"
                className="btn btn-light rounded-3 px-3"
                onClick={onCancelEdit}
                disabled={isSubmitting}
              >
                Cancel
              </button>
            )}

            <button
              type="submit"
              className="xtr-btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <i className={`bi ${editingExpense ? 'bi-check2' : 'bi-plus-lg'}`}></i>
                  <span>{editingExpense ? 'Update Expense' : 'Add Expense'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ExpenseForm;
