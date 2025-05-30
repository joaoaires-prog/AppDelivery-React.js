"use client"

import { useAuth } from "../../Context/AuthContext"
import { Navigate, useLocation } from "react-router-dom"

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()
  const location = useLocation()

  if (loading) {
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
    // Redireciona para login e salva a rota que tentou acessar
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}
