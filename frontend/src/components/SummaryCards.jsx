import React from 'react';

const SummaryCards = ({ expenses = [], totalAmount = 0 }) => {
  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
    }).format(val || 0);
  };

  // Find highest single expense
  const highestExpense = expenses.length > 0
    ? Math.max(...expenses.map((e) => Number(e.amount) || 0))
    : 0;

  // Calculate category breakdowns
  const categoryTotals = expenses.reduce((acc, curr) => {
    const cat = curr.category || 'Other';
    acc[cat] = (acc[cat] || 0) + (Number(curr.amount) || 0);
    return acc;
  }, {});

  const categories = ['Food', 'Travel', 'Bills', 'Shopping', 'Other'];

  const categoryIcons = {
    Food: 'bi-cup-hot-fill',
    Travel: 'bi-airplane-fill',
    Bills: 'bi-receipt-cutoff',
    Shopping: 'bi-bag-check-fill',
    Other: 'bi-tag-fill',
  };

  return (
    <div className="mb-4">
      <div className="row g-3">
        {/* Total Amount Spent Card (Hero Requirement) */}
        <div className="col-12 col-md-4">
          <div className="stat-card primary-gradient h-100">
            <div className="d-flex justify-content-between align-items-start mb-2">
              <span className="text-white-50 small text-uppercase fw-bold" style={{ letterSpacing: '0.05em' }}>
                Total Amount Spent
              </span>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  background: 'rgba(255, 255, 255, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <i className="bi bi-cash-stack fs-5"></i>
              </div>
            </div>
            <h2 className="display-6 fw-bold mb-1 text-white">{formatCurrency(totalAmount)}</h2>
            <p className="text-white-50 small mb-0">
              Updated automatically across all records
            </p>
          </div>
        </div>

        {/* Total Transactions Card */}
        <div className="col-6 col-md-4">
          <div className="stat-card h-100">
            <div className="d-flex justify-content-between align-items-start mb-2">
              <span className="text-muted small text-uppercase fw-bold">
                Total Expenses
              </span>
              <div className="stat-icon-wrapper" style={{ background: '#eef2ff', color: '#4f46e5' }}>
                <i className="bi bi-card-checklist"></i>
              </div>
            </div>
            <h3 className="fw-bold mb-1 text-dark">{expenses.length}</h3>
            <p className="text-muted small mb-0">Recorded entries in database</p>
          </div>
        </div>

        {/* Highest Single Expense Card */}
        <div className="col-6 col-md-4">
          <div className="stat-card h-100">
            <div className="d-flex justify-content-between align-items-start mb-2">
              <span className="text-muted small text-uppercase fw-bold">
                Highest Expense
              </span>
              <div className="stat-icon-wrapper" style={{ background: '#fffbeb', color: '#d97706' }}>
                <i className="bi bi-graph-up-arrow"></i>
              </div>
            </div>
            <h3 className="fw-bold mb-1 text-dark">{formatCurrency(highestExpense)}</h3>
            <p className="text-muted small mb-0">Single largest transaction</p>
          </div>
        </div>
      </div>

      {/* Quick Category Summary Pills */}
      {expenses.length > 0 && (
        <div className="d-flex flex-wrap gap-2 mt-3 p-3 bg-white rounded-3 border">
          <span className="small fw-bold text-muted align-self-center me-2">By Category:</span>
          {categories.map((cat) => {
            const sum = categoryTotals[cat] || 0;
            return (
              <div
                key={cat}
                className={`badge-category badge-${cat} d-flex align-items-center gap-1`}
                style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}
              >
                <i className={`bi ${categoryIcons[cat]}`}></i>
                <span>{cat}:</span>
                <span className="fw-bold">{formatCurrency(sum)}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SummaryCards;
