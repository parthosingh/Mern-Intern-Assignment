import { Routes, Route } from 'react-router-dom';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import AdminDashboard from '../pages/AdminDashboard';
import StudentDashboard from '../pages/StudentDashboard';
import ProtectedRoute from '../components/ProtectedRoute';

const AllRoutes = () => (
  <Routes>
    <Route path="/login" element={<Login />} />
    <Route path="/signup" element={<Signup />} />
    <Route
      path="/admin"
      element={
        <ProtectedRoute role="Admin">
          <AdminDashboard />
        </ProtectedRoute>
      }
    />
    <Route
      path="/student"
      element={
        <ProtectedRoute role="Student">
          <StudentDashboard />
        </ProtectedRoute>
      }
    />
    <Route path="/" element={<Login />} />
  </Routes>
);

export default AllRoutes;