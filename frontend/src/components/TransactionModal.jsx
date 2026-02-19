import React, { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import './TransactionModal.css';

function TransactionModal({ isOpen, type = 'income', onClose, onSave }) {
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: type === 'income' ? 'salary' : 'food',
    date: new Date().toISOString().split('T')[0],
    notes: ''
  });

  const isIncome = type === 'income';
  const title = isIncome ? 'Record New Income' : 'Record New Expense';
  const subtitle = isIncome 
    ? 'Add details about your income to track your finances better.' 
    : 'Add details about your expense to track your spending better.';

  const incomeCategories = ['Salary', 'Freelance', 'Investment', 'Bonus', 'Other'];
  const expenseCategories = ['Food', 'Transport', 'Entertainment', 'Utilities', 'Shopping', 'Other'];
  const categories = isIncome ? incomeCategories : expenseCategories;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (!formData.description || !formData.amount) {
      alert('Please fill in description and amount');
      return;
    }
    onSave(formData);
    resetForm();
  };

  const handleOpenChange = (open) => {
    if (!open) {
      resetForm();
      onClose();
    }
  };

  const resetForm = () => {
    setFormData({
      description: '',
      amount: '',
      category: type === 'income' ? 'salary' : 'food',
      date: new Date().toISOString().split('T')[0],
      notes: ''
    });
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        {/* Overlay - Radix handles z-index, scroll, and backdrop */}
        <Dialog.Overlay className="dialog-overlay" />
        
        {/* Modal Content - Centered via Radix positioning */}
        <Dialog.Content className="dialog-content">
          {/* Header */}
          <div className="dialog-header">
            <div>
              <Dialog.Title className="dialog-title">{title}</Dialog.Title>
              <p className="dialog-subtitle">{subtitle}</p>
            </div>
            {/* Close Button */}
            <Dialog.Close asChild>
              <button className="dialog-close" aria-label="Close dialog">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </Dialog.Close>
          </div>

          {/* Form */}
          <div className="dialog-form">
            {/* Description */}
            <div>
              <label htmlFor="description" className="form-label">Description</label>
              <input
                id="description"
                type="text"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="e.g., Monthly salary"
                className="form-input"
              />
            </div>

            {/* Amount */}
            <div>
              <label htmlFor="amount" className="form-label">Amount</label>
              <div className="form-input-group">
                <span className="form-currency">$</span>
                <input
                  id="amount"
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  placeholder="0.00"
                  step="0.01"
                  className="form-input form-input-with-prefix"
                />
              </div>
            </div>

            {/* Category */}
            <div>
              <label htmlFor="category" className="form-label">Category</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="form-input"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat.toLowerCase()}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Date */}
            <div>
              <label htmlFor="date" className="form-label">Date</label>
              <input
                id="date"
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            {/* Notes */}
            <div>
              <label htmlFor="notes" className="form-label">Notes (Optional)</label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Additional notes..."
                rows="3"
                className="form-input form-textarea"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="dialog-footer">
            <Dialog.Close asChild>
              <button className="btn btn-secondary">Cancel</button>
            </Dialog.Close>
            <button onClick={handleSave} className="btn btn-primary">
              Save {isIncome ? 'Income' : 'Expense'}
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default TransactionModal;
