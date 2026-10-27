import React from 'react';

const ConfirmModal = ({ isOpen, expense, onConfirm, onCancel, isDeleting }) => {
  if (!isOpen || !expense) return null;

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(val || 0);
  };

  return (
    <div
      className="modal fade show d-block"
      tabIndex="-1"
      style={{ backgroundColor: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(4px)' }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '16px' }}>
          <div className="modal-body p-4 text-center">
            <div
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: '#fee2e2',
                color: '#dc2626',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.75rem',
                marginBottom: '1.25rem',
              }}
            >
              <i className="bi bi-exclamation-triangle"></i>
            </div>

            <h5 className="fw-bold mb-2">Delete Expense Confirmation</h5>
            <p className="text-muted mb-3" style={{ fontSize: '0.95rem' }}>
              Are you sure you want to permanently remove this expense record from the database?
            </p>

            <div className="p-3 bg-light rounded-3 mb-4 text-start border">
              <div className="d-flex justify-content-between align-items-center mb-1">
                <span className="text-muted small">Title:</span>
                <span className="fw-bold text-dark">{expense.title}</span>
              </div>
              <div className="d-flex justify-content-between align-items-center mb-1">
                <span className="text-muted small">Amount:</span>
                <span className="fw-bold text-danger">{formatCurrency(expense.amount)}</span>
              </div>
              <div className="d-flex justify-content-between align-items-center">
                <span className="text-muted small">Category:</span>
                <span className="badge bg-secondary-subtle text-secondary small">{expense.category}</span>
              </div>
            </div>

            <div className="d-flex justify-content-end gap-2">
              <button
                type="button"
                className="btn btn-light rounded-pill px-4"
                onClick={onCancel}
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-danger rounded-pill px-4 d-inline-flex align-items-center gap-2"
                onClick={onConfirm}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <i className="bi bi-trash"></i>
                    <span>Yes, Delete</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
