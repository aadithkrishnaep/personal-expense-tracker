const API_BASE = '/api/expenses';

export const getExpenses = async () => {
  const response = await fetch(API_BASE);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to fetch expenses');
  }
  return response.json();
};

export const createExpense = async (expenseData) => {
  const response = await fetch(API_BASE, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(expenseData),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || 'Failed to add expense');
  }

  return data;
};

export const updateExpense = async (id, expenseData) => {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(expenseData),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || 'Failed to update expense');
  }

  return data;
};

export const deleteExpense = async (id) => {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: 'DELETE',
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || 'Failed to delete expense');
  }

  return data;
};
