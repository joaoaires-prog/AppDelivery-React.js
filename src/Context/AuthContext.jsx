"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const API_BASE_URL = "http://localhost:3001";

  useEffect(() => {
    const loadUserFromLocalStorage = () => {
      try {
        const storedToken = localStorage.getItem("authToken");
        const storedUser = localStorage.getItem("authUser");

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        } else {
        }
      } catch (e) {
        localStorage.removeItem("authToken");
        localStorage.removeItem("authUser");
      } finally {
        setLoading(false);
      }
    };

    loadUserFromLocalStorage();
  }, []);

  const login = async (email, senha) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, senha }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setToken(data.token);
        const userData = {
          id: data.data.id,
          email: data.data.email,
          restaurante: data.data.restaurantId,
          nome: data.data.nome,
          role: data.data.role,
        };

        setUser(userData);
        localStorage.setItem("authToken", data.token);
        localStorage.setItem("authUser", JSON.stringify(userData));
        return { success: true, user: userData };
      } else {
        return {
          success: false,
          error: data.message || "Erro desconhecido ao logar.",
        };
      }
    } catch (error) {
      return {
        success: false,
        error:
          "Não foi possível conectar ao servidor. Tente novamente mais tarde.",
      };
    } finally {
      setLoading(false);
    }
  };

  const registerAdmin = async ({ email, senha, nome, restaurante }) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          senha,
          nome,
          restaurantId: restaurante,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        return {
          success: true,
          message: data.message || "Administrador cadastrado com sucesso!",
        };
      } else {
        return {
          success: false,
          error:
            data.message || "Erro desconhecido ao registrar administrador.",
        };
      }
    } catch (error) {
      return {
        success: false,
        error:
          "Não foi possível conectar ao servidor para registrar. Tente novamente mais tarde.",
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("authToken");
    localStorage.removeItem("authUser");
    navigate("/login");
  };

  const value = {
    user,
    token,
    loading,
    login,
    registerAdmin,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider");
  }
  return context;
}
