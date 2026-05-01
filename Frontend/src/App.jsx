import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import ScrollToTop from './components/ScrollToTop';
import Pricing from './pages/Pricing';
import CompanyPlan from './pages/CompanyPlan';
import PracticePlan from './pages/PracticePlan';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <AuthProvider>
        <div className="bg-black min-h-screen font-inter selection:bg-amber-500/30 selection:text-amber-500">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route 
              path="/plan/:companyName" 
              element={
                <ProtectedRoute>
                  <CompanyPlan />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/practice/:companyName/:dayNumber" 
              element={
                <ProtectedRoute>
                  <PracticePlan />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
