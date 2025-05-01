import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import Profile from './pages/Profile';
import Stores from './pages/Stores';
import Items from './pages/Items';
import Transactions from './pages/Transactions';
import './App.css'; // Keep global styles if needed, or remove if unused

// Helper component to protect routes
function ProtectedRoute({ children }) {
  const userData = localStorage.getItem('userData');
  return userData ? children : <Navigate to="/login" replace />;
}

// Helper component for public routes (Login/Register) when logged in
function PublicRoute({ children }) {
   const userData = localStorage.getItem('userData');
   // If logged in, redirect from login/register to home/items page
   return userData ? <Navigate to="/items" replace /> : children;
}


function App() {
  return (
    <Router>
      <Navbar /> {/* Render Navbar outside Routes so it's always visible */}
      <div > {/* Optional: Add classes like "min-h-screen" if needed */}
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

          {/* Protected Routes */}
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/stores" element={<ProtectedRoute><Stores /></ProtectedRoute>} />
          <Route path="/items" element={<ProtectedRoute><Items /></ProtectedRoute>} />
          <Route path="/transactions" element={<ProtectedRoute><Transactions /></ProtectedRoute>} />

          {/* Default Route */}
          {/* Redirect root path based on login status */}
          <Route path="/" element={localStorage.getItem('userData') ? <Navigate to="/items" replace /> : <Navigate to="/login" replace />} />

          {/* Fallback for unknown routes (optional) */}
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </div>
    </Router>
  );
}

export default App;
