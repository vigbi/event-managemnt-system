import React, { useState } from 'react';
import { auth, googleProvider } from '../utils/firebase';  // import Firebase auth and Google provider
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false); // Toggle between sign-in and sign-up
  const navigate = useNavigate(); // Initialize the hook for navigation

  // Sign in with email and password
  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/dashboard'); // Redirect to dashboard on success
    } catch (error) {
      console.error(error.message);
      alert(error.message);
    }
  };

  // Sign up with email and password
  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate('/dashboard'); // Redirect to dashboard on success
    } catch (error) {
      console.error(error.message);
      alert(error.message);
    }
  };

  // Sign in with Google
  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      navigate('/dashboard'); // Redirect to dashboard on success
    } catch (error) {
      console.error(error.message);
      alert(error.message);
    }
  };

  return (
    <div className="h-screen flex flex-col justify-center items-center bg-gray-100">
      <h1 className="text-4xl font-bold mb-10 text-indigo-600">Event Management</h1>

      <div className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-gray-700">
          {isSignUp ? 'Sign Up' : 'Login'}
        </h2>

        <form onSubmit={isSignUp ? handleSignUp : handleSignIn}>
          <div className="mb-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-md"
            />
          </div>
          <div className="mb-4">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-md"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 rounded-md hover:bg-indigo-500"
          >
            {isSignUp ? 'Sign Up' : 'Sign In'}
          </button>
        </form>

        <button
          onClick={handleGoogleSignIn}
          className="w-full bg-red-500 text-white py-3 mt-4 rounded-md hover:bg-red-400"
        >
          Sign In with Google
        </button>

        <div className="mt-4">
          {isSignUp ? (
            <p>
              Already have an account?{' '}
              <span
                onClick={() => setIsSignUp(false)}
                className="text-indigo-600 cursor-pointer"
              >
                Sign In
              </span>
            </p>
          ) : (
            <p>
              Don't have an account?{' '}
              <span
                onClick={() => setIsSignUp(true)}
                className="text-indigo-600 cursor-pointer"
              >
                Sign Up
              </span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
