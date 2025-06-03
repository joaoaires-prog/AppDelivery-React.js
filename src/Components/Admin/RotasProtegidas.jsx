// src/Components/Admin/RotasProtegidas.jsx

"use client"

import { useAuth } from "../../Context/AuthContext"
import { Navigate, useLocation } from "react-router-dom"

export default function ProtectedRoute({ children, requiredRole = "admin" }) {
  const { isAuthenticated, loading, user } = useAuth()
  const location = useLocation()

  console.log("ProtectedRoute: Renderizando. Loading:", loading, "IsAuthenticated:", isAuthenticated); // LOG
  if (user) {
      console.log("ProtectedRoute: User data:", user); // LOG
      console.log("ProtectedRoute: User role:", user.role, "Required role:", requiredRole); // LOG
  } else {
      console.log("ProtectedRoute: User é null."); // LOG
  }


  if (loading) {
    console.log("ProtectedRoute: Still loading auth state..."); // LOG
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Verificando acesso...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    console.log("ProtectedRoute: Não autenticado. Redirecionando para /login."); // LOG
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (requiredRole && (!user.role || user.role !== requiredRole)) {
    console.warn(`ProtectedRoute: ACESSO NEGADO. Usuário '${user.email || "N/A"}' (role: '${user.role || "N/A"}') tentou acessar rota '${requiredRole}'.`); // LOG
    return <Navigate to="/" replace />
  }

  console.log(`ProtectedRoute: Acesso PERMITIDO para '${user.email}' (role: '${user.role}'). Renderizando filhos.`); // LOG
  return children
}