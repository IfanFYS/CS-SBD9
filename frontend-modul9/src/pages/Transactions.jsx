import React, { useState, useEffect } from 'react';

function Transactions() {
  const [isLoading, setIsLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const [rotateGear, setRotateGear] = useState(false);

  useEffect(() => {
    // Simulated loading for animation effect
    setTimeout(() => {
      setIsLoading(false);
      setTimeout(() => {
        setShowContent(true);
      }, 400);
    }, 1000);

    // Add Transactions theme to body
    document.body.classList.add('bg-transactions-theme');
    
    return () => {
      document.body.classList.remove('bg-transactions-theme');
    };
  }, []);

  const handleHoverGear = () => {
    setRotateGear(true);
    setTimeout(() => {
      setRotateGear(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6">
      {isLoading ? (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-green-900 bg-opacity-50 backdrop-blur-sm">
          <div className="text-center">
            <div className="animate-spin rounded-full h-24 w-24 border-t-4 border-b-4 border-green-500 mb-4"></div>
            <p className="text-white text-xl font-medium">Loading transactions...</p>
          </div>
        </div>
      ) : (
        <div 
          className={`max-w-5xl mx-auto transition-all duration-700 ease-out transform ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        >
          <div className="rounded-2xl overflow-hidden shadow-xl bg-gradient-to-br from-white to-green-50 border border-green-100">
            <div className="relative overflow-hidden bg-gradient-to-r from-green-600 to-emerald-700 p-8 sm:p-12">
              {/* Decorative circles */}
              <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 rounded-full bg-green-500 bg-opacity-20"></div>
              <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-60 h-60 rounded-full bg-emerald-500 bg-opacity-20"></div>
              
              <div className="relative z-10">
                <div className="flex flex-col md:flex-row items-center justify-between">
                  <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-4 md:mb-0 tracking-tight">
                    Transaction Center
                  </h1>
                  
                  {/* Animated icon */}
                  <div 
                    className={`w-20 h-20 text-white transition-all duration-1000 ease-in-out ${rotateGear ? 'rotate-180' : ''}`}
                    onMouseEnter={handleHoverGear}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                      <path d="M17.004 10.407c.138.435-.216.842-.672.842h-3.465a.75.75 0 01-.65-.375l-1.732-3c-.229-.396-.053-.907.393-1.004a5.252 5.252 0 016.126 3.537zM8.12 8.464c.307-.338.838-.235 1.066.16l1.732 3a.75.75 0 010 .75l-1.732 3.001c-.229.396-.76.498-1.067.16A5.231 5.231 0 016.75 12c0-1.362.519-2.603 1.37-3.536zM10.878 17.13c-.447-.097-.623-.608-.394-1.003l1.733-3.003a.75.75 0 01.65-.375h3.465c.457 0 .81.408.672.843a5.252 5.252 0 01-6.126 3.538z" />
                      <path fillRule="evenodd" d="M21 12.75a.75.75 0 000-1.5h-.783a8.22 8.22 0 00-.237-1.357l.734-.267a.75.75 0 10-.513-1.41l-.735.268a8.24 8.24 0 00-.689-1.191l.6-.504a.75.75 0 10-.964-1.149l-.6.504a8.3 8.3 0 00-1.054-.885l.391-.678a.75.75 0 10-1.299-.75l-.39.677a8.188 8.188 0 00-1.295-.471l.136-.77a.75.75 0 00-1.477-.26l-.136.77a8.364 8.364 0 00-1.377 0l-.136-.77a.75.75 0 10-1.477.26l.136.77c-.448.121-.88.28-1.294.47l-.39-.676a.75.75 0 00-1.3.75l.392.678a8.29 8.29 0 00-1.054.885l-.6-.504a.75.75 0 00-.965 1.149l.6.503a8.243 8.243 0 00-.689 1.192L3.8 8.217a.75.75 0 10-.513 1.41l.735.267a8.222 8.222 0 00-.238 1.355h-.783a.75.75 0 000 1.5h.783c.042.464.122.917.238 1.356l-.735.268a.75.75 0 10.513 1.41l.735-.268c.197.417.428.816.69 1.192l-.6.504a.75.75 0 10.963 1.149l.601-.505c.326.323.679.62 1.054.885l-.392.68a.75.75 0 101.3.75l.39-.679c.414.192.847.35 1.294.471l-.136.771a.75.75 0 101.477.26l.137-.772a8.376 8.376 0 001.376 0l.136.773a.75.75 0 101.477-.26l-.136-.772a8.19 8.19 0 001.294-.47l.391.677a.75.75 0 101.3-.75l-.393-.679a8.282 8.282 0 001.054-.885l.601.504a.75.75 0 10.964-1.15l-.6-.503a8.24 8.24 0 00.69-1.191l.735.268a.75.75 0 10.512-1.41l-.734-.268c.115-.438.195-.892.237-1.356h.784zm-2.657-3.06a6.744 6.744 0 00-1.19-2.053 6.784 6.784 0 00-1.82-1.51A6.704 6.704 0 0012 5.25a6.801 6.801 0 00-1.225.11 6.7 6.7 0 00-2.15.793 6.784 6.784 0 00-2.952 3.489.758.758 0 01-.036.099A6.74 6.74 0 005.251 12a6.739 6.739 0 003.355 5.835l.01.006.01.005a6.706 6.706 0 002.203.802c.007 0 .014.002.021.004a6.792 6.792 0 002.301 0l.022-.004a6.707 6.707 0 002.228-.816 6.781 6.781 0 001.762-1.483l.009-.01.009-.012a6.744 6.744 0 001.18-2.064c.253-.708.39-1.47.39-2.264a6.74 6.74 0 00-.408-2.308z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                
                <p className="text-green-100 text-lg mt-4 max-w-2xl">
                  Track your purchase history, monitor refunds, and manage payment methods all in one place.
                </p>
              </div>
            </div>
            
            <div className="p-6 sm:p-10">
              {/* Transaction Content Section */}
              <div className="bg-white rounded-xl border border-green-100 shadow-inner p-8 mb-8 transition-all duration-300 hover:shadow-lg">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">Recent Transactions</h2>
                  
                  <div className="flex space-x-2">
                    <button className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-md hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition-all duration-300 ease-in-out transform hover:scale-105 flex items-center space-x-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                      <span>Export</span>
                    </button>
                    <button className="px-4 py-2 border border-green-500 text-green-600 rounded-md hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition-all duration-300 ease-in-out transform hover:scale-105 flex items-center space-x-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
                      </svg>
                      <span>Filter</span>
                    </button>
                  </div>
                </div>
                
                {/* Placeholder for transaction data */}
                <div className="space-y-6">
                  {[1, 2, 3].map((item, index) => (
                    <div 
                      key={index}
                      className="p-5 border border-gray-100 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 bg-gradient-to-r from-white to-green-50"
                    >
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                        <div className="flex items-center space-x-4 mb-3 sm:mb-0">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <div>
                            <h3 className="text-base sm:text-lg font-medium text-gray-800">Transaction #{1000 + index}</h3>
                            <p className="text-sm text-gray-500">May {index + 1}, 2025</p>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <p className="text-lg font-semibold text-green-600">Rp {(index + 1) * 250000}</p>
                          <span className="inline-block px-3 py-1 text-xs rounded-full bg-green-100 text-green-800 font-medium">Completed</span>
                        </div>
                      </div>
                      
                      <div className="mt-4 pt-4 border-t border-gray-100 text-sm text-gray-600">
                        <p>Item: Sample Product {index + 1}</p>
                        <p>Store: Demo Store {index + 1}</p>
                      </div>
                      
                      <div className="mt-4 flex justify-end space-x-2">
                        <button className="text-sm text-green-600 hover:text-green-800 hover:underline focus:outline-none transition-colors duration-300">View Details</button>
                        <button className="text-sm text-gray-500 hover:text-gray-700 hover:underline focus:outline-none transition-colors duration-300">Download Receipt</button>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Empty space with pagination */}
                <div className="mt-8 flex justify-center">
                  <nav className="inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <a href="#" className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                      <span className="sr-only">Previous</span>
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </a>
                    <a href="#" className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">1</a>
                    <a href="#" className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-green-50 text-sm font-medium text-green-600 hover:bg-green-100">2</a>
                    <a href="#" className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">3</a>
                    <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">...</span>
                    <a href="#" className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">8</a>
                    <a href="#" className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">9</a>
                    <a href="#" className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                      <span className="sr-only">Next</span>
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </a>
                  </nav>
                </div>
              </div>
              
              {/* Statistics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100 p-6 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1 transform">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-gray-700 font-medium">Total Spent</h3>
                    <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-gray-800">Rp 1,500,000</p>
                  <p className="mt-2 text-sm text-green-600">
                    <span className="font-medium">+12.5%</span>
                    <span className="text-gray-500 ml-1">from last month</span>
                  </p>
                </div>

                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100 p-6 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1 transform">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-gray-700 font-medium">Total Orders</h3>
                    <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-gray-800">28</p>
                  <p className="mt-2 text-sm text-green-600">
                    <span className="font-medium">+5.3%</span>
                    <span className="text-gray-500 ml-1">from last month</span>
                  </p>
                </div>

                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100 p-6 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1 transform">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-gray-700 font-medium">Saved Items</h3>
                    <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-gray-800">14</p>
                  <p className="mt-2 text-sm text-gray-600">
                    <span className="font-medium">2 new items</span>
                    <span className="text-gray-500 ml-1">since last week</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Add transaction theme styles */}
      <style jsx="true">{`
        .bg-transactions-theme {
          background-color: #f0fdf4;
          background-image: url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2322c55e' fill-opacity='0.07'%3E%3Cpath d='M50 50c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10c0 5.523-4.477 10-10 10s-10-4.477-10-10 4.477-10 10-10zM10 10c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10c0 5.523-4.477 10-10 10S0 25.523 0 20s4.477-10 10-10zm10 8c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8zm40 40c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8z' /%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
        }
      `}</style>
    </div>
  );
}

export default Transactions;
