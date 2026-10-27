/**
 * Summary Analytics Cards Component
 * Author: Aadith Krishna
 * Exit Examination: Full Stack Development (MERN)
 */

import React from 'react';
import { formatCurrencyINR } from '../utils/formatters';

const SummaryCards = ({ expenses = [], totalAmount = 0, computedMetrics = {} }) => {
  const peakAmount = computedMetrics.peakExpenditure ?? 0;
  const count = computedMetrics.recordCount ?? expenses.length;
  const categoryMap = computedMetrics.categoryDistribution ?? {};

  const categories = ['Food', 'Travel', 'Bills', 'Shopping', 'Other'];

  const categoryIcons = {
    Food: 'bi-cup-hot-fill',
    Travel: 'bi-airplane-fill',
    Bills: 'bi-receipt-cutoff',
    Shopping: 'bi-bag-check-fill',
    Other: 'bi-tag-fill',
  };

  return (
    <section className="mb-4" aria-label="Financial Summary Cards">
      <div className="row g-3">
        {/* Total Amount Spent Card (Core Requirement) */}
        <div className="col-12 col-md-4">
          <div className="xtr-metric-card xtr-metric-hero">
            <div className="d-flex justify-content-between align-items-start mb-2">
              <span className="text-white-50 small text-uppercase fw-bold" style={{ letterSpacing: '0.06em' }}>
                Total Expenditure
              </span>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  background: 'rgba(255, 255, 255, 0.18)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <i className="bi bi-wallet2 text-white fs-5"></i>
              </div>
            </div>
            <h2 className="display-6 fw-bold mb-1 text-white">{formatCurrencyINR(totalAmount)}</h2>
            <p className="text-white-50 small mb-0">
              Synchronized automatically across all CRUD operations
            </p>
          </div>
        </div>

        {/* Transaction Count Card */}
        <div className="col-6 col-md-4">
          <div className="xtr-metric-card">
            <div className="d-flex justify-content-between align-items-start mb-2">
              <span className="text-muted small text-uppercase fw-bold">
                Logged Transactions
              </span>
              <div className="xtr-metric-icon" style={{ background: '#eef2ff', color: '#4338ca' }}>
                <i className="bi bi-receipt"></i>
              </div>
            </div>
            <h3 className="fw-bold mb-1 text-dark">{count}</h3>
            <p className="text-muted small mb-0">Database ledger records</p>
          </div>
        </div>

        {/* Peak Single Expense Card */}
        <div className="col-6 col-md-4">
          <div className="xtr-metric-card">
            <div className="d-flex justify-content-between align-items-start mb-2">
              <span className="text-muted small text-uppercase fw-bold">
                Peak Transaction
              </span>
              <div className="xtr-metric-icon" style={{ background: '#fffbeb', color: '#b45309' }}>
                <i className="bi bi-arrow-up-right-circle-fill"></i>
              </div>
            </div>
            <h3 className="fw-bold mb-1 text-dark">{formatCurrencyINR(peakAmount)}</h3>
            <p className="text-muted small mb-0">Highest individual entry</p>
          </div>
        </div>
      </div>

      {/* Category breakdown pill strip */}
      {expenses.length > 0 && (
        <div className="d-flex flex-wrap gap-2 mt-3 p-3 bg-white rounded-3 border">
          <span className="small fw-bold text-muted align-self-center me-2">By Category:</span>
          {categories.map((cat) => {
            const sum = categoryMap[cat] || 0;
            return (
              <div
                key={cat}
                className={`xtr-badge-cat xtr-cat-${cat}`}
                style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}
              >
                <i className={`bi ${categoryIcons[cat]}`}></i>
                <span>{cat}:</span>
                <span className="fw-bold">{formatCurrencyINR(sum)}</span>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default SummaryCards;
