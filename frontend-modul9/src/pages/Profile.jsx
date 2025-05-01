import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Profile() {
  const [userData, setUserData] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showProfileCard, setShowProfileCard] = useState(false);

  useEffect(() => {
    const storedData = localStorage.getItem('userData');
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      setUserData(parsedData);
      setName(parsedData.name);
      setEmail(parsedData.email);
      
      // Add a small delay before showing the profile card for animation effect
      setTimeout(() => {
        setShowProfileCard(true);
      }, 300);
    } else {
      setError('User data not found. Please log in.');
    }
    
    // Add profile theme background
    document.body.classList.add('bg-profile-theme');
    
    return () => {
      document.body.classList.remove('bg-profile-theme');
    };
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setIsSubmitting(true);
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

    if (!userData || !userData.id) {
      setError('User ID not found. Cannot update profile.');
      setIsSubmitting(false);
      return;
    }

    // Prepare update data
    const updateData = {
      id: userData.id,
      name,
      email,
    };

    // Only include password if it's being changed and is not empty
    if (password && password.trim() !== '') {
      updateData.password = password;
    }

    try {
      // Add form animation during submission
      e.target.classList.add('animate-pulse');
      
      // Send PUT request to the correct endpoint
      const response = await axios.put(`${backendUrl}/user`, updateData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.data && response.data.success) {
        setMessage('Profile updated successfully!');
        // Update local storage with new data
        const updatedUserData = {
          ...userData,
          name,
          email
        };
        localStorage.setItem('userData', JSON.stringify(updatedUserData));
        setUserData(updatedUserData);
        setPassword('');
        setIsEditing(false);
      } else {
        setError(response.data.message || 'Failed to update profile.');
      }
    } catch (err) {
      console.error('Profile update error:', err);
      
      if (err.response) {
        setError(err.response.data?.message || 'An error occurred during profile update.');
      } else if (err.request) {
        setError('Network error. Please check your connection and try again.');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
      e.target.classList.remove('animate-pulse');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-indigo-100 py-16 px-4 sm:px-6 transition-all duration-300">
      <div 
        className={`max-w-3xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-700 transform ${showProfileCard ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      >
        {/* Header Section with SVG Waves - Increased height */}
        <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 to-indigo-900 h-56">
          <div className="absolute bottom-0 left-0 right-0 h-16">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="absolute bottom-0 w-full h-full">
              <path fill="#ffffff" fillOpacity="1" d="M0,224L60,192C120,160,240,96,360,90.7C480,85,600,139,720,144C840,149,960,107,1080,96C1200,85,1320,107,1380,117.3L1440,128L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"></path>
            </svg>
          </div>

          {/* Profile Avatar - Larger and positioned better */}
          <div className="absolute -bottom-0 inset-x-0 flex justify-center">
            <div className="h-28 w-28 rounded-full bg-white p-2 shadow-lg">
              <div className="h-full w-full rounded-full bg-indigo-200 flex items-center justify-center text-indigo-700 text-3xl font-bold">
                {userData?.name?.charAt(0)?.toUpperCase() || '?'}
              </div>
            </div>
          </div>
        </div>

        {/* Content Section - Added more padding at top */}
        <div className="pt-20 pb-8 px-6">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">{userData?.name || 'User'}</h1>
          <p className="text-center text-gray-500 mb-8">{userData?.email || 'Loading...'}</p>

          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md mb-6 animate-fade-in" role="alert">
              <div className="flex">
                <div className="py-1">
                  <svg className="w-6 h-6 mr-4 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="block sm:inline">{error}</span>
              </div>
            </div>
          )}
          
          {message && (
            <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-md mb-6 animate-fade-in" role="alert">
              <div className="flex">
                <div className="py-1">
                  <svg className="w-6 h-6 mr-4 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="block sm:inline">{message}</span>
              </div>
            </div>
          )}

          {userData && !isEditing && (
            <div className="space-y-6 mb-8">
              {/* Improved profile info layout with cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-indigo-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
                  <h3 className="text-sm uppercase tracking-wide text-indigo-600 font-semibold mb-2">Name</h3>
                  <p className="text-lg text-gray-800 font-medium">{userData.name}</p>
                </div>
                
                <div className="bg-indigo-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
                  <h3 className="text-sm uppercase tracking-wide text-indigo-600 font-semibold mb-2">Email</h3>
                  <p className="text-lg text-gray-800 font-medium break-all">{userData.email}</p>
                </div>
                
                {userData.balance !== undefined && (
                  <div className="bg-indigo-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
                    <h3 className="text-sm uppercase tracking-wide text-indigo-600 font-semibold mb-2">Balance</h3>
                    <p className="text-lg text-green-600 font-medium">
                      Rp {Number(userData.balance).toLocaleString('id-ID')}
                    </p>
                  </div>
                )}
              </div>
              
              <div className="flex justify-center pt-4">
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-indigo-800 text-white rounded-md hover:shadow-lg transform transition-all duration-300 hover:scale-105 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-indigo-500 flex items-center space-x-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                  <span>Edit Profile</span>
                </button>
              </div>
            </div>
          )}

          {/* Edit form remains the same */}
          {isEditing && (
            <div className="transition-all duration-300 ease-in-out animate-fade-in">
              <form onSubmit={handleUpdate} className="space-y-6">
                <div className="group">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1 group-hover:text-indigo-600 transition-colors duration-200">Full Name</label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="appearance-none rounded-md relative block w-full pl-10 px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm transition-all duration-300 hover:shadow-md"
                      placeholder="Your full name"
                    />
                  </div>
                </div>
                <div className="group">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1 group-hover:text-indigo-600 transition-colors duration-200">Email Address</label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                    </div>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="appearance-none rounded-md relative block w-full pl-10 px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm transition-all duration-300 hover:shadow-md"
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>
                <div className="group">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1 group-hover:text-indigo-600 transition-colors duration-200">New Password (optional)</label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Leave blank to keep current password"
                      className="appearance-none rounded-md relative block w-full pl-10 px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm transition-all duration-300 hover:shadow-md"
                    />
                  </div>
                  {password && (
                    <div className="mt-2 p-3 bg-gray-50 rounded-md border border-gray-200">
                      <p className="text-xs text-gray-600 font-medium mb-1">Password must:</p>
                      <ul className="text-xs space-y-1">
                        <li className={`flex items-center ${password.length >= 8 ? "text-green-600" : "text-gray-600"}`}>
                          <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 mr-1 ${password.length >= 8 ? "text-green-500" : "text-gray-400"}`} viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Be at least 8 characters long
                        </li>
                        <li className={`flex items-center ${/\d/.test(password) ? "text-green-600" : "text-gray-600"}`}>
                          <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 mr-1 ${/\d/.test(password) ? "text-green-500" : "text-gray-400"}`} viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Contain at least one number
                        </li>
                        <li className={`flex items-center ${/[!@#$%^&*(),.?":{}|<>]/.test(password) ? "text-green-600" : "text-gray-600"}`}>
                          <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 mr-1 ${/[!@#$%^&*(),.?":{}|<>]/.test(password) ? "text-green-500" : "text-gray-400"}`} viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Contain at least one special character (!@#$%^&*(),.?":{}|&lt;&gt;)
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="group relative flex-1 justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-indigo-600 to-indigo-800 hover:from-indigo-700 hover:to-indigo-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                      {isSubmitting ? (
                        <svg className="animate-spin h-5 w-5 text-indigo-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      ) : (
                        <svg className="h-5 w-5 text-indigo-300 group-hover:text-indigo-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </span>
                    {isSubmitting ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => {
                      setIsEditing(false);
                      if(userData) {
                          setName(userData.name);
                          setEmail(userData.email);
                      }
                      setPassword('');
                      setError('');
                      setMessage('');
                    }}
                    className="flex-1 justify-center py-3 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 ease-in-out transform hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* Add profile theme styles */}
      <style jsx="true">{`
        .bg-profile-theme {
          background-color: #eef2ff;
          background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%234f46e5' fill-opacity='0.08'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
        }
        
        .animate-fade-in {
          animation: fadeIn 0.5s ease-in-out forwards;
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

export default Profile;
