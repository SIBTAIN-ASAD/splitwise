import React, { useState } from 'react';
import { useFormik } from 'formik';
import { addDoc, collection } from 'firebase/firestore';
import { ref, uploadBytes, getStorage, getDownloadURL } from 'firebase/storage';
import db from '../../config/firebasedb';
import { useAuth } from '../AuthContext';
import App from '../../config/firebase';
import * as Yup from 'yup';

const ExpenseForm = ({ usersData, onClose }) => {
    const { currentUser } = useAuth();
    const storage = getStorage(App);
    // const [selectedUsers, setSelectedUsers] = useState([]);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    let recieptURL = null;


    const formik = useFormik({
        initialValues: {
            description: '',
            date: new Date().toISOString().split('T')[0],
            totalExpense: '',
            status: 'active',
            userExpenses: {},
            collaborators: [],
        },
        validationSchema: Yup.object({
            description: Yup.string()
                .required('Description is required'),
            totalExpense: Yup.number()
                .required('Total expense is required')
                .min(0, 'Total expense must be a positive number'),
            date: Yup.date()
                .required('Date is required')
                .max(new Date(), 'Date cannot be in the future'),
        }),
        onSubmit: async (values, { resetForm }) => {
            try {
                const expenseRef = await addDoc(collection(db, 'expense'), {
                    description: values.description,
                    photo: recieptURL || 'https://via.placeholder.com/150',
                    date: values.date,
                    totalExpense: values.totalExpense,
                    status: values.status,
                    addedBy: currentUser.displayName,
                });
    
                values.collaborators.forEach(async collaborator => {
                    const user = usersData.find(user => user.id === collaborator.id);
                    await addDoc(collection(db, 'expense_detail'), {
                        user_id: collaborator.id,
                        user_name: user.displayName,
                        expense_id: expenseRef.id,
                        user_expense: collaborator.expense,
                    });
                });
    
                resetForm();
                onClose();
            } catch (error) {
                console.error('Error adding expense:', error.message);
            }
        },
    });

    const handleExpenseChange = (e) => {
        const { name, value, files } = e.target;
    
        if (name === 'photo' && files.length > 0) {
            const photoFile = files[0];
            const reader = new FileReader();
    
            reader.onload = async () => {
                try {
                    const storageRef = ref(storage, `expenses/${photoFile.name}`);
                    await uploadBytes(storageRef, photoFile);
                    recieptURL = await getDownloadURL(storageRef);
                } catch (error) {
                    console.error('Error uploading photo:', error.message);
                    console.error('Value was', value);
                }
            };
    
            reader.readAsDataURL(photoFile);
        } else {
            formik.handleChange(e);
        }
    };

    const handleUserExpenseChange = (e, userId) => {
        const { value } = e.target;
        formik.setFieldValue('userExpenses', {
            ...formik.values.userExpenses,
            [userId]: value === '' ? '' : parseFloat(value),
        });
    };

    const handleAddCollaborator = (userId) => {
            // if the collaborator need to be add already in the list, then return
            if (formik.values.collaborators.some(collaborator => collaborator.id === userId)) {
                return;
            }
            
            if (formik.values.userExpenses[userId] !== '' && formik.values.userExpenses[userId] !== undefined) {
                formik.setFieldValue('collaborators', [...formik.values.collaborators, {
                    id: userId,
                    expense: formik.values.userExpenses[userId],
                }]);
                // setSelectedUsers(selectedUsers.filter(user => user !== userId));
            }
    };

    const handleRemoveCollaborator = (userId) => {
        formik.setFieldValue('collaborators', formik.values.collaborators.filter(collaborator => collaborator.id !== userId));
        // setSelectedUsers([...selectedUsers, userId]);
    };

    const handleCancel = () => {
        // Reset form state
        formik.resetForm();

        // Close the expense form
        onClose();
    }


    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
            <div className="bg-white p-6 rounded-md w-full max-w-md">
                <form onSubmit={formik.handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="totalExpense" className="block text-gray-700">Total Expense:</label>
                        <input
                            type="number"
                            id="totalExpense"
                            name="totalExpense"
                            value={formik.values.totalExpense}
                            onChange={handleExpenseChange}
                            onBlur={formik.handleBlur}
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                        />
                        {formik.touched.totalExpense && formik.errors.totalExpense ? (
                            <div className="text-red-600">{formik.errors.totalExpense}</div>
                        ) : null}
                    </div>

                    <div className="mb-4 relative">
                        <label htmlFor="userSelect" className="block text-gray-700">Collaborators:</label>
                        <div className="relative">
                            <div className="mt-4">
                                <ul className="list-disc ml-6">
                                    {formik.values.collaborators.map(collaborator => (
                                        <li key={collaborator.id} className="flex justify-between">
                                            <span className='text-blue-600'>{usersData.find(user => user.id === collaborator.id).displayName} - ${collaborator.expense}</span>
                                            <button type="button" onClick={() => handleRemoveCollaborator(collaborator.id)} className="text-red-500 mx-5 hover:text-red-700">X</button>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <button id="dropdownDefaultButton" data-dropdown-toggle="dropdown" 
                                    className="w-full flex justify-between px-3 py-2 border rounded-md cursor-pointer focus:outline-none text-gray-700 hover:border-blue-500 "
                                    type="button"
                                    onClick={() => setDropdownOpen(!dropdownOpen)}
                            >
                                Select User
                                    <svg class="w-2.5 h-2.5 ms-3 mt-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4"/>
                                    </svg>
                                    
                            </button>

                            {dropdownOpen && (
                                    <ul className="absolute top-full left-0 right-0 z-10 bg-white border border-gray-300 rounded-b-md mt-1 overflow-scroll h-60">
                                        {usersData.map(user => (
                                            <li key={user.id} className="px-3 my-2 py-2">
                                                <span>{user.displayName}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => handleAddCollaborator(user.id)}
                                                    className="bg-blue-500 text-white py-2 px-3 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600 float-end"
                                                >
                                                    Add
                                                </button>
                                                <input
                                                    type="number"
                                                    value={formik.values.userExpenses[user.id] || ''}
                                                    onChange={(e) => handleUserExpenseChange(e, user.id)}
                                                    className="w-20 px-2 py-1 border rounded-md focus:outline-none focus:border-blue-500 float-end mx-3"
                                                    
                                                />
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
                            value={formik.values.description}
                            onChange={handleExpenseChange}
                            onBlur={formik.handleBlur}
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                        />
                        {formik.touched.description && formik.errors.description ? (
                            <div className="text-red-600">{formik.errors.description}</div>
                        ) : null}
                    </div>

                    <div className="mb-4">
                        <label htmlFor="date" className="block text-gray-700">Expense Date:</label>
                        <input
                            type="date"
                            id="date"
                            name="date"
                            value={formik.values.date}
                            onChange={handleExpenseChange}
                            onBlur={formik.handleBlur}
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                        />
                        {formik.touched.date && formik.errors.date ? (
                            <div className="text-red-600">{formik.errors.date}</div>
                        ) : null}
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

                    <button type="submit"
                     className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600 mt-4 float-end">
                        Submit</button>
                </form>
            </div>
        </div>
    );
};

export default ExpenseForm;



// import React, { useState } from 'react';
// import { addDoc, collection } from 'firebase/firestore';
// import { ref, uploadBytes, getStorage, getDownloadURL } from 'firebase/storage';
// import db from '../../config/firebasedb';
// import { useAuth } from '../AuthContext';
// import App from '../../config/firebase';

// const ExpenseForm = ({ usersData, onClose }) => {
//     const [selectedUsers, setSelectedUsers] = useState([]);
    // const [expenseDetails, setExpenseDetails] = useState({
    //     description: '',
    //     photo: null,
    //     date: new Date().toISOString().split('T')[0], // Set initial date to today's date
    //     totalExpense: '',
    //     status: '',
    //     userExpenses: {},
    //     collaborators: [],
    // });
//     const [dropdownOpen, setDropdownOpen] = useState(false);
//     const { currentUser } = useAuth();
//     const storage = getStorage(App);
//     let imageURL = '';

//     const handleExpenseChange = (e) => {
//         const { name, value, files } = e.target;
    
//         if (name === 'photo' && files.length > 0) {
//             const photoFile = files[0];
//             const reader = new FileReader();
    
//             reader.onload = async () => {
//                 try {
//                     // Upload photo to Firebase Storage
//                     const storageRef = ref(storage, `expenses/${photoFile.name}`);
//                     await uploadBytes(storageRef, photoFile);
    
//                     // Get download URL
//                     const photoURL = await getDownloadURL(storageRef);
    
//                     // Update expenseDetails state with photo URL
//                     imageURL = photoURL;

//                 } catch (error) {
//                     console.error('Error uploading photo:', error.message);
//                 }
//             };
    
//             reader.readAsDataURL(photoFile); // Read file contents
//         } else {
//             // For non-file inputs, update state as usual
//             setExpenseDetails(prevState => ({
//                 ...prevState,
//                 [name]: value,
//             }));
//         }
//     };

//     const handleUserExpenseChange = (e, userId) => {
//         const { value } = e.target;
//         setExpenseDetails(prevState => ({
//             ...prevState,
//             userExpenses: {
//                 ...prevState.userExpenses,
//                 [userId]: value === '' ? 0 : parseFloat(value),
//             },
//         }));
//     };

//     const handleAddCollaborator = (userId) => {
//         if (expenseDetails.userExpenses[userId] !== '') {
//             setExpenseDetails(prevState => ({
//                 ...prevState,
//                 collaborators: [...prevState.collaborators, {
//                     id: userId,
//                     expense: expenseDetails.userExpenses[userId],
//                 }],
//             }));
//             setSelectedUsers(selectedUsers.filter(user => user !== userId));
//             setDropdownOpen(false); // Close the dropdown
//         }
//     };

//     const handleRemoveCollaborator = (userId) => {
//         setExpenseDetails(prevState => ({
//             ...prevState,
//             collaborators: prevState.collaborators.filter(collaborator => collaborator.id !== userId),
//         }));
//         setSelectedUsers([...selectedUsers, userId]);
//     };

//     const handleSubmit = async () => {
//         try {
//             // Upload photo to the storage
//             const storageRef = ref(storage, `expenses/${expenseDetails.photo.name}`);
//             await uploadBytes(storageRef, expenseDetails.photo);
//             const photoURL = getDownloadURL(storageRef);
//             setExpenseDetails(prevState => ({
//                 ...prevState,
//                 photo: photoURL,
//             }));
//         } catch (error) {
//             console.error('Error uploading photo:', error.message);
//         }
//         try {
//             // Add expense details to the 'expense' collection
//             const expenseRef = await addDoc(collection(db, 'expense'), {
//                 description: expenseDetails.description,
//                 photo: imageURL,
//                 date: expenseDetails.date,
//                 totalExpense: expenseDetails.totalExpense,
//                 status: expenseDetails.status,
//                 addedBy : currentUser.displayName,
//             });

//             // Add user expenses to the 'expense_detail' collection
//             expenseDetails.collaborators.forEach(async collaborator => {
//                 await addDoc(collection(db, 'expense_detail'), {
//                     user_id: collaborator.id,
//                     expense_id: expenseRef.id,
//                     user_expense: collaborator.expense,
//                 });
//             });

//             // Reset form state
//             setExpenseDetails({
//                 description: '',
//                 photo: '',
//                 date: new Date().toISOString().split('T')[0], // Reset date to today's date
//                 totalExpense: '',
//                 status: '',
//                 userExpenses: {},
//                 collaborators: [],
//             });

//             // Close the expense form
//             onClose();
//         } catch (error) {
//             console.error('Error adding expense:', error.message);
//         }
//     };

//     const handleCancel = () => {
//         // Reset form state
//         setExpenseDetails({
//             description: '',
//             photo: '',
//             date: new Date().toISOString().split('T')[0], // Reset date to today's date
//             totalExpense: '',
//             status: '',
//             userExpenses: {},
//             collaborators: [],
//         });

//         // Close the expense form
//         onClose();
//     }

//     return (
//         <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
//             <div className="bg-white p-6 rounded-md w-full max-w-md">
//                 <form>
//                     <div className="mb-4">
//                         <label htmlFor="totalExpense" className="block text-gray-700">Total Expense:</label>
//                         <input
//                             type="number"
//                             id="totalExpense"
//                             name="totalExpense"
//                             value={expenseDetails.totalExpense}
//                             onChange={handleExpenseChange}
//                             className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
//                         />
//                     </div>

//                     <div className="mb-4 relative">
//                         <label htmlFor="userSelect" className="block text-gray-700">Collaborators:</label>
//                         <div className="relative">
//                             <div className="mt-4">
//                                 <ul className="list-disc ml-6">
//                                     {expenseDetails.collaborators.map(collaborator => (
//                                         <li key={collaborator.id} className="flex justify-between">
//                                             <span className='text-blue-600'>{usersData.find(user => user.id === collaborator.id).displayName} - ${collaborator.expense}</span>
//                                             <button type="button" onClick={() => handleRemoveCollaborator(collaborator.id)} className="text-red-500 mx-5 hover:text-red-700">X</button>
//                                         </li>
//                                     ))}
//                                 </ul>
//                             </div>

//                             <div
//                                 className="w-full px-3 py-2 border rounded-md cursor-pointer focus:outline-none focus:border-blue-500 text-gray-700 hover:border-blue-500"
//                                 onClick={() => setDropdownOpen(!dropdownOpen)}
//                             >
//                                 Select User
//                             </div>
                            // {dropdownOpen && (
                            //     <ul className="absolute top-full left-0 right-0 z-10 bg-white border border-gray-300 rounded-b-md mt-1">
                            //         <li className="flex items-center justify-between px-3 py-2">
                            //             <button
                            //                 type="button"
                            //                 onClick={() => {
                            //                     // Add all users with some value as collaborators
                            //                     usersData.forEach(user => {
                            //                         if (expenseDetails.userExpenses[user.id] !== undefined) {
                            //                             handleAddCollaborator(user.id);
                            //                         }
                            //                     });
                            //                 }}
                            //                 className="bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600 w-96"
                            //             >
                            //                 Add
                            //             </button>
                            //         </li>
                            //         {usersData.map(user => (
                            //             <li key={user.id} className="flex items-center justify-between px-3 py-2">
                            //                 <span>{user.displayName}</span>
                            //                 <input
                            //                     type="number"
                            //                     value={expenseDetails.userExpenses[user.id] || ''}
                            //                     onChange={(e) => handleUserExpenseChange(e, user.id)}
                            //                     className="w-20 px-2 py-1 border rounded-md focus:outline-none focus:border-blue-500"
                            //                 />
                            //             </li>
                            //         ))}
                            //     </ul>
                            // )}
                    //     </div>
                    // </div>


//                     <div className="mb-4">
//                         <label htmlFor="description" className="block text-gray-700">Expense Description:</label>
//                         <input
//                             type="text"
//                             id="description"
//                             name="description"
//                             value={expenseDetails.description}
//                             onChange={handleExpenseChange}
//                             className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
//                         />
//                     </div>

//                     <div className="mb-4">
//                         <label htmlFor="date" className="block text-gray-700">Expense Date:</label>
//                         <input
//                             type="date"
//                             id="date"
//                             name="date"
//                             value={expenseDetails.date}
//                             onChange={handleExpenseChange}
//                             className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
//                         />
//                     </div>

//                     <div className="mb-4">
//                         <label htmlFor="photo" className="block text-gray-700">Expense Photo:</label>
//                         <input
//                             type="file"
//                             id="photo"
//                             name="photo"
//                             accept="image/*"
//                             onChange={handleExpenseChange}
//                             className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
//                         />
//                     </div>


//                     <button className="bg-red-500 text-white px-4 mx-2 py-2 rounded-md hover:bg-red-600 focus:outline-none focus:bg-red-600 mt-4 float-end"
//                         onClick={handleCancel}
//                     >
//                         Cancel</button>

//                     <button onClick={handleSubmit} type="button"
//                      className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600 mt-4 float-end">
//                         Submit</button>

//                 </form>
//             </div>
//         </div>
//     );
// };


// export default ExpenseForm;

