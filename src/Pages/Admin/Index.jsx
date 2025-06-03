// src/Pages/Admin/Index.jsx

"use client"

import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../Context/AuthContext"

export default function AdminIndex() {
  const navigate = useNavigate()
  const { user, loading } = useAuth()

  console.log("AdminIndex: Renderizando. User:", user, "Loading:", loading); // LOG
  if (user) {
      console.log("AdminIndex: User restaurante:", user.restaurante); // LOG
  }


  useEffect(() => {
    console.log("AdminIndex: useEffect chamado. User:", user, "Loading:", loading); // LOG
    if (!loading && user && user.restaurante) {
      console.log(`AdminIndex: Redirecionando para /admin/editar?restaurante=${user.restaurante}`); // LOG
      navigate(`/admin/editar?restaurante=${user.restaurante}`)
    } else if (!loading && !user) {
        console.log("AdminIndex: Usuário não logado após carregamento ou sem restaurante, redirecionando para /login."); // LOG
        navigate("/login");
    } else if (loading) {
        console.log("AdminIndex: Ainda carregando, aguardando user data."); // LOG
    }
  }, [navigate, user, loading])

  if (loading || !user) {
    console.log("AdminIndex: Exibindo tela de carregamento (user ou loading)."); // LOG
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  // Este return só será alcançado se houver um usuário, não estiver carregando,
  // mas o useEffect não redirecionou (ex: user.restaurante é null/undefined)
  console.log("AdminIndex: Renderizando conteúdo padrão. User:", user); // LOG
  return (
    <div className="text-center py-12">
      <h2 className="text-xl font-semibold text-gray-900">Bem-vindo ao Painel Administrativo!</h2>
      <p className="text-gray-600 mt-2">Seu restaurante é: {user.restaurante || 'Não definido'}</p>
      <p className="text-gray-600 mt-2">Aguarde o redirecionamento ou navegue para "Gerenciar Produtos".</p>
    </div>
  );
}