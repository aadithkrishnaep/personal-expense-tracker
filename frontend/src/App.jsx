/**
 * Primary Application Container
 * Personal Expense Tracker - MERN Stack
 * Candidate: Aadith Krishna
 * Exit Examination: Full Stack Development (MERN)
 */

import React from 'react';
import Navbar from './components/Navbar';
import SummaryCards from './components/SummaryCards';
import MonthlyAnalytics from './components/MonthlyAnalytics';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import ConfirmModal from './components/ConfirmModal';
import { useExpenses } from './hooks/useExpenses';

function App() {
  const {
    expenseList,
    totalSpent,
    computedMetrics,
    isFetching,
    isMutating,
    activeNotification,
    activeEditingItem,
    itemMarkedForDeletion,
    setActiveEditingItem,
    setItemMarkedForDeletion,
    dismissNotification,
    saveExpense,
    confirmDeletion,
  } = useExpenses();

  const handleEditRequest = (item) => {
    setActiveEditingItem(item);
    const formElement = document.getElementById('expense-form-panel');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-vh-100 d-flex flex-column bg-light">
      {/* Navigation Header */}
      <Navbar />

      <main className="container py-4 flex-grow-1">
        {/* Dynamic Alert Banner */}
        {activeNotification && (
          <div
            className={`alert alert-${activeNotification.variant} xtr-toast alert-dismissible fade show d-flex align-items-center justify-content-between`}
            role="alert"
          >
            <div className="d-flex align-items-center gap-2">
              <i
                className={`bi ${
                  activeNotification.variant === 'success'
                    ? 'bi-check-circle-fill text-success fs-5'
                    : 'bi-exclamation-triangle-fill text-danger fs-5'
                }`}
              ></i>
              <span className="fw-medium">{activeNotification.message}</span>
            </div>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={dismissNotification}
            ></button>
          </div>
        )}

        {/* 1. Live Aggregate Summary Cards */}
        <SummaryCards
          expenses={expenseList}
          totalAmount={totalSpent}
          computedMetrics={computedMetrics}
        />

        {/* 2. Interactive Monthly Spending Graphs */}
        <MonthlyAnalytics expenses={expenseList} />

        {/* 3. Add / Edit Expense Form */}
        <ExpenseForm
          onSubmit={saveExpense}
          editingExpense={activeEditingItem}
          onCancelEdit={() => setActiveEditingItem(null)}
          isSubmitting={isMutating}
        />

        {/* 4. Filterable Expense History Table */}
        <ExpenseList
          expenses={expenseList}
          onEdit={handleEditRequest}
          onDeleteRequest={(item) => setItemMarkedForDeletion(item)}
          isLoading={isFetching}
        />
      </main>

      {/* 5. Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(itemMarkedForDeletion)}
        expense={itemMarkedForDeletion}
        onConfirm={confirmDeletion}
        onCancel={() => setItemMarkedForDeletion(null)}
        isDeleting={isMutating}
      />

      {/* Footer Branding */}
      <footer className="bg-white border-top py-3 text-center text-muted small mt-auto">
        <div className="container">
          <p className="mb-0">
            FinTrack Pro &bull; Exit Examination: Full Stack Development (MERN) &bull; Aadith Krishna
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
