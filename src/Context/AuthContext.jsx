"use client"

import { createContext, useContext, useState, useEffect } from "react"

const AuthContext = createContext()

// Dados simulados dos administradores (agora dinâmico)
let administradores = {
  "admin@mais1cafe.com": {
    id: 1,
    nome: "João Silva",
    email: "admin@mais1cafe.com",
    senha: "123456",
    restaurante: "mais1cafe",
    nomeRestaurante: "Mais1Café",
  },
  "admin@apetitis.com": {
    id: 2,
    nome: "Maria Santos",
    email: "admin@apetitis.com",
    senha: "123456",
    restaurante: "apetitis",
    nomeRestaurante: "Apetitis",
  },
  "admin@picapau.com": {
    id: 3,
    nome: "Carlos Oliveira",
    email: "admin@picapau.com",
    senha: "123456",
    restaurante: "picapau",
    nomeRestaurante: "Pica Pau Crepes",
  },
}

const nomeRestaurantes = {
  mais1cafe: "Mais1Café",
  apetitis: "Apetitis",
  picapau: "Pica Pau Crepes",
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Carregar administradores salvos
    const savedAdmins = localStorage.getItem("administradores")
    if (savedAdmins) {
      administradores = { ...administradores, ...JSON.parse(savedAdmins) }
    }

    // Verificar se há usuário logado
    const savedUser = localStorage.getItem("adminUser")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [])

  const login = (email, senha) => {
    const admin = administradores[email.toLowerCase()]

    if (admin && admin.senha === senha) {
      const userData = {
        id: admin.id,
        nome: admin.nome,
        email: admin.email,
        restaurante: admin.restaurante,
        nomeRestaurante: admin.nomeRestaurante,
      }

      setUser(userData)
      localStorage.setItem("adminUser", JSON.stringify(userData))
      return { success: true }
    }

    return { success: false, error: "Email ou senha incorretos" }
  }

  const registerAdmin = ({ email, senha, nome, restaurante }) => {
    // Verificar se o email já existe
    if (administradores[email.toLowerCase()]) {
      return { success: false, error: "Este email já está cadastrado" }
    }

    // Verificar se o restaurante é válido
    if (!nomeRestaurantes[restaurante]) {
      return { success: false, error: "Restaurante inválido" }
    }

    // Verificar se já existe um admin para este restaurante
    const adminExistente = Object.values(administradores).find((admin) => admin.restaurante === restaurante)
    if (adminExistente) {
      return { success: false, error: `Já existe um administrador para ${nomeRestaurantes[restaurante]}` }
    }

    // Criar novo administrador
    const novoAdmin = {
      id: Date.now(),
      nome,
      email: email.toLowerCase(),
      senha,
      restaurante,
      nomeRestaurante: nomeRestaurantes[restaurante],
    }

    // Adicionar aos administradores
    administradores[email.toLowerCase()] = novoAdmin

    // Salvar no localStorage (apenas os novos)
    const novosAdmins = JSON.parse(localStorage.getItem("administradores") || "{}")
    novosAdmins[email.toLowerCase()] = novoAdmin
    localStorage.setItem("administradores", JSON.stringify(novosAdmins))

    return { success: true }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("adminUser")
  }

  const value = {
    user,
    login,
    registerAdmin,
    logout,
    loading,
    isAuthenticated: !!user,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider")
  }
  return context
}
