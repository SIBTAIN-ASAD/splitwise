import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import db from '../config/firebasedb';

const ExpenseReport = () => {
  const [userExpenses, setUserExpenses] = useState([]);
  const [totalExpense, setTotalExpense] = useState(0);
  const [userPayments, setUserPayments] = useState({});



  const fetchUserExpenses = async () => {
    try {
      // Fetch all expenses whose status is active
      const expensesCollection = collection(db, 'expense');
      const expensesSnapshot = await getDocs(expensesCollection);
      const expenseData = expensesSnapshot.docs
        .filter(doc => doc.data().status === 'active')
        .map(doc => ({ id: doc.id, ...doc.data() }));
      
      // Fetch all expense details
      const expenseDetailCollection = collection(db, 'expense_detail');
      const expenseDetailSnapshot = await getDocs(expenseDetailCollection);
      const expenseDetailData = expenseDetailSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      setUserExpenses(expenseData);
      calculateTotalExpense(expenseData);
      calculateUserPayments(expenseDetailData);
    } catch (error) {
      console.error('Error fetching expenses:', error);
    }
  };

  useEffect(() => {
    fetchUserExpenses();
  });

  const calculateTotalExpense = (expenses) => {
    // Calculate total expense
    const total = expenses.reduce((acc, expense) => acc + parseFloat(expense.totalExpense), 0);
    setTotalExpense(total);
  };

  const calculateUserPayments = (expenseDetails) => {
    // Calculate individual user payments
    const userPayments = {};
    expenseDetails.forEach(detail => {
      const { user_id, user_expense } = detail;
      if (!userPayments[user_id]) {
        userPayments[user_id] = 0;
      }
      userPayments[user_id] += parseFloat(user_expense);
    });
    setUserPayments(userPayments);
  };

  const settleExpenses = () => {
    // Logic to settle expenses
  };

  return (
    <div className="p-4 my-10 overflow-scroll bg-gray-100 rounded-lg shadow-md w-full mx-auto flex align-middle flex-col max-w-3xl">
      <h2 className="text-2xl my-4 font-semibold mx-auto">Expense Report</h2>
      <div className="mb-8">
        <p className="text-lg font-semibold">Total Expense: ${totalExpense}</p>
        <ul className="list-disc pl-6">
          {Object.keys(userPayments).map(userId => (
            <li key={userId}>User {userId}: ${userPayments[userId]}</li>
          ))}
        </ul>
      </div>
      <div>
        <h3 className="text-xl font-semibold mb-4">Expense Details</h3>
        {userExpenses.map(expense => (
          <div key={expense.id} className="border-b border-gray-200 pb-4 mb-4">
            <p className="text-lg font-semibold mb-2">Date: {expense.date}</p>
            <p><strong>Expense:</strong> {expense.totalExpense}</p>
            <p><strong>Description:</strong> {expense.description}</p>
          </div>
        ))}
      </div>
      <button className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 mt-8" onClick={settleExpenses}>Settle All Expenses</button>
      <p className="italic mt-2">Are you sure you want to settle all expenses?</p>
    </div>
  );
};

export default ExpenseReport;
