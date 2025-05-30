"use client"

import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../Context/AuthContext"

export default function AdminIndex() {
  const navigate = useNavigate()
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      // Redireciona diretamente para a edição do restaurante do usuário logado
      navigate(`/admin/editar?restaurante=${user.restaurante}`)
    }
  }, [navigate, user])

  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
        <p className="mt-2 text-gray-600">Carregando...</p>
      </div>
    </div>
  )
}
