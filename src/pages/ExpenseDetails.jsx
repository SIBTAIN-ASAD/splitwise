import React from 'react';

const ExpenseDetails = ({ expense, onClose }) => {
  return (
    <div className='popup fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-900 bg-opacity-50'>
      <div className='popup-content bg-white px-8 py-6 rounded-lg border border-gray-300 shadow-lg w-96 px-auto flex flex-justify-center flex-col'>
        <h2 className='text-xl font-bold mb-4 mx-auto'>Expense Details</h2>
        <p className="mb-2"><span className="font-semibold">Description:</span> {expense.description}</p>
        <p className="mb-2"><span className="font-semibold">Total:</span> {expense.totalExpense}</p>
        <p className="mb-2"><span className="font-semibold">Added By:</span> {expense.addedBy}</p>
        <p className="mb-2"><span className="font-semibold">Date:</span> {expense.date}</p>
        <div className="mx-auto my-4">
          <img src={expense.photo} alt="Expense" className="w-40 h-auto rounded-lg" />
        </div>
        <button
          onClick={onClose}
          className='bg-blue-800 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:bg-blue-700'
        >
          OK
        </button>
      </div>
    </div>
  );
};

export default ExpenseDetails;
