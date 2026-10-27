/**
 * Expense Table & List View Component
 * Author: Aadith Krishna
 * Exit Examination: Full Stack Development (MERN)
 */

import React, { useState } from 'react';
import { formatCurrencyINR, formatCalendarDate } from '../utils/formatters';

const ExpenseList = ({
  expenses = [],
  onEdit,
  onDeleteRequest,
  isLoading,
}) => {
  const [queryTerm, setQueryTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [sortCriteria, setSortCriteria] = useState('date-desc');

  const categoryIconMap = {
    Food: 'bi-cup-hot-fill',
    Travel: 'bi-airplane-fill',
    Bills: 'bi-receipt-cutoff',
    Shopping: 'bi-bag-check-fill',
    Other: 'bi-tag-fill',
  };

  // Filter & Search computation
  const visibleExpenses = expenses
    .filter((entry) => {
      const matchText = entry.title?.toLowerCase().includes(queryTerm.toLowerCase().trim());
      const matchCat = filterCategory === 'All' || entry.category === filterCategory;
      return matchText && matchCat;
    })
    .sort((a, b) => {
      if (sortCriteria === 'date-desc') return new Date(b.date) - new Date(a.date);
      if (sortCriteria === 'date-asc') return new Date(a.date) - new Date(b.date);
      if (sortCriteria === 'amount-desc') return (Number(b.amount) || 0) - (Number(a.amount) || 0);
      if (sortCriteria === 'amount-asc') return (Number(a.amount) || 0) - (Number(b.amount) || 0);
      return 0;
    });

  return (
    <div className="xtr-panel">
      {/* Header & Controls */}
      <div className="xtr-panel-header flex-column flex-md-row align-items-md-center gap-3">
        <div>
          <h5 className="mb-0 fw-bold">Expense Ledger</h5>
          <small className="text-muted">
            Displaying {visibleExpenses.length} of {expenses.length} records
          </small>
        </div>

        {/* Search, Filter & Sort */}
        <div className="d-flex flex-wrap gap-2 w-100 w-md-auto">
          {/* Search box */}
          <div className="input-group" style={{ minWidth: '190px', flex: '1 1 auto' }}>
            <span className="input-group-text bg-light border-end-0 text-muted">
              <i className="bi bi-search"></i>
            </span>
            <input
              type="text"
              className="form-control xtr-input border-start-0 py-2"
              placeholder="Search by title..."
              value={queryTerm}
              onChange={(e) => setQueryTerm(e.target.value)}
            />
            {queryTerm && (
              <button
                className="btn btn-outline-secondary border-start-0"
                type="button"
                onClick={() => setQueryTerm('')}
              >
                <i className="bi bi-x"></i>
              </button>
            )}
          </div>

          {/* Category Dropdown */}
          <select
            className="form-select xtr-select py-2"
            style={{ width: 'auto' }}
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
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
            className="form-select xtr-select py-2"
            style={{ width: 'auto' }}
            value={sortCriteria}
            onChange={(e) => setSortCriteria(e.target.value)}
          >
            <option value="date-desc">Newest First</option>
            <option value="date-asc">Oldest First</option>
            <option value="amount-desc">Amount: High to Low</option>
            <option value="amount-asc">Amount: Low to High</option>
          </select>
        </div>
      </div>

      {/* Content table or empty state */}
      {isLoading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Fetching ledger...</span>
          </div>
          <p className="text-muted mt-2">Retrieving records from database...</p>
        </div>
      ) : visibleExpenses.length === 0 ? (
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
            <i className="bi bi-folder2-open"></i>
          </div>
          <h6 className="fw-bold text-dark">No Matching Expenses</h6>
          <p className="text-muted small mb-3">
            {expenses.length === 0
              ? 'Your ledger is empty. Add your first expense above.'
              : 'No expense records found matching current search/filter criteria.'}
          </p>
          {(queryTerm || filterCategory !== 'All') && (
            <button
              className="btn btn-sm btn-outline-primary rounded-pill px-3"
              onClick={() => {
                setQueryTerm('');
                setFilterCategory('All');
              }}
            >
              Reset Filters
            </button>
          )}
        </div>
      ) : (
        <div className="table-responsive">
          <table className="xtr-data-table">
            <thead>
              <tr>
                <th style={{ width: '35%' }}>Description / Title</th>
                <th style={{ width: '20%' }}>Category</th>
                <th style={{ width: '18%' }}>Date</th>
                <th style={{ width: '15%' }} className="text-end">Amount</th>
                <th style={{ width: '12%' }} className="text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {visibleExpenses.map((expense) => {
                const uniqueKey = expense._id || expense.id;
                const cat = expense.category || 'Other';
                const iconCls = categoryIconMap[cat] || 'bi-tag-fill';

                return (
                  <tr key={uniqueKey}>
                    {/* Title */}
                    <td>
                      <div className="fw-semibold text-dark">{expense.title}</div>
                      <small className="text-muted d-block d-md-none mt-1">
                        {formatCalendarDate(expense.date)}
                      </small>
                    </td>

                    {/* Category */}
                    <td>
                      <span className={`xtr-badge-cat xtr-cat-${cat}`}>
                        <i className={`bi ${iconCls}`}></i>
                        <span>{cat}</span>
                      </span>
                    </td>

                    {/* Date */}
                    <td className="text-secondary small">
                      <i className="bi bi-calendar3 me-1"></i>
                      {formatCalendarDate(expense.date)}
                    </td>

                    {/* Amount */}
                    <td className="text-end">
                      <span className="fw-bold text-dark" style={{ fontSize: '1.02rem' }}>
                        {formatCurrencyINR(expense.amount)}
                      </span>
                    </td>

                    {/* Actions: Edit & Delete */}
                    <td>
                      <div className="d-flex justify-content-center gap-2">
                        <button
                          type="button"
                          className="xtr-action-btn xtr-btn-edit"
                          title="Edit this record"
                          onClick={() => onEdit(expense)}
                        >
                          <i className="bi bi-pencil-fill" style={{ fontSize: '0.85rem' }}></i>
                        </button>
                        <button
                          type="button"
                          className="xtr-action-btn xtr-btn-delete"
                          title="Delete this record"
                          onClick={() => onDeleteRequest(expense)}
                        >
                          <i className="bi bi-trash3-fill" style={{ fontSize: '0.85rem' }}></i>
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
