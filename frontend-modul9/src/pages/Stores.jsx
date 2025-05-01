import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Stores() {
  const [stores, setStores] = useState([]);
  const [filteredStores, setFilteredStores] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);

  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

  // Fetch stores
  const fetchStores = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await axios.get(`${backendUrl}/store`);
      if (response.data && response.data.success) {
        setStores(response.data.payload || []);
        setFilteredStores(response.data.payload || []);
        // Trigger animation after data loads
        setTimeout(() => {
          setAnimateIn(true);
        }, 100);
      } else {
        setError(response.data.message || 'Failed to fetch stores.');
        setStores([]);
        setFilteredStores([]);
      }
    } catch (err) {
      console.error('Fetch stores error:', err);
      setError(err.response?.data?.message || 'An error occurred while fetching stores.');
      setStores([]);
      setFilteredStores([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStores();
    
    // Add background animation effect
    document.body.classList.add('bg-stores-theme');
    
    return () => {
      document.body.classList.remove('bg-stores-theme');
    };
  }, []);

  // Filter stores when search term changes
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredStores(stores);
      return;
    }
    
    const lowercasedSearch = searchTerm.toLowerCase();
    const results = stores.filter(store => 
      store.name.toLowerCase().includes(lowercasedSearch) || 
      store.address.toLowerCase().includes(lowercasedSearch)
    );
    
    setFilteredStores(results);
  }, [searchTerm, stores]);

  // Handle add store
  const handleAddStore = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      const formElement = e.target;
      formElement.classList.add('animate-pulse');
      
      const response = await axios.post(`${backendUrl}/store`, { name, address });
      
      if (response.data && response.data.success) {
        setMessage('Store added successfully!');
        setName('');
        setAddress('');
        fetchStores();
        setIsAdding(false);
        
        // Reset form animation
        formElement.classList.remove('animate-pulse');
      } else {
        setError(response.data.message || 'Failed to add store.');
        formElement.classList.remove('animate-pulse');
      }
    } catch (err) {
      console.error('Add store error:', err);
      setError(err.response?.data?.message || 'An error occurred while adding the store.');
      
      // Reset form animation on error too
      e.target.classList.remove('animate-pulse');
    }
  };
  
  // Handle search change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-purple-100 transition-all duration-300">
      {/* Improved Header Section with better spacing and organization */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white py-8 px-6 mb-8 shadow-md">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="mb-4 md:mb-0">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              Stores
            </h1>
            <p className="mt-2 text-purple-100 font-light">
              Manage all your store locations
            </p>
          </div>
          
          {!isAdding && (
            <button
              onClick={() => { setIsAdding(true); setMessage(''); setError(''); }}
              className="inline-flex items-center px-5 py-2.5 bg-white text-purple-700 rounded-md hover:bg-purple-50 shadow-sm transition-all duration-300 hover:scale-105 font-medium"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Add New Store
            </button>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6">
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md mb-6 animate-fade-in shadow-md" role="alert">
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
          <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-md mb-6 animate-fade-in shadow-md" role="alert">
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

        {/* Add Store Form */} 
        {isAdding && (
          <div className="mb-8 p-6 bg-white rounded-xl shadow-lg border-b-4 border-purple-500 transition-all transform duration-300 hover:shadow-xl">
            <h2 className="text-2xl font-semibold text-purple-700 mb-6 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              Add a New Store
            </h2>
            <form onSubmit={handleAddStore} className="space-y-4 transition-all duration-300">
              <div className="group">
                <label htmlFor="store-name" className="block text-sm font-medium text-gray-700 mb-1 group-hover:text-purple-600 transition-colors duration-200">Store Name</label>
                <input
                  id="store-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm transition-all duration-300 hover:shadow-md"
                  placeholder="Enter store name"
                />
              </div>
              <div className="group">
                <label htmlFor="store-address" className="block text-sm font-medium text-gray-700 mb-1 group-hover:text-purple-600 transition-colors duration-200">Address</label>
                <input
                  id="store-address"
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                  className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm transition-all duration-300 hover:shadow-md"
                  placeholder="Enter store address"
                />
              </div>
              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="group relative flex-1 justify-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg"
                >
                  <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                    <svg className="h-5 w-5 text-purple-300 group-hover:text-purple-200" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                  </span>
                  Add Store
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsAdding(false);
                    setName('');
                    setAddress('');
                    setError('');
                  }}
                  className="group relative flex-1 justify-center py-2.5 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-300 ease-in-out transform hover:shadow-lg"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Search Bar */}
        {!isAdding && !isLoading && stores.length > 0 && (
          <div className="mb-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Search stores by name or address"
                className="pl-10 pr-4 py-3 w-full rounded-lg border-gray-200 border focus:border-purple-500 focus:ring-purple-500 transition-colors duration-200 bg-white shadow-sm"
              />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Stores List */} 
        {isLoading ? (
          <div className="flex flex-col justify-center items-center mt-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
            <p className="text-purple-600 mt-4 font-medium">Loading stores...</p>
          </div>
        ) : filteredStores && filteredStores.length > 0 ? (
          <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${animateIn ? 'opacity-100' : 'opacity-0'} transition-opacity duration-700`}>
            {filteredStores.map((store, index) => (
              <div 
                key={store.id} 
                className="bg-white rounded-lg shadow-md hover:shadow-xl transform transition-all duration-300 ease-in-out hover:-translate-y-1 border-t-4 border-purple-500"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="p-6">
                  <div className="flex flex-col">
                    <h3 className="text-lg font-semibold text-purple-700 mb-1">{store.name}</h3>
                    <div className="inline-block w-fit px-2 py-0.5 mb-3 bg-purple-100 text-purple-800 text-xs rounded-md font-medium">
                      Store ID: {store.id}
                    </div>
                    
                    <div className="mt-2 flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0 mr-2 text-purple-600" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      <p className="text-gray-600 text-left">{store.address}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : stores.length > 0 ? (
          <div className="text-center my-10 p-8 bg-white rounded-lg shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-purple-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-lg text-gray-500 mb-3">No stores match your search.</p>
            <p className="text-gray-400">Try different keywords or clear the search.</p>
            <button 
              onClick={() => setSearchTerm('')}
              className="mt-4 px-4 py-2 bg-purple-100 text-purple-600 rounded-md hover:bg-purple-200 transition-colors duration-300"
            >
              Clear Search
            </button>
          </div>
        ) : (
          !error && (
            <div className="text-center my-16 p-8 bg-white rounded-lg shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-purple-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <p className="text-lg text-gray-500 mb-6">No stores found.</p>
              <p className="text-purple-600 mb-6">Add your first store to get started!</p>
              <button
                onClick={() => setIsAdding(true)}
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-300 ease-in-out transform hover:scale-105"
              >
                Add Store
              </button>
            </div>
          )
        )}
      </div>
      
      {/* Add some global styles for store theme */}
      <style jsx="true">{`
        .bg-stores-theme {
          background-color: #fcfaff;
          background-image: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%239C92AC' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E");
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

export default Stores;
