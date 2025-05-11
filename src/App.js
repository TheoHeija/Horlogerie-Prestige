import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Layout components
import DashboardLayout from './components/layout/DashboardLayout';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Orders from './pages/Orders';
import Products from './pages/Products';
import Settings from './pages/Settings';
import Service from './pages/Service';
import Categories from './pages/Categories';
import Inventory from './pages/Inventory';
import Analytics from './pages/Analytics';
import Customers from './pages/Customers';
import ProductShowcase from './pages/ProductShowcase';

/**
 * App component - Main application entry point
 * Sets up routing and authentication
 */
function App() {
  // Handle dark mode based on localStorage preference
  useEffect(() => {
    // Apply theme settings
    const applyTheme = () => {
      const savedTheme = localStorage.getItem('theme');

      if (savedTheme === 'dark' ||
        (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
    };

    // Apply theme immediately
    applyTheme();

    // Listen for system preference changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      // Only apply if no theme is saved in localStorage
      if (!localStorage.getItem('theme')) {
        applyTheme();
      }
    };

    mediaQuery.addEventListener('change', handleChange);

    // Listen for custom theme change events
    const handleThemeChanged = (e) => {
      const isDarkMode = e.detail.isDarkMode;
      if (isDarkMode) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
    };

    window.addEventListener('themeChanged', handleThemeChanged);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
      window.removeEventListener('themeChanged', handleThemeChanged);
    };
  }, []);

  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />

          {/* Redirect root to dashboard */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* Protected routes with DashboardLayout */}
          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/users" element={<Users />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/products" element={<Products />} />
              <Route path="/product-showcase" element={<ProductShowcase />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/inventory" element={<Inventory />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/customers" element={<Customers />} />
              <Route path="/service" element={<Service />} />
              <Route path="/settings" element={<Settings />} />
            </Route>
          </Route>

          {/* Fallback route for any unmatched paths */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
