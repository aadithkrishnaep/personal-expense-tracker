import React, { useState, useEffect } from 'react';

const ExpenseForm = ({
  onSubmit,
  editingExpense,
  onCancelEdit,
  isSubmitting,
}) => {
  const getTodayString = () => new Date().toISOString().split('T')[0];

  const initialFormData = {
    title: '',
    amount: '',
    category: 'Food',
    date: getTodayString(),
  };

  const [formData, setFormData] = useState(initialFormData);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (editingExpense) {
      let formattedDate = getTodayString();
      if (editingExpense.date) {
        formattedDate = typeof editingExpense.date === 'string'
          ? editingExpense.date.split('T')[0]
          : new Date(editingExpense.date).toISOString().split('T')[0];
      }

      setFormData({
        title: editingExpense.title || '',
        amount: editingExpense.amount || '',
        category: editingExpense.category || 'Food',
        date: formattedDate,
      });
      setFormErrors({});
    } else {
      setFormData(initialFormData);
      setFormErrors({});
    }
  }, [editingExpense]);

  const validate = () => {
    const errors = {};

    if (!formData.title || formData.title.trim() === '') {
      errors.title = 'Title is required and cannot be blank.';
    }

    const numAmount = parseFloat(formData.amount);
    if (!formData.amount || isNaN(numAmount)) {
      errors.amount = 'Please enter a valid amount.';
    } else if (numAmount <= 0) {
      errors.amount = 'Amount must be greater than zero (no negative or zero values).';
    }

    if (!formData.category) {
      errors.category = 'Please select a valid category.';
    }

    if (!formData.date) {
      errors.date = 'Please pick a valid date.';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear specific field error as user types
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) {
      return;
    }

    onSubmit({
      title: formData.title.trim(),
      amount: parseFloat(formData.amount),
      category: formData.category,
      date: formData.date,
    });
  };

  const categories = [
    { label: 'Food', icon: 'bi-cup-hot-fill' },
    { label: 'Travel', icon: 'bi-airplane-fill' },
    { label: 'Bills', icon: 'bi-receipt-cutoff' },
    { label: 'Shopping', icon: 'bi-bag-check-fill' },
    { label: 'Other', icon: 'bi-tag-fill' },
  ];

  return (
    <div className="content-card shadow-sm" id="expense-form-card">
      <div className="card-header-custom">
        <div className="d-flex align-items-center gap-2">
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: editingExpense ? '#ede9fe' : '#e0e7ff',
              color: editingExpense ? '#7c3aed' : '#4338ca',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <i className={`bi ${editingExpense ? 'bi-pencil-square' : 'bi-plus-circle'}`}></i>
          </div>
          <div>
            <h5 className="mb-0 fw-bold">
              {editingExpense ? 'Edit Expense Record' : 'Record New Expense'}
            </h5>
            <small className="text-muted">
              {editingExpense
                ? 'Update the fields below and save changes'
                : 'Fill in details to log your daily expense'}
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

      <form onSubmit={handleSubmit} noValidate>
        <div className="row g-3">
          {/* Title Field */}
          <div className="col-12 col-md-6">
            <label className="form-label-custom" htmlFor="title">
              Expense Title <span className="text-danger">*</span>
            </label>
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0 text-muted">
                <i className="bi bi-card-text"></i>
              </span>
              <input
                type="text"
                id="title"
                name="title"
                className={`form-control form-control-custom border-start-0 ${
                  formErrors.title ? 'is-invalid' : ''
                }`}
                placeholder="e.g., Grocery Shopping, Uber to Office"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>
            {formErrors.title && (
              <div className="text-danger small mt-1">
                <i className="bi bi-exclamation-circle me-1"></i>
                {formErrors.title}
              </div>
            )}
          </div>

          {/* Amount Field */}
          <div className="col-12 col-md-6">
            <label className="form-label-custom" htmlFor="amount">
              Amount (₹) <span className="text-danger">*</span>
            </label>
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0 text-muted">
                <i className="bi bi-currency-rupee"></i>
              </span>
              <input
                type="number"
                id="amount"
                name="amount"
                step="0.01"
                min="0.01"
                className={`form-control form-control-custom border-start-0 ${
                  formErrors.amount ? 'is-invalid' : ''
                }`}
                placeholder="0.00"
                value={formData.amount}
                onChange={handleChange}
                required
              />
            </div>
            {formErrors.amount && (
              <div className="text-danger small mt-1">
                <i className="bi bi-exclamation-circle me-1"></i>
                {formErrors.amount}
              </div>
            )}
          </div>

          {/* Category Dropdown */}
          <div className="col-12 col-md-6">
            <label className="form-label-custom" htmlFor="category">
              Category <span className="text-danger">*</span>
            </label>
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0 text-muted">
                <i className="bi bi-grid"></i>
              </span>
              <select
                id="category"
                name="category"
                className={`form-select form-select-custom border-start-0 ${
                  formErrors.category ? 'is-invalid' : ''
                }`}
                value={formData.category}
                onChange={handleChange}
                required
              >
                {categories.map((c) => (
                  <option key={c.label} value={c.label}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
            {formErrors.category && (
              <div className="text-danger small mt-1">
                <i className="bi bi-exclamation-circle me-1"></i>
                {formErrors.category}
              </div>
            )}
          </div>

          {/* Date Field */}
          <div className="col-12 col-md-6">
            <label className="form-label-custom" htmlFor="date">
              Date <span className="text-danger">*</span>
            </label>
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0 text-muted">
                <i className="bi bi-calendar-event"></i>
              </span>
              <input
                type="date"
                id="date"
                name="date"
                className={`form-control form-control-custom border-start-0 ${
                  formErrors.date ? 'is-invalid' : ''
                }`}
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>
            {formErrors.date && (
              <div className="text-danger small mt-1">
                <i className="bi bi-exclamation-circle me-1"></i>
                {formErrors.date}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="col-12 d-flex justify-content-end gap-2 mt-3 pt-2 border-top">
            {editingExpense && (
              <button
                type="button"
                className="btn btn-secondary-custom"
                onClick={onCancelEdit}
                disabled={isSubmitting}
              >
                Cancel
              </button>
            )}

            <button
              type="submit"
              className="btn btn-primary-custom"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <i className={`bi ${editingExpense ? 'bi-check-lg' : 'bi-plus-lg'}`}></i>
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
