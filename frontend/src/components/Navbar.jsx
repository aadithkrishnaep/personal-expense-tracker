import React from 'react';

const Navbar = () => {
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <nav className="navbar navbar-expand-lg bg-white border-bottom py-3 sticky-top shadow-sm">
      <div className="container">
        <div className="d-flex align-items-center gap-2">
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              fontSize: '1.25rem',
            }}
          >
            <i className="bi bi-wallet2"></i>
          </div>
          <div>
            <span className="navbar-brand-custom mb-0 h5">ExpenseTrack</span>
            <small className="text-muted d-block" style={{ fontSize: '0.75rem', marginTop: '-3px' }}>
              Personal Expense Manager (MERN)
            </small>
          </div>
        </div>

        <div className="d-none d-md-flex align-items-center gap-3">
          <div className="badge bg-light text-dark border px-3 py-2 rounded-pill d-flex align-items-center gap-2">
            <i className="bi bi-calendar3 text-primary"></i>
            <span style={{ fontWeight: 500 }}>{today}</span>
          </div>
          <div className="badge bg-success-subtle text-success border border-success-subtle px-3 py-2 rounded-pill d-flex align-items-center gap-1">
            <span className="spinner-grow spinner-grow-sm" style={{ width: '8px', height: '8px' }}></span>
            <span>Atlas Live Sync</span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
