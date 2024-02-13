import React, { useEffect, useState } from 'react';
import { collection, getDocs, updateDoc } from 'firebase/firestore';
import db from '../config/firebasedb';

const ExpenseReport = () => {
  const [expense_details, setExpense_details] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [users, setUsers] = useState({});

  useEffect(() => {
    fetchUserExpenses();
    fetchUsers();
  }, []);

  const fetchUserExpenses = async () => {
    try {
      const expensesCollection = collection(db, 'expense');
      const expensesSnapshot = await getDocs(expensesCollection);
      const expenseData = expensesSnapshot.docs
        .filter(doc => doc.data().status === 'active')
        .map(doc => ({ id: doc.id, ...doc.data() }));
      setExpenses(expenseData);

      const expenseDetailCollection = collection(db, 'expense_detail');
      const expenseDetailSnapshot = await getDocs(expenseDetailCollection);
      const expenseDetailData = expenseDetailSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setExpense_details(expenseDetailData);
    } catch (error) {
      console.error('Error fetching expenses:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const usersCollection = collection(db, 'user_detail');
      const usersSnapshot = await getDocs(usersCollection);
      const usersData = {};
      usersSnapshot.forEach(doc => {
        usersData[doc.id] = doc.data().displayName;
      });
      setUsers(usersData);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const calculateTotalExpense = () => {
    let totalExpense = 0;
    expenses.forEach(expense => {
      totalExpense += parseFloat(expense.totalExpense);
    });
    return totalExpense.toFixed(2);
  };

  const calculateEachExpense = (expenseID) => {
    const expenseDetails = expense_details.filter(detail => detail.expense_id === expenseID);
    const userPayments = {};
    expenseDetails.forEach(detail => {
      const { user_id, user_expense } = detail;
      if (!userPayments[user_id]) {
        userPayments[user_id] = 0;
      }
      userPayments[user_id] += parseFloat(user_expense);
    });

    const numberOfUsers = Object.keys(userPayments).length;
    let average = 0;
    let totalExpense = 0;
    Object.keys(userPayments).forEach(userId => {
      totalExpense += userPayments[userId];
    });
    average = totalExpense / numberOfUsers;
    const remainingExpense = {};
    Object.keys(userPayments).forEach(userId => {
      remainingExpense[userId] = (userPayments[userId] - average).toFixed(2);
    });
    return [totalExpense.toFixed(2), remainingExpense];
  };

  const calculateBudget = () => {
    const userBudget = {};
    expenses.forEach(expense => {
      const data = calculateEachExpense(expense.id);
      Object.keys(data[1]).forEach(userId => {
        if (!userBudget[userId]) {
          userBudget[userId] = 0;
        }
        userBudget[userId] = (parseFloat(userBudget[userId]) + parseFloat(data[1][userId])).toFixed(2);

      });
    });
    return userBudget;
  };

  const settleExpenses = () => {
    const confirmation = window.confirm("Are you sure you want to settle all expenses? (This action will not be undone)");
    if (confirmation) {
      expenses.forEach(async expense => {
        const expenseRef = collection(db, 'expense');
        await updateDoc(expenseRef, expense.id, {
          status: 'settled'
        });
      });
      window.location.reload();
    }
  };
  

  return (
    <div className="p-4 my-10 bg-gray-100 rounded-lg shadow-md w-full mx-auto max-w-3xl">
    <h2 className="text-3xl my-4 font-semibold text-center">All Expenses' Report</h2>
    <div className="mb-8 pb-4">
      <p className="text-lg font-semibold text-center  text-blue-800">Total Expense: {calculateTotalExpense()}</p>
      <ul className="list-disc pl-6">
        {Object.keys(calculateBudget()).map(userId => (
          <li className='flex items-center py-1' key={userId}>
            <span className='w-40'>{users[userId]}:</span> 
            <span className={parseFloat(calculateBudget()[userId]) >= 0 ? 'text-green-800' : 'text-red-800'}>
              {calculateBudget()[userId]}
            </span>
          </li>
        ))}
      </ul>
    </div>
    <div>
      <h2 className="text-xl font-semibold mb-2 py-6 border-y-4 text-center">Expense Details</h2>
      {expenses.map(expense => (
        <div key={expense.id} className="border-b border-gray-300 pb-4 mb-4">
          <p className="text-lg font-semibold mb-2">Date: {expense.date}</p>
          <p className=' text-blue-800'><strong className='mr-8'>Expense:</strong> {parseFloat(expense.totalExpense).toFixed(2)}</p>
          <p><strong className='mr-4'>Description:</strong > {expense.description}</p>
          <p className='mb-8'><strong className='mr-6'>Added By:</strong> {expense.addedBy}</p>
          {Object.keys(calculateEachExpense(expense.id)[1]).map(userId => (
            <div className="flex items-center py-1" key={userId}>
              <span className='w-40'>{users[userId]}:</span> 
              <span className={parseFloat(calculateEachExpense(expense.id)[1][userId]) >= 0 ? 'text-green-800' : 'text-red-800'}>
                {calculateEachExpense(expense.id)[1][userId]}
              </span>
            </div>
          ))}
        </div>
      ))}
    </div>
    <div className="flex justify-center mt-8">
      <button className="bg-green-500 w-full text-white py-2 px-4 rounded-md hover:bg-green-600" onClick={settleExpenses}>Settle All Expenses</button>
    </div>
  </div>
  );
};

export default ExpenseReport;
