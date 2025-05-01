import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [animatedLogo, setAnimatedLogo] = useState(false);
  const userData = JSON.parse(localStorage.getItem('userData'));
  
  // Track scroll position to add background opacity change
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    
    // Animate the logo on initial load
    setTimeout(() => {
      setAnimatedLogo(true);
    }, 500);
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    // Add a simple logout animation
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
      logoutBtn.classList.add('animate-ping');
      setTimeout(() => {
        localStorage.removeItem('userData');
        navigate('/login');
      }, 300);
    } else {
      localStorage.removeItem('userData');
      navigate('/login');
    }
  };

  // Get current page for conditional styling
  const getNavbarStyle = () => {
    // Default style (Profile page)
    let baseStyle = "text-white shadow-lg sticky top-0 z-40 transition-all duration-300";
    
    if (scrolled) {
      baseStyle += " shadow-xl";
    }
    
    // Different background colors for different pages
    if (location.pathname.includes('/stores')) {
      return `${baseStyle} bg-gradient-to-r from-purple-700 to-purple-900`;
    } else if (location.pathname.includes('/items')) {
      return `${baseStyle} bg-gradient-to-r from-blue-700 to-blue-900`;
    } else if (location.pathname.includes('/transactions')) {
      return `${baseStyle} bg-gradient-to-r from-green-700 to-green-900`;
    } else if (location.pathname.includes('/profile')) {
      return `${baseStyle} bg-gradient-to-r from-indigo-600 to-indigo-800`;
    } else if (location.pathname.includes('/login') || location.pathname.includes('/register')) {
      return `${baseStyle} bg-gradient-to-r from-teal-600 to-teal-800`;
    } else {
      return `${baseStyle} bg-gradient-to-r from-indigo-600 to-indigo-800`; 
    }
  };

  const activeBgColor = () => {
    if (location.pathname.includes('/stores')) {
      return "text-purple-700";
    } else if (location.pathname.includes('/items')) {
      return "text-blue-700";
    } else if (location.pathname.includes('/transactions')) {
      return "text-green-700";
    } else if (location.pathname.includes('/profile')) {
      return "text-indigo-700";
    } else {
      return "text-indigo-700";
    }
  };

  return (
    <nav className={getNavbarStyle()}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand logo - updated with all white text */}
          <div className="flex-shrink-0">
            <div 
              className={`font-bold text-xl md:text-2xl transition-all duration-700 ease-in-out cursor-default ${animatedLogo ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}
              onClick={() => {
                const logoEl = document.querySelector('.logo-text');
                if (logoEl) {
                  logoEl.classList.add('animate-pulse');
                  setTimeout(() => {
                    logoEl.classList.remove('animate-pulse');
                  }, 1000);
                }
              }}
            >
              <div className="logo-text inline-flex items-center relative">
                <span className="text-white font-extrabold">CS9 SBD</span>
                <span className="ml-1.5 text-white">Fathan Yazid Satriani</span>
                {/* Animated underline effect */}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-700 ease-out group-hover:w-full"></span>
              </div>
            </div>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-opacity-20 hover:bg-white focus:outline-none"
            >
              <span className="sr-only">Open main menu</span>
              <svg 
                className={`${isMenuOpen ? 'hidden' : 'block'} h-6 w-6`} 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor" 
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <svg 
                className={`${isMenuOpen ? 'block' : 'hidden'} h-6 w-6`} 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor" 
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Desktop menu */}
          <div className="hidden md:block">
            <div className="flex items-center space-x-1 md:space-x-3">
              {userData ? (
                <>
                  {/* Navigation links are now disabled but still visually active */}
                  <div
                    onClick={() => navigate('/profile')}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-md cursor-pointer ${location.pathname === '/profile' ? 'bg-white ' + activeBgColor() + ' font-semibold' : 'hover:bg-opacity-20 hover:bg-white'}`}
                  >
                    Profile
                  </div>
                  <div
                    onClick={() => navigate('/stores')}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-md cursor-pointer ${location.pathname === '/stores' ? 'bg-white ' + activeBgColor() + ' font-semibold' : 'hover:bg-opacity-20 hover:bg-white'}`}
                  >
                    Stores
                  </div>
                  <div
                    onClick={() => navigate('/items')}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-md cursor-pointer ${location.pathname === '/items' ? 'bg-white ' + activeBgColor() + ' font-semibold' : 'hover:bg-opacity-20 hover:bg-white'}`}
                  >
                    Items
                  </div>
                  <div
                    onClick={() => navigate('/transactions')}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-md cursor-pointer ${location.pathname === '/transactions' ? 'bg-white ' + activeBgColor() + ' font-semibold' : 'hover:bg-opacity-20 hover:bg-white'}`}
                  >
                    Transactions
                  </div>
                  <button
                    id="logout-btn"
                    onClick={handleLogout}
                    className="px-4 py-2 rounded-md text-sm font-medium bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-indigo-600 focus:ring-red-500 transition-all duration-300 ease-in-out transform hover:scale-105 hover:-translate-y-1 hover:shadow-lg"
                  >
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V7.414l-4-4H3zm9 5a1 1 0 10-2 0v4a1 1 0 102 0V8zm-2-7a1 1 0 00-1 1v1a1 1 0 102 0V2a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      Logout
                    </div>
                  </button>
                </>
              ) : (
                <>
                  <div
                    onClick={() => navigate('/login')}
                    className="px-4 py-2 rounded-md text-sm font-medium hover:bg-opacity-20 hover:bg-white transition-all duration-300 ease-in-out border border-transparent hover:border-white cursor-pointer"
                  >
                    Login
                  </div>
                  <div
                    onClick={() => navigate('/register')}
                    className="px-4 py-2 rounded-md text-sm font-medium bg-white text-teal-700 hover:bg-teal-50 transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg cursor-pointer"
                  >
                    Register
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
        
        {/* Mobile menu, toggle based on menu state */}
        <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden`}>
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {userData ? (
              <>
                <div
                  onClick={() => {
                    navigate('/profile');
                    setIsMenuOpen(false);
                  }}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${location.pathname === '/profile' ? 'bg-white ' + activeBgColor() : 'hover:bg-opacity-20 hover:bg-white'}`}
                >
                  Profile
                </div>
                <div
                  onClick={() => {
                    navigate('/stores');
                    setIsMenuOpen(false);
                  }}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${location.pathname === '/stores' ? 'bg-white ' + activeBgColor() : 'hover:bg-opacity-20 hover:bg-white'}`}
                >
                  Stores
                </div>
                <div
                  onClick={() => {
                    navigate('/items');
                    setIsMenuOpen(false);
                  }}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${location.pathname === '/items' ? 'bg-white ' + activeBgColor() : 'hover:bg-opacity-20 hover:bg-white'}`}
                >
                  Items
                </div>
                <div
                  onClick={() => {
                    navigate('/transactions');
                    setIsMenuOpen(false);
                  }}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${location.pathname === '/transactions' ? 'bg-white ' + activeBgColor() : 'hover:bg-opacity-20 hover:bg-white'}`}
                >
                  Transactions
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-white bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <div
                  onClick={() => {
                    navigate('/login');
                    setIsMenuOpen(false);
                  }}
                  className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-opacity-20 hover:bg-white"
                >
                  Login
                </div>
                <div
                  onClick={() => {
                    navigate('/register');
                    setIsMenuOpen(false);
                  }}
                  className="block px-3 py-2 rounded-md text-base font-medium bg-white text-teal-700 hover:bg-teal-50"
                >
                  Register
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      
      {/* Animation styles */}
      <style jsx="true">{`
        @keyframes gradientBg {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        
        .logo-text:hover {
          text-shadow: 0 0 10px rgba(255,255,255,0.5);
        }
      `}</style>
    </nav>
  );
}

export default Navbar;
