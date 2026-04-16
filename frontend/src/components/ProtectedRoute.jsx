import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  const token = localStorage.getItem('token');

  if (!token) {
    // Si no hay token, lo mandamos al login
    return <Navigate to="/login" replace />;
  }

  // Si hay token, renderiza la vista hija
  return <Outlet />;
};

export default ProtectedRoute;
