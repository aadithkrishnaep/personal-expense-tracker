import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import SummaryCards from './components/SummaryCards';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import ConfirmModal from './components/ConfirmModal';
import {
  getExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
} from './services/api';

function App() {
  const [expenses, setExpenses] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [expenseToDelete, setExpenseToDelete] = useState(null);

  // Notification Banner (Success / Error)
  const [notification, setNotification] = useState(null);

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification((current) => (current?.message === message ? null : current));
    }, 4500);
  };

  // Fetch expenses and update total
  const loadExpenses = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getExpenses();
      if (response && response.success) {
        setExpenses(response.data || []);
        setTotalAmount(response.totalAmount || 0);
      }
    } catch (err) {
      showNotification('danger', err.message || 'Failed to load expenses.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadExpenses();
  }, [loadExpenses]);

  // Handle Form Submit (Add or Edit)
  const handleFormSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      if (editingExpense) {
        const id = editingExpense._id || editingExpense.id;
        const result = await updateExpense(id, formData);
        showNotification('success', result.message || 'Expense updated successfully!');
        setEditingExpense(null);
      } else {
        const result = await createExpense(formData);
        showNotification('success', result.message || 'Expense added successfully!');
      }

      // Automatically refresh expense list & summary without manual reload
      await loadExpenses();
    } catch (err) {
      showNotification('danger', err.message || 'An error occurred while saving.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Start Editing Expense
  const handleEditClick = (expense) => {
    setEditingExpense(expense);
    // Smooth scroll to form
    const formElement = document.getElementById('expense-form-card');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Cancel Editing
  const handleCancelEdit = () => {
    setEditingExpense(null);
  };

  // Delete Request (Opens confirmation modal)
  const handleDeleteRequest = (expense) => {
    setExpenseToDelete(expense);
  };

  // Confirm and Execute Deletion
  const handleConfirmDelete = async () => {
    if (!expenseToDelete) return;

    setIsDeleting(true);
    try {
      const id = expenseToDelete._id || expenseToDelete.id;
      const result = await deleteExpense(id);
      showNotification('success', result.message || 'Expense deleted successfully!');
      setExpenseToDelete(null);

      // Automatically refresh expense list & summary
      await loadExpenses();
    } catch (err) {
      showNotification('danger', err.message || 'Failed to delete expense.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex flex-column bg-light">
      {/* Top Navigation */}
      <Navbar />

      <main className="container py-4 flex-grow-1">
        {/* Global Notification Banner */}
        {notification && (
          <div
            className={`alert alert-${notification.type} toast-custom alert-dismissible fade show`}
            role="alert"
          >
            <div className="d-flex align-items-center gap-2">
              <i
                className={`bi ${
                  notification.type === 'success'
                    ? 'bi-check-circle-fill text-success fs-5'
                    : 'bi-exclamation-triangle-fill text-danger fs-5'
                }`}
              ></i>
              <span className="fw-medium">{notification.message}</span>
            </div>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={() => setNotification(null)}
            ></button>
          </div>
        )}

        {/* Total Summary Cards at Top */}
        <SummaryCards expenses={expenses} totalAmount={totalAmount} />

        {/* Add / Edit Form */}
        <ExpenseForm
          onSubmit={handleFormSubmit}
          editingExpense={editingExpense}
          onCancelEdit={handleCancelEdit}
          isSubmitting={isSubmitting}
        />

        {/* Expenses List & History */}
        <ExpenseList
          expenses={expenses}
          onEdit={handleEditClick}
          onDeleteRequest={handleDeleteRequest}
          isLoading={isLoading}
        />
      </main>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(expenseToDelete)}
        expense={expenseToDelete}
        onConfirm={handleConfirmDelete}
        onCancel={() => setExpenseToDelete(null)}
        isDeleting={isDeleting}
      />

      {/* Footer */}
      <footer className="bg-white border-top py-3 text-center text-muted small mt-auto">
        <div className="container">
          <p className="mb-0">
            Personal Expense Tracker &bull; Exit Examination: Full Stack Development (MERN) &bull; Built by Aadith Krishna
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
