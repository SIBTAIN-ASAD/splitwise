// ExpenseDetails.jsx
import React from 'react';

const ExpenseDetails = ({ expense, onClose }) => {
  return (
    <div className='popup fixed top-0 left-0 w-full h-full flex items-center justify-center'>
      <div className='popup-content bg-white px-28 py-16 rounded-md border border-[#1F2937] shadow-lg'>
        <h2 className='text-xl font-bold mb-4'>Expense Details</h2>
        <p>Total: {expense.total}</p>
        <p>Added By: {expense.addedBy}</p>
        <p>Date: {expense.date.toDateString()}</p>
        <button
          onClick={onClose}
          className='bg-blue-800 text-white px-4 py-2 rounded-md mt-4'
        >
          OK
        </button>
      </div>
    </div>
  );
};

export default ExpenseDetails;
