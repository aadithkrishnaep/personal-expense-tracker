/**
 * Navigation Bar Component
 * Author: Aadith Krishna
 * Exit Examination: Full Stack Development (MERN)
 */

import React from 'react';

const Navbar = () => {
  const formattedToday = new Intl.DateTimeFormat('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date());

  return (
    <header className="navbar navbar-expand-lg bg-white border-bottom py-3 sticky-top shadow-sm">
      <div className="container">
        {/* Brand identity */}
        <div className="d-flex align-items-center gap-3">
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #3730a3 0%, #6366f1 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              fontSize: '1.25rem',
              boxShadow: '0 4px 10px rgba(79, 70, 229, 0.3)',
            }}
          >
            <i className="bi bi-wallet-fill"></i>
          </div>
          <div>
            <h1 className="h5 mb-0 fw-bold" style={{ letterSpacing: '-0.02em', color: '#1e1b4b' }}>
              FinTrack Pro
            </h1>
            <small className="text-muted d-block" style={{ fontSize: '0.75rem', marginTop: '-2px' }}>
              Personal Expense Manager &bull; MERN Architecture
            </small>
          </div>
        </div>

        {/* Status badges */}
        <div className="d-none d-md-flex align-items-center gap-2">
          <div className="badge bg-light text-secondary border px-3 py-2 rounded-pill d-flex align-items-center gap-2">
            <i className="bi bi-calendar4-week text-primary"></i>
            <span style={{ fontWeight: 500 }}>{formattedToday}</span>
          </div>
          <div className="badge bg-success-subtle text-success border border-success-subtle px-3 py-2 rounded-pill d-flex align-items-center gap-2">
            <span
              className="spinner-grow spinner-grow-sm"
              style={{ width: '7px', height: '7px' }}
              role="status"
            ></span>
            <span>Atlas Live Sync</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
