import React, { useState } from 'react';
import { addDoc, collection } from 'firebase/firestore';
import { ref, uploadBytes, getStorage, getDownloadURL } from 'firebase/storage';
import db from '../../config/firebasedb';
import { useAuth } from '../AuthContext';
import App from '../../config/firebase';

const ExpenseForm = ({ usersData, onClose }) => {
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [expenseDetails, setExpenseDetails] = useState({
        description: '',
        photo: null,
        date: '',
        totalExpense: '',
        status: '',
        userExpenses: {},
        collaborators: [],
    });
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const { currentUser } = useAuth();
    const storage = getStorage(App);
    let imageURL = '';

    const handleExpenseChange = (e) => {
        const { name, value, files } = e.target;
    
        if (name === 'photo' && files.length > 0) {
            const photoFile = files[0];
            const reader = new FileReader();
    
            reader.onload = async () => {
                try {
                    // Upload photo to Firebase Storage
                    const storageRef = ref(storage, `expenses/${photoFile.name}`);
                    await uploadBytes(storageRef, photoFile);
    
                    // Get download URL
                    const photoURL = await getDownloadURL(storageRef);
    
                    // Update expenseDetails state with photo URL
                    imageURL = photoURL;

                } catch (error) {
                    console.error('Error uploading photo:', error.message);
                }
            };
    
            reader.readAsDataURL(photoFile); // Read file contents
        } else {
            // For non-file inputs, update state as usual
            setExpenseDetails(prevState => ({
                ...prevState,
                [name]: value,
            }));
        }
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

    const handleSubmit = async () => {
        try {
        // Upload photo to the storage
        const storgeRef = ref(storage, `expenses/${expenseDetails.photo.name}`);
        await uploadBytes(storgeRef, expenseDetails.photo);
        const photoURL = getDownloadURL(storgeRef);
        setExpenseDetails(prevState => ({
            ...prevState,
            photo: photoURL,
        }));
        } catch (error) {
            console.error('Error uploading photo:', error.message);
        }
        try {
            // Add expense details to the 'expense' collection
            const expenseRef = await addDoc(collection(db, 'expense'), {
                description: expenseDetails.description,
                photo: imageURL,
                date: expenseDetails.date,
                totalExpense: expenseDetails.totalExpense,
                status: expenseDetails.status,
                addedBy : currentUser.displayName,
            });

            // Add user expenses to the 'expense_detail' collection
            expenseDetails.collaborators.forEach(async collaborator => {
                await addDoc(collection(db, 'expense_detail'), {
                    user_id: collaborator.id,
                    expense_id: expenseRef.id,
                    user_expense: collaborator.expense,
                });
            });

            // Reset form state
            setExpenseDetails({
                description: '',
                photo: '',
                date: '',
                totalExpense: '',
                status: '',
                userExpenses: {},
                collaborators: [],
            });

            // Close the expense form
            onClose();
        } catch (error) {
            console.error('Error adding expense:', error.message);
        }
    };

    const handleCancel = () => {
        // Reset form state
        setExpenseDetails({
            description: '',
            photo: '',
            date: '',
            totalExpense: '',
            status: '',
            userExpenses: {},
            collaborators: [],
        });

        // Close the expense form
        onClose();
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
            <div className="bg-white p-6 rounded-md w-full max-w-md">
                <form>
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

                    <button onClick={handleSubmit} type="button"
                     className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600 mt-4 float-end">
                        Submit</button>

                </form>
            </div>
        </div>
    );
};


export default ExpenseForm;



