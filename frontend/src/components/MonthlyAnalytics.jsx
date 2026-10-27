import React, { useState, useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const MonthlyAnalytics = ({ expenses = [] }) => {
  const [chartType, setChartType] = useState('bar'); // 'bar' | 'line' | 'doughnut'
  const [selectedYear, setSelectedYear] = useState('All');

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val || 0);
  };

  // Group expenses by Month (e.g., '2026-07' -> 'Jul 2026')
  const monthlyData = useMemo(() => {
    const map = {};
    const yearsSet = new Set();

    expenses.forEach((item) => {
      if (!item.date) return;
      const d = new Date(item.date);
      if (isNaN(d.getTime())) return;

      const year = d.getFullYear();
      yearsSet.add(year.toString());

      if (selectedYear !== 'All' && year.toString() !== selectedYear) {
        return;
      }

      // Key format: YYYY-MM for chronological sorting
      const monthKey = `${year}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const monthLabel = d.toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric',
      });

      if (!map[monthKey]) {
        map[monthKey] = {
          key: monthKey,
          label: monthLabel,
          total: 0,
          count: 0,
          categories: {
            Food: 0,
            Travel: 0,
            Bills: 0,
            Shopping: 0,
            Other: 0,
          },
        };
      }

      const amt = Number(item.amount) || 0;
      map[monthKey].total += amt;
      map[monthKey].count += 1;

      const cat = item.category || 'Other';
      if (map[monthKey].categories[cat] !== undefined) {
        map[monthKey].categories[cat] += amt;
      } else {
        map[monthKey].categories.Other += amt;
      }
    });

    const sortedKeys = Object.keys(map).sort();
    const sortedList = sortedKeys.map((k) => map[k]);

    return {
      list: sortedList,
      years: Array.from(yearsSet).sort().reverse(),
    };
  }, [expenses, selectedYear]);

  // Overall category distribution across selected period
  const categoryTotals = useMemo(() => {
    const cats = { Food: 0, Travel: 0, Bills: 0, Shopping: 0, Other: 0 };
    expenses.forEach((item) => {
      if (!item.date) return;
      const d = new Date(item.date);
      if (isNaN(d.getTime())) return;
      if (selectedYear !== 'All' && d.getFullYear().toString() !== selectedYear) {
        return;
      }
      const cat = item.category || 'Other';
      const amt = Number(item.amount) || 0;
      if (cats[cat] !== undefined) {
        cats[cat] += amt;
      } else {
        cats.Other += amt;
      }
    });
    return cats;
  }, [expenses, selectedYear]);

  // Statistical calculations
  const totalPeriodSpend = monthlyData.list.reduce((sum, m) => sum + m.total, 0);
  const avgMonthlySpend = monthlyData.list.length > 0 ? totalPeriodSpend / monthlyData.list.length : 0;
  
  const peakMonth = monthlyData.list.length > 0
    ? monthlyData.list.reduce((max, m) => (m.total > max.total ? m : max), monthlyData.list[0])
    : null;

  // Chart 1: Bar Chart Data
  const barChartData = {
    labels: monthlyData.list.map((m) => m.label),
    datasets: [
      {
        label: 'Monthly Spending (₹)',
        data: monthlyData.list.map((m) => m.total),
        backgroundColor: 'rgba(99, 102, 241, 0.85)',
        hoverBackgroundColor: 'rgba(79, 70, 229, 1)',
        borderRadius: 8,
        borderSkipped: false,
        barPercentage: 0.55,
      },
    ],
  };

  // Chart 2: Line Chart Data
  const lineChartData = {
    labels: monthlyData.list.map((m) => m.label),
    datasets: [
      {
        label: 'Monthly Trend (₹)',
        data: monthlyData.list.map((m) => m.total),
        borderColor: '#4f46e5',
        backgroundColor: 'rgba(99, 102, 241, 0.15)',
        tension: 0.35,
        fill: true,
        pointBackgroundColor: '#4f46e5',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
      },
    ],
  };

  // Chart 3: Doughnut Chart Data (Category Distribution)
  const doughnutData = {
    labels: ['Food', 'Travel', 'Bills', 'Shopping', 'Other'],
    datasets: [
      {
        data: [
          categoryTotals.Food,
          categoryTotals.Travel,
          categoryTotals.Bills,
          categoryTotals.Shopping,
          categoryTotals.Other,
        ],
        backgroundColor: [
          '#f59e0b', // Food
          '#0ea5e9', // Travel
          '#ef4444', // Bills
          '#8b5cf6', // Shopping
          '#64748b', // Other
        ],
        borderWidth: 2,
        borderColor: '#ffffff',
        hoverOffset: 6,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: chartType === 'doughnut',
        position: 'bottom',
        labels: {
          boxWidth: 14,
          padding: 16,
          font: { family: 'Inter', size: 12, weight: '500' },
        },
      },
      tooltip: {
        backgroundColor: '#0f172a',
        titleFont: { family: 'Inter', size: 13, weight: '600' },
        bodyFont: { family: 'Inter', size: 12 },
        padding: 12,
        cornerRadius: 8,
        callbacks: {
          label: (context) => {
            const val = context.raw || 0;
            return ` Spend: ${formatCurrency(val)}`;
          },
        },
      },
    },
    scales:
      chartType === 'doughnut'
        ? {}
        : {
            x: {
              grid: { display: false },
              ticks: { font: { family: 'Inter', size: 12, weight: '500' }, color: '#64748b' },
            },
            y: {
              grid: { color: '#f1f5f9' },
              ticks: {
                font: { family: 'Inter', size: 11 },
                color: '#64748b',
                callback: (val) => '₹' + val.toLocaleString('en-IN'),
              },
            },
          },
  };

  if (expenses.length === 0) {
    return null;
  }

  return (
    <div className="content-card shadow-sm mb-4">
      {/* Header and Controls */}
      <div className="card-header-custom flex-column flex-md-row align-items-md-center gap-3">
        <div className="d-flex align-items-center gap-2">
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: '#e0e7ff',
              color: '#4f46e5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.1rem',
            }}
          >
            <i className="bi bi-bar-chart-line-fill"></i>
          </div>
          <div>
            <h5 className="mb-0 fw-bold">Monthly Spending Analytics</h5>
            <small className="text-muted">
              Visual monthly expense patterns and distribution
            </small>
          </div>
        </div>

        {/* View Toggle & Year Filter */}
        <div className="d-flex align-items-center gap-2 flex-wrap">
          {monthlyData.years.length > 1 && (
            <select
              className="form-select form-select-custom py-1 px-3"
              style={{ width: 'auto', fontSize: '0.875rem' }}
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
            >
              <option value="All">All Years</option>
              {monthlyData.years.map((y) => (
                <option key={y} value={y}>
                  Year {y}
                </option>
              ))}
            </select>
          )}

          <div className="btn-group" role="group">
            <button
              type="button"
              className={`btn btn-sm ${
                chartType === 'bar' ? 'btn-primary' : 'btn-outline-secondary'
              }`}
              onClick={() => setChartType('bar')}
              title="Monthly Bar Chart"
            >
              <i className="bi bi-bar-chart-fill me-1"></i> Bar
            </button>
            <button
              type="button"
              className={`btn btn-sm ${
                chartType === 'line' ? 'btn-primary' : 'btn-outline-secondary'
              }`}
              onClick={() => setChartType('line')}
              title="Monthly Trend Line"
            >
              <i className="bi bi-graph-up me-1"></i> Trend
            </button>
            <button
              type="button"
              className={`btn btn-sm ${
                chartType === 'doughnut' ? 'btn-primary' : 'btn-outline-secondary'
              }`}
              onClick={() => setChartType('doughnut')}
              title="Category Distribution"
            >
              <i className="bi bi-pie-chart-fill me-1"></i> Breakdown
            </button>
          </div>
        </div>
      </div>

      {/* Monthly Summary Badges */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-md-4">
          <div className="p-3 rounded-3 bg-light border d-flex align-items-center justify-content-between">
            <div>
              <span className="text-muted small d-block">Monthly Average</span>
              <h5 className="fw-bold mb-0 text-dark">{formatCurrency(avgMonthlySpend)}</h5>
            </div>
            <div className="text-primary fs-3">
              <i className="bi bi-calculator"></i>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-4">
          <div className="p-3 rounded-3 bg-light border d-flex align-items-center justify-content-between">
            <div>
              <span className="text-muted small d-block">Peak Spending Month</span>
              <h5 className="fw-bold mb-0 text-danger">
                {peakMonth ? `${peakMonth.label}` : 'N/A'}
              </h5>
              {peakMonth && (
                <small className="text-muted">{formatCurrency(peakMonth.total)}</small>
              )}
            </div>
            <div className="text-danger fs-3">
              <i className="bi bi-fire"></i>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-4">
          <div className="p-3 rounded-3 bg-light border d-flex align-items-center justify-content-between">
            <div>
              <span className="text-muted small d-block">Active Months Tracked</span>
              <h5 className="fw-bold mb-0 text-dark">
                {monthlyData.list.length} {monthlyData.list.length === 1 ? 'Month' : 'Months'}
              </h5>
            </div>
            <div className="text-success fs-3">
              <i className="bi bi-calendar-check"></i>
            </div>
          </div>
        </div>
      </div>

      {/* Chart Canvas Area */}
      <div style={{ height: '320px', position: 'relative' }}>
        {monthlyData.list.length === 0 ? (
          <div className="d-flex align-items-center justify-content-center h-100 text-muted">
            No monthly data available for the selected period.
          </div>
        ) : chartType === 'bar' ? (
          <Bar data={barChartData} options={chartOptions} />
        ) : chartType === 'line' ? (
          <Line data={lineChartData} options={chartOptions} />
        ) : (
          <Doughnut data={doughnutData} options={chartOptions} />
        )}
      </div>

      {/* Month-by-month quick breakdown strip */}
      {monthlyData.list.length > 0 && chartType !== 'doughnut' && (
        <div className="d-flex flex-nowrap overflow-auto gap-3 mt-4 pt-3 border-top pb-1">
          {monthlyData.list.map((m) => (
            <div
              key={m.key}
              className="p-2 px-3 rounded-3 border bg-white flex-shrink-0 text-center"
              style={{ minWidth: '130px' }}
            >
              <div className="small fw-bold text-dark">{m.label}</div>
              <div className="fw-bold text-primary" style={{ fontSize: '0.95rem' }}>
                {formatCurrency(m.total)}
              </div>
              <small className="text-muted" style={{ fontSize: '0.75rem' }}>
                {m.count} {m.count === 1 ? 'expense' : 'expenses'}
              </small>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MonthlyAnalytics;
