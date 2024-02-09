import React, { useState } from 'react';

const ExpenseForm = ({ usersData , onClose }) => {

    const [selectedUsers, setSelectedUsers] = useState([]);
    const [expenseDetails, setExpenseDetails] = useState({
        description: '',
        photo: '',
        date: '',
        totalExpense: '',
        poster: '',
        userExpenses: {},
        collaborators: [],
    });
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const handleExpenseChange = (e) => {
        const { name, value } = e.target;
        setExpenseDetails(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleUserExpenseChange = (e, userId) => {
        const { value } = e.target;
        setExpenseDetails(prevState => ({
            ...prevState,
            userExpenses: {
                ...prevState.userExpenses,
                [userId]: value === '' ? 0 : parseFloat(value),
            },
        }));
    };

    const handleAddCollaborator = (userId) => {
        if (expenseDetails.userExpenses[userId] !== '') {
            setExpenseDetails(prevState => ({
                ...prevState,
                collaborators: [...prevState.collaborators, {
                    id: userId,
                    expense: expenseDetails.userExpenses[userId],
                }],
            }));
            setSelectedUsers(selectedUsers.filter(user => user !== userId));
        }
    };

    const handleRemoveCollaborator = (userId) => {
        setExpenseDetails(prevState => ({
            ...prevState,
            collaborators: prevState.collaborators.filter(collaborator => collaborator.id !== userId),
        }));
        setSelectedUsers([...selectedUsers, userId]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Expense Details:', expenseDetails);
        setExpenseDetails({
            description: '',
            photo: '',
            date: '',
            totalExpense: '',
            poster: '',
            userExpenses: {},
            collaborators: [],
        });
    };

    const handleCancel = () => {
        setExpenseDetails({
            description: '',
            photo: '',
            date: '',
            totalExpense: '',
            poster: '',
            userExpenses: {},
            collaborators: [],
        });

        onClose(false);
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
            <div className="bg-white p-6 rounded-md w-full max-w-md">
                <form onSubmit={handleSubmit}>

                    <div className="mb-4">
                        <label htmlFor="totalExpense" className="block text-gray-700">Total Expense:</label>
                        <input
                            type="number"
                            id="totalExpense"
                            name="totalExpense"
                            value={expenseDetails.totalExpense}
                            onChange={handleExpenseChange}
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                        />
                    </div>

                    <div className="mb-4 relative">
                        <label htmlFor="userSelect" className="block text-gray-700">Collaborators:</label>
                        <div className="relative">
                            <div className="mt-4">
                                <ul className="list-disc ml-6">
                                    {expenseDetails.collaborators.map(collaborator => (
                                        <li key={collaborator.id} className="flex justify-between">
                                            <span className='text-blue-600'>{usersData.find(user => user.id === collaborator.id).displayName} - ${collaborator.expense}</span>
                                            <button type="button" onClick={() => handleRemoveCollaborator(collaborator.id)} className="text-red-500 mx-5 hover:text-red-700">X</button>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div
                                className="w-full px-3 py-2 border rounded-md cursor-pointer focus:outline-none focus:border-blue-500 text-gray-700 hover:border-blue-500"
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                            >
                                Select User
                            </div>
                            {dropdownOpen && (
                                <ul className="absolute top-full left-0 right-0 z-10 bg-white border border-gray-300 rounded-b-md mt-1">
                                    {usersData.map(user => (
                                        <li key={user.id} className="flex items-center justify-between px-3 py-2">
                                            <span className='w-20'>{user.displayName}</span>
                                            <input
                                                type="number"
                                                value={expenseDetails.userExpenses[user.id] || ''}
                                                onChange={(e) => handleUserExpenseChange(e, user.id)}
                                                className="w-20 px-2 py-1 border rounded-md focus:outline-none focus:border-blue-500"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => handleAddCollaborator(user.id)}
                                                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
                                            >
                                                Add
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>


                    <div className="mb-4">
                        <label htmlFor="description" className="block text-gray-700">Expense Description:</label>
                        <input
                            type="text"
                            id="description"
                            name="description"
                            value={expenseDetails.description}
                            onChange={handleExpenseChange}
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="date" className="block text-gray-700">Expense Date:</label>
                        <input
                            type="date"
                            id="date"
                            name="date"
                            value={expenseDetails.date}
                            onChange={handleExpenseChange}
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="photo" className="block text-gray-700">Expense Photo:</label>
                        <input
                            type="file"
                            id="photo"
                            name="photo"
                            accept="image/*"
                            onChange={handleExpenseChange}
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                        />
                    </div>

                    <button className="bg-red-500 text-white px-4 mx-2 py-2 rounded-md hover:bg-red-600 focus:outline-none focus:bg-red-600 mt-4 float-end"
                    onClick={handleCancel}
                    >
                        Cancel</button>

                    <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600 mt-4 float-end">
                        Submit</button>

                </form>
            </div>
        </div>
    );
};

export default ExpenseForm;