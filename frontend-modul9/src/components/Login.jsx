import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors
    setIsSubmitting(true);
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

    try {
      // Log request details for debugging
      console.log('Login attempt with email:', email);
      console.log('Using backend URL:', backendUrl);
      
      const response = await axios.post(`${backendUrl}/user/login`, {
        email: email.trim(), // Ensure email is trimmed
        password,
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log('Login response status:', response.status);
      
      if (response.data && response.data.success) {
        // Store user data in local storage
        localStorage.setItem('userData', JSON.stringify(response.data.payload));
        navigate('/'); // Redirect to home page
      } else {
        setError(response.data.message || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      console.error('Login error details:', err);
      
      if (err.response) {
        console.error('Error status:', err.response.status);
        console.error('Error data:', err.response.data);
        
        // More specific error messages based on the response
        if (err.response.status === 404) {
          setError('Email or password is incorrect. Please check your credentials and try again.');
        } else {
          setError(err.response.data?.message || 'An error occurred during login.');
        }
      } else if (err.request) {
        // The request was made but no response was received
        setError('Server not responding. Please check your internet connection and try again.');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-teal-50 to-teal-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg animate-fade-in-up">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-teal-800">
            Sign in to your account
          </h2>
          <div className="mt-2 text-center">
            <div className="h-1 w-24 mx-auto bg-gradient-to-r from-teal-400 to-teal-600 rounded-full"></div>
          </div>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 animate-shake" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          <input type="hidden" name="remember" defaultValue="true" />
          <div className="rounded-md shadow-sm flex flex-col gap-4">
            <div className="transform transition duration-300 hover:translate-y-[-2px]">
              <label htmlFor="email-address" className="block text-sm font-medium text-gray-700 mb-1">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-teal-500 focus:border-teal-500 focus:z-10 sm:text-sm transition-all duration-300"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="transform transition duration-300 hover:translate-y-[-2px]">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-teal-500 focus:border-teal-500 focus:z-10 sm:text-sm transition-all duration-300"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="transform transition duration-300 hover:scale-[1.01]">
            <button
              type="submit"
              disabled={isSubmitting}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-500 hover:to-teal-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all duration-300 ease-in-out transform hover:-translate-y-1 shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </span>
              ) : (
                'Sign in'
              )}
            </button>
          </div>
        </form>
        <div className="text-sm text-center mt-4">
          <span className="text-gray-600">Don't have an account? </span>
          <Link to="/register" className="font-medium text-teal-600 hover:text-teal-500 transition duration-300 ease-in-out">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;

// Add these CSS keyframes to your global CSS or use Tailwind config for animations
// @keyframes shake {
//   0%, 100% { transform: translateX(0); }
//   25% { transform: translateX(-5px); }
//   75% { transform: translateX(5px); }
// }
// @keyframes fadeInUp {
//   from { opacity: 0; transform: translateY(20px); }
//   to { opacity: 1; transform: translateY(0); }
