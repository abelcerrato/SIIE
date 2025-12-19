
import { Navigate, useLocation,Outlet } from "react-router-dom";
import { useUser } from "./UserContext";
import { useEffect, useState } from "react";

const ProtectedRoute = ({ children }) => {
  const { user } = useUser();
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);

  
  useEffect(() => {
    // Pequeño delay para asegurar que la verificación sea consistente
    const timer = setTimeout(() => {
      setIsChecking(false);
    }, 50);

    return () => clearTimeout(timer);
  }, []);


  
if (user?.requiresPasswordChange) {
  return <Outlet />; // pero el modal bloquea todo
}
  // Verificar tanto en el estado como en localStorage
  const storedUser = localStorage.getItem("user");
  const isAuthenticated = user || storedUser;

  if (isChecking) {
    // Puedes mostrar un loading spinner aquí
    return <div>Cargando...</div>;
  }

  if (!isAuthenticated) {
    // Redirigir al inicio (no al login) y reemplazar en el historial
    return <Navigate to="/Login" replace state={{ from: location }} />;
  }

  return children;
};

export default ProtectedRoute;


/* 
import { Navigate, useLocation } from "react-router-dom";
import { useUser } from "./UserContext"; // Ajusta la ruta según tu estructura

const ProtectedRoute = ({ children }) => {
  const { user } = useUser();
  const location = useLocation();

  if (!user) {
    // Redirigir al login y guardar la ubicación intentada
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
 */