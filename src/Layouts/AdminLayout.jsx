"use client";

import { useState, useEffect } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import { Menu, X, Package, ArrowLeft, LogOut, User } from "lucide-react";
import "../Styles/Admin.css";

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    console.log(
      "AdminLayout: useEffect chamado. User:",
      user,
      "Loading:",
      loading
    );

    if (!loading && !user) {
      console.log(
        "AdminLayout: Usuário não existe e não está carregando. Redirecionando para /login."
      );
      navigate("/login");
    }
  }, [user, loading, navigate]);

  const handleLogout = () => {
    console.log("AdminLayout: Acionando logout.");
    logout();
  };

  if (loading) {
    console.log("AdminLayout: Em estado de carregamento inicial."); // LOG
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Carregando painel...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    console.log(
      "AdminLayout: User é null após carregamento, não deveria acontecer aqui se ProtectedRoute funcionou."
    ); // LOG
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div
        className={`fixed inset-0 z-50 lg:hidden ${
          sidebarOpen ? "block" : "hidden"
        }`}
      >
        <div
          className="fixed inset-0 bg-black bg-opacity-25"
          onClick={() => setSidebarOpen(false)}
        />
        <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-xl">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold text-gray-900">
              Painel Admin
            </h2>
            <button onClick={() => setSidebarOpen(false)}>
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div>

          <div className="p-4">
            <div className="bg-purple-50 rounded-lg p-4 mb-4">
              <div className="flex items-center gap-3">
                <User className="w-8 h-8 text-purple-600" />
                <div>
                  <p className="font-medium text-gray-900">{user.nome}</p>
                  <p className="text-sm text-purple-600">
                    {user.restaurante || "N/A"}
                  </p>
                </div>
              </div>
            </div>

            <nav className="space-y-2">
              <Link
                to={`/admin/editar?restaurante=${user.restaurante}`}
                className="flex items-center gap-3 px-3 py-2 rounded-lg transition-colors bg-purple-100 text-purple-700"
                onClick={() => setSidebarOpen(false)}
              >
                <Package className="w-5 h-5" />
                Gerenciar Produtos
              </Link>
            </nav>
          </div>
        </div>
      </div>

      <div className="admin-sidebar hidden lg:block">
        <div className="flex flex-col h-full">
          <div className="admin-sidebar-header">
            <Package className="w-8 h-8 text-purple-600" />
            <h1 className="text-xl font-bold text-gray-900">Painel Admin</h1>
          </div>

          <div className="p-4">
            <div className="bg-purple-50 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-3">
                <User className="w-8 h-8 text-purple-600" />
                <div>
                  <p className="font-medium text-gray-900">{user.nome}</p>
                  <p className="text-sm text-purple-600">
                    {user.restaurante || "N/A"}
                  </p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
              </div>
            </div>

            <nav className="space-y-2">
              <Link
                to={`/admin/editar?restaurante=${user.restaurante}`}
                className="flex items-center gap-3 px-3 py-2 rounded-lg transition-colors bg-purple-100 text-purple-700"
              >
                <Package className="w-5 h-5" />
                Gerenciar Produtos
              </Link>
            </nav>
          </div>

          <div className="mt-auto p-4 border-t space-y-2">
            <Link
              to="/"
              className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Voltar ao Site
            </Link>

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2 text-red-700 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
              Sair
            </button>
          </div>
        </div>
      </div>

      <div className="admin-content">
        <div className="admin-mobile-header">
          <button onClick={() => setSidebarOpen(true)}>
            <Menu className="w-6 h-6 text-gray-500" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900">
            {user.restaurante || "N/A"}
          </h1>
          <button
            onClick={handleLogout}
            className="text-red-600 hover:text-red-700"
          >
            <LogOut className="w-6 h-6" />
          </button>
        </div>

        <main className="admin-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
