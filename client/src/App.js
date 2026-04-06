import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login      from './pages/Login';
import Register   from './pages/Register';
import Dashboard  from './pages/Dashboard';
import AddData    from './pages/AddData';
import Reports    from './pages/Reports';
import Layout     from './components/Layout';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="spinner-border text-success" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
  return user ? children : <Navigate to="/login" replace />;
};

function AppRoutes() {
  const { user } = useAuth();
  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />
       <Route path="/register" element={user ? <Navigate to="/" replace /> : <Register />} />
      <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
        <Route index        element={<Dashboard />} />
        <Route path="add"     element={<AddData />}   />
        <Route path="reports" element={<Reports />}   />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
