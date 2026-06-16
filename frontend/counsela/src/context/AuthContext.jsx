import {
  createContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import authService from "../service/authService";

export const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Cookie otomatis terkirim, tidak perlu token manual
        const response = await authService.getProfile();
        const userData = response.user || response;
        
        if (userData && userData.id) {
          setUser(userData);
          // Backup ke localStorage untuk keperluan lain
          localStorage.setItem("user", JSON.stringify(userData));
        } else {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        }
      } catch (error) {
        console.error("Auth initialization failed:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    // Token sudah di cookie, tidak perlu simpan di localStorage
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error("Logout API error:", error);
    }
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  const updateUser = (updatedData) => {
    const updatedUser = { ...user, ...updatedData };
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  const isAuthenticated = !!user && !!user.id;
  const isAdmin = user?.role?.toLowerCase() === "admin";
  const isLawyer = user?.role?.toLowerCase() === "lawyer";
  const isClient = user?.role?.toLowerCase() === "client";

  const value = useMemo(
    () => ({
      user,
      loading,
      login,
      logout,
      updateUser,
      isAuthenticated,
      isAdmin,
      isLawyer,
      isClient,
    }),
    [user, loading, isAuthenticated, isAdmin, isLawyer, isClient]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;