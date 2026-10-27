import React, { useState } from 'react';

const ExpenseList = ({
  expenses = [],
  onEdit,
  onDeleteRequest,
  isLoading,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('date-desc');

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
    }).format(val || 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const categoryIcons = {
    Food: 'bi-cup-hot-fill',
    Travel: 'bi-airplane-fill',
    Bills: 'bi-receipt-cutoff',
    Shopping: 'bi-bag-check-fill',
    Other: 'bi-tag-fill',
  };

  // Filter & Search logic
  const filteredExpenses = expenses
    .filter((item) => {
      const matchesSearch = item.title
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase().trim());
      const matchesCategory =
        selectedCategory === 'All' || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === 'date-desc') {
        return new Date(b.date) - new Date(a.date);
      }
      if (sortBy === 'date-asc') {
        return new Date(a.date) - new Date(b.date);
      }
      if (sortBy === 'amount-desc') {
        return (Number(b.amount) || 0) - (Number(a.amount) || 0);
      }
      if (sortBy === 'amount-asc') {
        return (Number(a.amount) || 0) - (Number(b.amount) || 0);
      }
      return 0;
    });

  return (
    <div className="content-card shadow-sm">
      <div className="card-header-custom flex-column flex-md-row align-items-md-center gap-3">
        <div>
          <h5 className="mb-0 fw-bold">Expense History</h5>
          <small className="text-muted">
            Showing {filteredExpenses.length} of {expenses.length} records
          </small>
        </div>

        {/* Filter and Search Controls */}
        <div className="d-flex flex-wrap gap-2 w-100 w-md-auto">
          {/* Search Input */}
          <div className="input-group" style={{ minWidth: '200px', flex: '1 1 auto' }}>
            <span className="input-group-text bg-light border-end-0 text-muted">
              <i className="bi bi-search"></i>
            </span>
            <input
              type="text"
              className="form-control form-control-custom border-start-0 py-2"
              placeholder="Search expenses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                className="btn btn-outline-secondary border-start-0"
                type="button"
                onClick={() => setSearchTerm('')}
              >
                <i className="bi bi-x"></i>
              </button>
            )}
          </div>

          {/* Category Filter */}
          <select
            className="form-select form-select-custom py-2"
            style={{ width: 'auto' }}
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="All">All Categories</option>
            <option value="Food">Food</option>
            <option value="Travel">Travel</option>
            <option value="Bills">Bills</option>
            <option value="Shopping">Shopping</option>
            <option value="Other">Other</option>
          </select>

          {/* Sort Dropdown */}
          <select
            className="form-select form-select-custom py-2"
            style={{ width: 'auto' }}
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="date-desc">Newest First</option>
            <option value="date-asc">Oldest First</option>
            <option value="amount-desc">Amount: High to Low</option>
            <option value="amount-asc">Amount: Low to High</option>
          </select>
        </div>
      </div>

      {/* Loading state */}
      {isLoading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading expenses...</span>
          </div>
          <p className="text-muted mt-2">Loading expense records...</p>
        </div>
      ) : filteredExpenses.length === 0 ? (
        /* Empty State */
        <div className="text-center py-5">
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: '#f1f5f9',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.8rem',
              color: '#94a3b8',
              marginBottom: '1rem',
            }}
          >
            <i className="bi bi-inbox"></i>
          </div>
          <h6 className="fw-bold text-dark">No Expenses Found</h6>
          <p className="text-muted small mb-3">
            {expenses.length === 0
              ? 'Start by adding your first daily expense above.'
              : 'No expenses match the current filter or search criteria.'}
          </p>
          {(searchTerm || selectedCategory !== 'All') && (
            <button
              className="btn btn-sm btn-outline-primary rounded-pill px-3"
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('All');
              }}
            >
              Clear Filters
            </button>
          )}
        </div>
      ) : (
        /* Expenses Table / List */
        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th style={{ width: '35%' }}>Title</th>
                <th style={{ width: '20%' }}>Category</th>
                <th style={{ width: '18%' }}>Date</th>
                <th style={{ width: '15%' }} className="text-end">Amount</th>
                <th style={{ width: '12%' }} className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredExpenses.map((expense) => {
                const id = expense._id || expense.id;
                const category = expense.category || 'Other';
                const iconClass = categoryIcons[category] || 'bi-tag-fill';

                return (
                  <tr key={id}>
                    {/* Title */}
                    <td>
                      <div className="fw-semibold text-dark">{expense.title}</div>
                      <small className="text-muted d-block d-md-none mt-1">
                        {formatDate(expense.date)}
                      </small>
                    </td>

                    {/* Category */}
                    <td>
                      <span className={`badge-category badge-${category}`}>
                        <i className={`bi ${iconClass}`}></i>
                        <span>{category}</span>
                      </span>
                    </td>

                    {/* Date */}
                    <td className="text-muted" style={{ fontSize: '0.92rem' }}>
                      <i className="bi bi-calendar3 me-1 small"></i>
                      {formatDate(expense.date)}
                    </td>

                    {/* Amount */}
                    <td className="text-end">
                      <span className="amount-display text-primary">
                        {formatCurrency(expense.amount)}
                      </span>
                    </td>

                    {/* Actions: Edit & Delete */}
                    <td>
                      <div className="d-flex justify-content-center gap-2">
                        {/* Edit Button */}
                        <button
                          type="button"
                          className="btn-action btn-edit"
                          title="Edit Expense"
                          onClick={() => onEdit(expense)}
                        >
                          <i className="bi bi-pencil"></i>
                        </button>

                        {/* Delete Button */}
                        <button
                          type="button"
                          className="btn-action btn-delete"
                          title="Delete Expense"
                          onClick={() => onDeleteRequest(expense)}
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ExpenseList;
