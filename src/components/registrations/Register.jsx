import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useAuth } from '../AuthContext';
import App from '../../config/firebase';

const Register = () => {
    const auth = getAuth(App);
    const storage = getStorage(App);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [image, setImage] = useState(null);
    const [imageUrl, setImageUrl] = useState('');
    const [displayName, setDisplayName] = useState(''); // Added display name state
    const navigate = useNavigate();
    const { currentUser } = useAuth();

    useEffect(() => {
        if (currentUser) {
            navigate('/');
        }
    }, [currentUser, navigate]);

    const register = async () => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Update user profile with display name
            await updateProfile(user, { displayName });

            if (image) {
                uploadImage(user.uid);
            } else {
                alert('User registered successfully');
                navigate('/');
            }
        } catch (error) {
            console.error('Error creating user:', error.message);
        }
    }

    const uploadImage = (userId) => {
        const storageRef = ref(storage, `profile_images/${userId}/${image.name}`);
        uploadBytes(storageRef, image)
            .then((snapshot) => {
                console.log('Image uploaded successfully');
                getDownloadURL(snapshot.ref)
                    .then((url) => {
                        setImageUrl(url);
                        // Optionally, you can store the image URL in the Firebase database
                        alert('User registered successfully');
                        navigate('/');
                    })
                    .catch((error) => {
                        console.error('Error getting download URL:', error);
                    });
            })
            .catch((error) => {
                console.error('Error uploading image:', error);
            });
    }

    const handleRegister = () => {
        if (password !== confirmPassword) {
            alert("Passwords don't match");
            return;
        }
        if (password.length < 6) {
            alert('Password must be at least 6 characters long');
            return;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
        if (!emailRegex.test(email)) {
            alert('Please enter a valid email');
            return;
        }
        const usernameRegex = /^[a-zA-Z0-9]+$/;
        if (!usernameRegex.test(username)) {
            alert('Username can only contain alphanumeric characters');
            return;
        }
        if (!displayName) {
            alert('Please enter a display name');
            return;
        }
        register();
    }

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
            <div className="bg-gray-800 p-8 rounded shadow-md w-96">
                <h1 className="text-3xl font-bold mb-6 text-center">Register</h1>
                <form>
                    <div className="mb-4">
                        <input
                            type="text"
                            id="username"
                            className="w-full p-2 rounded bg-gray-700 text-white border focus:outline-none focus:border-purple-500"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div className="mb-4">
                        <input
                            type="text" // Changed type to text for display name input
                            id="displayName"
                            className="w-full p-2 rounded bg-gray-700 text-white border focus:outline-none focus:border-purple-500"
                            placeholder="Display Name" // Placeholder for display name
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                        />
                    </div>
                    <div className="mb-4">
                        <input
                            type="email"
                            id="email"
                            className="w-full p-2 rounded bg-gray-700 text-white border focus:outline-none focus:border-purple-500"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="mb-4">
                        <input
                            type="password"
                            id="password"
                            className="w-full p-2 rounded bg-gray-700 text-white border focus:outline-none focus:border-purple-500"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div className="mb-4">
                        <input
                            type="password"
                            id="confirmPassword"
                            className="w-full p-2 rounded bg-gray-700 text-white border focus:outline-none focus:border-purple-500"
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>
                    <div className="mb-4">
                        <input
                            type="file"
                            id="image"
                            accept="image/*"
                            className="w-full p-2 rounded bg-gray-700 text-white border focus:outline-none focus:border-purple-500"
                            onChange={handleImageChange}
                        />
                    </div>
                    <button
                        className="w-full bg-purple-500 text-white font-bold py-2 rounded hover:bg-purple-700 focus:outline-none"
                        type="button"
                        onClick={handleRegister}
                    >
                        Register
                    </button>
                </form>
                <p className="mt-4 text-center">
                    Already have an account? <Link to="/login" className="text-purple-500">Login here</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
