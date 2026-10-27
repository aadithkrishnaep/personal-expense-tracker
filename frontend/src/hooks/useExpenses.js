/**
 * Custom React Hook: useExpenses
 * Manages expense state, CRUD operations, notifications, and computed financial metrics
 * Author: Aadith Krishna
 * Exit Examination: Full Stack Development (MERN)
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  getExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
} from '../services/api';

export const useExpenses = () => {
  const [expenseList, setExpenseList] = useState([]);
  const [totalSpent, setTotalSpent] = useState(0);
  const [isFetching, setIsFetching] = useState(false);
  const [isMutating, setIsMutating] = useState(false);
  const [activeNotification, setActiveNotification] = useState(null);
  const [activeEditingItem, setActiveEditingItem] = useState(null);
  const [itemMarkedForDeletion, setItemMarkedForDeletion] = useState(null);

  // Trigger feedback notification with self-clearing timer
  const pushNotification = useCallback((variant, message) => {
    setActiveNotification({ variant, message });
    const timer = setTimeout(() => {
      setActiveNotification((current) => (current?.message === message ? null : current));
    }, 4500);
    return () => clearTimeout(timer);
  }, []);

  const dismissNotification = useCallback(() => {
    setActiveNotification(null);
  }, []);

  // Fetch all expense records from backend API
  const refreshExpenses = useCallback(async () => {
    setIsFetching(true);
    try {
      const response = await getExpenses();
      if (response?.success) {
        setExpenseList(response.data || []);
        setTotalSpent(response.totalAmount || 0);
      }
    } catch (err) {
      pushNotification('danger', err.message || 'Unable to sync expenses with server.');
    } finally {
      setIsFetching(false);
    }
  }, [pushNotification]);

  // Initial mount fetch
  useEffect(() => {
    refreshExpenses();
  }, [refreshExpenses]);

  // Handle Create or Update
  const saveExpense = useCallback(
    async (formData) => {
      setIsMutating(true);
      try {
        if (activeEditingItem) {
          const id = activeEditingItem._id || activeEditingItem.id;
          const result = await updateExpense(id, formData);
          pushNotification('success', result.message || 'Expense successfully modified.');
          setActiveEditingItem(null);
        } else {
          const result = await createExpense(formData);
          pushNotification('success', result.message || 'New expense successfully recorded.');
        }
        await refreshExpenses();
        return true;
      } catch (err) {
        pushNotification('danger', err.message || 'Expense operation encountered an error.');
        return false;
      } finally {
        setIsMutating(false);
      }
    },
    [activeEditingItem, refreshExpenses, pushNotification]
  );

  // Handle Delete
  const confirmDeletion = useCallback(async () => {
    if (!itemMarkedForDeletion) return;
    setIsMutating(true);
    try {
      const targetId = itemMarkedForDeletion._id || itemMarkedForDeletion.id;
      const res = await deleteExpense(targetId);
      pushNotification('success', res.message || 'Expense record removed.');
      setItemMarkedForDeletion(null);
      await refreshExpenses();
    } catch (err) {
      pushNotification('danger', err.message || 'Failed to remove expense record.');
    } finally {
      setIsMutating(false);
    }
  }, [itemMarkedForDeletion, refreshExpenses, pushNotification]);

  // Derived financial analytics
  const computedMetrics = useMemo(() => {
    const count = expenseList.length;
    const peak = count > 0 ? Math.max(...expenseList.map((e) => Number(e.amount) || 0)) : 0;

    const categoryDistribution = expenseList.reduce((acc, curr) => {
      const cat = curr.category || 'Other';
      acc[cat] = (acc[cat] || 0) + (Number(curr.amount) || 0);
      return acc;
    }, {});

    return {
      recordCount: count,
      peakExpenditure: peak,
      categoryDistribution,
    };
  }, [expenseList]);

  return {
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
    pushNotification,
    dismissNotification,
    refreshExpenses,
    saveExpense,
    confirmDeletion,
  };
};
