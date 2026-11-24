/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from "react";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Decode the (unverified) JWT payload so a session survives backend hiccups.
  // The server still validates the token on every protected request.
  const userFromToken = (token) => {
    try {
      const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
      const payload = JSON.parse(atob(base64));
      if (payload.exp && payload.exp * 1000 < Date.now()) return null;
      return {
        user_id: payload.sub,
        email: payload.email || localStorage.getItem("email") || "",
        full_name: payload.full_name || "",
        roles: payload.roles || ["consumer"],
        is_active: true,
      };
    } catch {
      return null;
    }
  };

  const fetchUser = async (token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        setUser(await response.json());
      } else if (response.status === 401 || response.status === 403) {
        // Token genuinely invalid / expired
        logout();
      } else {
        // Server error (e.g. user portal down): keep the user signed in
        setUser(userFromToken(token) || null);
      }
    } catch (err) {
      // Network error: keep the user signed in using the token's own claims
      console.error("Failed to fetch user:", err);
      const fallback = userFromToken(token);
      if (fallback) setUser(fallback);
      else logout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchUser(token);
    } else {
      setLoading(false);
    }
  }, []);

  const formatError = (errorData, fallback) => {
    if (!errorData || !errorData.detail) return fallback;
    const detail = errorData.detail;
    if (typeof detail === "string") return detail;
    if (Array.isArray(detail)) {
      return detail
        .map((err) => {
          if (err && typeof err === "object") {
            const field = err.loc && Array.isArray(err.loc) ? err.loc[err.loc.length - 1] : "";
            return field ? `${field}: ${err.msg || "Invalid value"}` : (err.msg || JSON.stringify(err));
          }
          return String(err);
        })
        .join("; ");
    }
    if (typeof detail === "object") {
      return detail.msg || JSON.stringify(detail);
    }
    return fallback;
  };

  const login = async (email, password) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        },
      );

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.access_token);
        localStorage.setItem("email", email);
        if (data.user) {
          setUser(data.user);
        } else {
          await fetchUser(data.access_token);
        }
        return { success: true };
      } else {
        const errorData = await response.json();
        return { success: false, error: formatError(errorData, "Login failed") };
      }
    } catch (err) {
      console.error("Login error:", err);
      return { success: false, error: "Network or server error occurred" };
    }
  };

  const signup = async (email, password, fullName) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/auth/signup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password, full_name: fullName }),
        },
      );

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.access_token);
        localStorage.setItem("email", email);
        if (data.user) {
          setUser(data.user);
        } else {
          await fetchUser(data.access_token);
        }
        return { success: true };
      } else {
        const errorData = await response.json();
        return { success: false, error: formatError(errorData, "Signup failed") };
      }
    } catch (err) {
      console.error("Signup error:", err);
      return { success: false, error: "Network or server error occurred" };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
