import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import { incrementByAmount } from '../../redux/reducers/counterReducer'; // Import action creators from the counterReducer
import logo from '../../assets/images/logo.svg';
import LoginButton from '../buttons/LoginButton';
import { increment , decrement} from '../../redux/actions/counterActions';

function Navbar() {

 // count from multi reducers store by slicing 
 const count = useSelector(state => state.counter.count); 

	/***********************************************	
	  Select count from the single reducer
    const count = useSelector(state => state.count); 
  ************************************************/


  const dispatch = useDispatch();

  const handlePlusButton = () => {
    // dispatch(increment());
    dispatch(incrementByAmount(increment())); 
  }

  const handleMinusButton = () => { 
    dispatch(incrementByAmount(decrement())); 
  }

  return (
    <nav className="bg-gray-800 text-white p-4 px-12">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-xl font-bold">
          <Link to="/" className="text-white">
            <img src={logo} alt="Logo" className="inline-block mr-2 w-32" />
          </Link>
        </div>
        <div className="hidden md:flex space-x-4"> {/* Hide on small screens */}
          <Link to="/dashboard" className="hover:text-gray-300">
            Dashboard
          </Link>
          <Link to="/expenses" className="hover:text-gray-300">
            Expenses
          </Link>
          <Link to="/reports" className="hover:text-gray-300">
            Report
          </Link>
          <Link to="/settlement" className="hover:text-gray-300">
            Settlements
          </Link>
        </div>

        <LoginButton />

        <div className="flex items-center space-x-4">
          <button onClick={handleMinusButton} className="bg-gray-700 text-white px-3 py-1 rounded">
            -
          </button>
          <span className="text-xl">{count}</span>
          <button onClick={handlePlusButton} className="bg-gray-700 text-white px-3 py-1 rounded">
            +
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
