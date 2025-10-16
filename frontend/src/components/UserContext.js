import { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Recuperar usuario guardado al cargar
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [permissions, setPermissions] = useState(() => {
    // Recuperar permisos guardados al cargar
    const storedPermissions = localStorage.getItem("permissions");
    return storedPermissions ? JSON.parse(storedPermissions) : [];
  });

  // Efecto: guardar usuario y permisos cuando cambian
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  useEffect(() => {
    if (permissions?.length > 0) {
      localStorage.setItem("permissions", JSON.stringify(permissions));
    } else {
      localStorage.removeItem("permissions");
    }
  }, [permissions]);

  const logout = () => {
    setUser(null);
    setPermissions([]);
    localStorage.removeItem("user");
    localStorage.removeItem("permissions");
  };

  return (
    <UserContext.Provider
      value={{ user, setUser, permissions, setPermissions, logout }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
