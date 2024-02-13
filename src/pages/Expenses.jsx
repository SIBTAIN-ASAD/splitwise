import React, { useState } from 'react';
import { useAuth } from '../components/AuthContext';
import { useNavigate } from 'react-router-dom';
import ExpenseDetails from './ExpenseDetails';
import { collection, getDocs, doc, updateDoc} from 'firebase/firestore';
import db from '../config/firebasedb';

const Expenses = () => {
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [expenses, setExpenses] = useState([]);

  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const fetchExpenses = async () => {
    try {
      // fetch expenses whose status is active
      const expensesCollection = collection(db, 'expense');
      const expensesSnapshot = await getDocs(expensesCollection);
      const expensesData = expensesSnapshot.docs
      .filter(doc => doc.data().status === 'active')
      .map(doc => ({ id: doc.id, ...doc.data() }));
      setExpenses(expensesData);
    } catch (error) {
      console.error('Error fetching expenses:', error);
    }
  };


  const settleExpense = async (expenseId) => {
    try {
        // Update the status of the expense to "done"
        await updateDoc(doc(db, 'expense', expenseId), {
            status: 'done'
        });
    } catch (error) {
        console.error('Error settling expense:', error);
    }
};

  if (!currentUser) {
    navigate('/login');
  } else {
    fetchExpenses();
  }

  const handleViewExpense = (expense) => {
    setSelectedExpense(expense);
  };

  const handleClosePopup = () => {
    setSelectedExpense(null);
  };

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
          Here, you'll find a comprehensive overview of all expenses, empowering you to make informed decisions and foster financial transparency.
          </p>
        </div>
        <div className='flex flex-col gap-2'>
          {expenses.map((expense) => (
            <div key={expense.id} className='flex flex-row justify-between bg-blue-800 bg-opacity-20 p-4 rounded-sm'>
              <div className='flex flex-row gap-12 items-center'>
                <div className="flex-shrink-0">
                  <img src={expense.photo} alt="Expense" className="h-10 w-10 rounded-full" />
                </div>
                  <p className='text-primary text-green-800 text-lg w-14'>{expense.totalExpense}</p>
                  <p className='text-gray-600'>{expense.date}</p>
                  <p className='text-lg '>{expense.description}</p>
                </div>
  
              <div className='flex flex-row gap-6'>
                <button
                  onClick={() => handleViewExpense(expense)}
                  className='bg-blue-800 text-white px-3 py-1 rounded-md'
                >
                  View Report
                </button>
                <button
                  onClick={() => settleExpense(expense.id)}
                  className='bg-red-500 text-white px-3 py-1 rounded-md'
                >
                  Settle
                </button>
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
