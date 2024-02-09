// Dashboard.jsx
import React, { useEffect } from 'react';
import { useAuth } from '../components/AuthContext';
import { useNavigate } from 'react-router-dom';
import db from '../config/firebasedb';
import { collection, getDocs } from 'firebase/firestore';

import image1 from '../assets/images/1.jpg';
import image2 from '../assets/images/2.jpg';
import image3 from '../assets/images/3.jpg';
import image4 from '../assets/images/4.jpg';
import image5 from '../assets/images/5.jpg';

const Dashboard = () => {
  const usersData = [
    {
      name: 'John Doe',
      image: image1,
    },
    {
      name: 'Jane Doe',
      image: image2,
    },
    {
      name: 'John Smith',
      image: image3,
    },
    {
      name: 'Jane Smith',
      image: image4,
    },
    {
      name: 'John Doe',
      image: image5,
    },
    {
      name: 'John Doe',
      image: image5,
    },
  ];

  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to login if there is no current user
    if (!currentUser) {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  useEffect(() => {
    const getUsers = async () => {
      const usersCollection = collection(db, 'user_detail');
      const usersSnapshot = await getDocs(usersCollection);
      console.log(usersSnapshot);
      const usersList = usersSnapshot.docs.map((doc) => doc.data());
      console.log(usersList);
    };
    getUsers();
  }, []);

  return (
    <section className='flex justify-center items-center py-16 px-10 md:px-0 bg-white'>
      <div className='w-full md:w-3/4 flex flex-col md:flex-row gap-10'>

        {currentUser && (
          <div className="pt-32">
            <h1 className='text-[#1F2937] text-xl'>Welcome <span className='text-3xl'>{currentUser.displayName}</span></h1>
            <div className='flex flex-col'>
              <hr className='border border-[#1F2937] my-1 w-32' />
              <hr className='border border-[#1F2937] mb-5 w-24' />
            </div>
            <h2 className='text-[#1F2937] text-2xl my-4'>Our Users</h2>
            <div className="flex flex-wrap -mx-4">
              {usersData.map((user, index) => (
                <div key={index} className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/4 px-4 mb-4">
                  <div className="relative overflow-hidden group">
                    <img
                      src={user.image}
                      alt={user.name}
                      className="h-72 w-full object-cover transform transition-transform duration-300 group-hover:scale-110 group-hover:brightness-50 hover:cursor-pointer"
                    />
                    <p className="absolute bottom-0 left-0 right-0 p-4 bg-gray-400 bg-opacity-45 text-center text-lg ">{user.name}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Dashboard;
