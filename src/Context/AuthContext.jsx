

"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  const navigate = useNavigate();

  const API_BASE_URL = 'http://localhost:3001'; // <-- IMPORTANTE: Mude para a URL do seu backend em PRODUÇÃO!

  useEffect(() => {
    console.log("AuthContext: useEffect de inicialização chamado."); // LOG
    const loadUserFromLocalStorage = () => {
      try {
        const storedToken = localStorage.getItem("authToken");
        const storedUser = localStorage.getItem("authUser");

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
          console.log("AuthContext: Usuário e token carregados do localStorage."); // LOG
        } else {
          console.log("AuthContext: Nenhum usuário ou token encontrado no localStorage."); // LOG
        }
      } catch (e) {
        console.error("AuthContext: Erro ao carregar dados do localStorage:", e); // LOG
        localStorage.removeItem("authToken");
        localStorage.removeItem("authUser");
      } finally {
        setLoading(false);
        console.log("AuthContext: Inicialização do AuthContext finalizada. Loading: false."); // LOG
      }
    };

    loadUserFromLocalStorage();
  }, []);

  const login = async (email, senha) => {
    setLoading(true);
    console.log("AuthContext: Tentando login com email:", email); // LOG
    try {
      const response = await fetch(`${API_BASE_URL}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, senha }),
      });

      console.log("AuthContext: Resposta HTTP recebida do backend (login). Status:", response.status); // LOG
      const data = await response.json();
      console.log("AuthContext: Dados da resposta JSON do backend (login):", data); // LOG

      if (response.ok && data.success) {
        setToken(data.token);
        const userData = {
          id: data.data.id,
          email: data.data.email,
          restaurante: data.data.restaurantId,
          nome: data.data.nome,
          role: data.data.role
        };

        console.log("AuthContext: Login bem-sucedido. Usuário definido:", userData); // LOG
        console.log("AuthContext: Token definido:", data.token); // LOG

        setUser(userData);
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('authUser', JSON.stringify(userData));
        return { success: true, user: userData };
      } else {
        console.error("AuthContext: Falha no login, resposta do backend:", data.message); // LOG
        return { success: false, error: data.message || 'Erro desconhecido ao logar.' };
      }
    } catch (error) {
      console.error('AuthContext: ERRO DE REDE/FETCH na requisição de login:', error); // LOG
      return { success: false, error: 'Não foi possível conectar ao servidor. Tente novamente mais tarde.' };
    } finally {
      setLoading(false);
    }
  };

  const registerAdmin = async ({ email, senha, nome, restaurante }) => {
    setLoading(true);
    console.log("AuthContext: **** INÍCIO da função registerAdmin ****"); // LOG
    console.log("AuthContext: Dados recebidos em registerAdmin:", { email, nome, restaurante }); // LOG
    try {
      const response = await fetch(`${API_BASE_URL}/api/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          senha,
          nome,
          restaurantId: restaurante
        }),
      });

      console.log("AuthContext: Resposta HTTP recebida do backend (registro). Status:", response.status); // LOG
      const data = await response.json();
      console.log("AuthContext: Dados da resposta JSON do backend (registro):", data); // LOG

      if (response.ok && data.success) {
        console.log("AuthContext: Registro bem-sucedido."); // LOG
        return { success: true, message: data.message || "Administrador cadastrado com sucesso!" };
      } else {
        console.error("AuthContext: Falha no registro, mensagem do backend:", data.message); // LOG
        return { success: false, error: data.message || 'Erro desconhecido ao registrar administrador.' };
      }
    } catch (error) {
      console.error('AuthContext: ERRO DE REDE/FETCH na requisição de registro:', error); // LOG
      return { success: false, error: 'Não foi possível conectar ao servidor para registrar. Tente novamente mais tarde.' };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    console.log("AuthContext: Realizando logout."); // LOG
    setUser(null);
    setToken(null);
    localStorage.removeItem("authToken");
    localStorage.removeItem("authUser");
    navigate('/login');
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