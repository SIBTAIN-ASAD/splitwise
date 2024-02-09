import React, { useState } from 'react';
import ExpenseDetails from './ExpenseDetails';

const Expenses = () => {
  const [selectedExpense, setSelectedExpense] = useState(null);

  const handleViewExpense = (expense) => {
    setSelectedExpense(expense);
  };

  const handleClosePopup = () => {
    setSelectedExpense(null);
  };
  const expenses = [
    {
      id: 1,
      total: 1000,
      addedBy: 'John Doe',
      date: new Date(2021, 7, 14)
    },
    {
      id: 2,
      total: 1000,
      addedBy: 'John Doe',
      date: new Date(2021, 7, 14)
    },
    {
      id: 3,
      total: 1000,
      addedBy: 'John Doe',
      date: new Date(2021, 7, 14)
    },
    {
      id: 4,
      total: 1000,
      addedBy: 'John Doe',
      date: new Date(2021, 7, 14)
    },
    {
      id: 5,
      total: 1000,
      addedBy: 'John Doe',
      date: new Date(2021, 7, 14)
    },
    {
      id: 6,
      total: 1000,
      addedBy: 'John Doe',
      date: new Date(2021, 7, 14)
    },
    {
      id: 7,
      total: 1000,
      addedBy: 'John Doe',
      date: new Date(2021, 7, 14)
    },
    {
      id: 8,
      total: 1000,
      addedBy: 'John Doe',
      date: new Date(2021, 7, 14)
    },
    {
      id: 9,
      total: 1000,
      addedBy: 'John Doe',
      date: new Date(2021, 7, 14)
    },
    {
      id: 10,
      total: 1000,
      addedBy: 'John Doe',
      date: new Date(2021, 7, 14)
    }
  ];

  return (
    <section className='flex justify-center items-center py-16 px-10 md:px-1 relative'>
      <div className='w-3/5 flex flex-col gap-8'>
        <div>
          <div>
            <h1 className='text-primary text-3xl text-left p-0 m-0'>Total Expenses</h1>
            <hr className='border border-blue-800 my-1 w-32' />
            <hr className='border border-blue-800 mb-5 w-28' />
          </div>
          <p className='text-gray-600'>
            Our mission is a relentless pursuit of compassion and empowerment. We stand committed to aiding the vulnerable, the marginalized, and the oppressed. We are dedicated to providing the resources and support necessary to help them thrive.
          </p>
        </div>
        <div className='flex flex-col gap-2'>
          {expenses.map((expense) => (
            <div key={expense.id} className='flex flex-row justify-between bg-blue-800 bg-opacity-20 p-4'>
              <div className='flex flex-row gap-12'>
                <h1 className='text-primary text-lg'>{expense.total}</h1>
                <p className='text-gray-600'>{expense.addedBy}</p>
                <p className='text-gray-600'>{expense.date.toDateString()}</p>
              </div>
              <div className='flex flex-row gap-6'>
                <button
                  onClick={() => handleViewExpense(expense)}
                  className='bg-blue-800 text-white px-3 py-1 rounded-md'
                >
                  View Report
                </button>
                <button className='bg-red-500 text-white px-3 py-1 rounded-md'>Settle</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Popup */}
      {selectedExpense && (
        <ExpenseDetails expense={selectedExpense} onClose={handleClosePopup} />
      )}
    </section>
  );
};

export default Expenses;