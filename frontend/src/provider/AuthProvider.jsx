import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
} from "react";
import axios from "axios";
import toast from "react-hot-toast";

const AuthContext = createContext();

const LOGIN_ENDPOINT = "/api/auth/login";

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(
    localStorage.getItem("access_token")
  );
  const [userId, setUserId] = useState(localStorage.getItem("user_id"));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const requestInterceptor = axios.interceptors.request.use(
      (config) => {
        if (accessToken) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
      },
      (err) => {
        return Promise.reject(err);
      }
    );

    return () => {
      axios.interceptors.request.eject(requestInterceptor);
    };
  }, [accessToken]);

  const login = async (username, password) => {
    setLoading(true);
    setError(null);

    try {
      const res = await axios.post(LOGIN_ENDPOINT, {
        Username: username,
        Password: password,
      });
      if (!res.data?.success)
        throw new Error(res.data?.message || "Login failed");
      const id = res.data.data.id;
      const token = res.data.data.access_token;
      if (!token) throw new Error("Login failed: Token not received.");
      setAccessToken(token);
      setUserId(id);
      localStorage.setItem("access_token", token);
      localStorage.setItem("user_id", id);
      setIsAuthenticated(true);
      return; 
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Login failed";
      setError(msg);
      throw new Error(msg); 
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setAccessToken(null);
    setUserId(null);
    setError(null);
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_id");
    setIsAuthenticated(false);
    toast.success("Successfully logout!", { duration: 4000 });
  };

  const contextValue = useMemo(
    () => ({
      isAuthenticated: !!accessToken,
      accessToken,
      userId,
      loading,
      error,
      login,
      logout,
    }),
    [accessToken, loading, error]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
