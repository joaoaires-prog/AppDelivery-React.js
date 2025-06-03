
import { Routes, Route, useLocation } from "react-router-dom";
import Home from "../Pages/Home/Home";

import Login from "../Pages/Login/Login";
import Register from "../Pages/Register/Register";
import RememberPage from "../Pages/Remember/remember";
import Navbar from "../Components/Navbar";

import AdminLayout from "../Layouts/AdminLayout";
import AdminIndex from "../Pages/Admin/Index";
import EditarProdutos from "../Pages/Admin/EditarProdutos";
import ProtectedRoute from "../Components/Admin/RotasProtegidas";

const MainLayout = ({ children }) => {
  const location = useLocation();

  const hideNavbarRoutes = ["/login", "/cadastro", "/remember", "/admin"];
  const isAdminRoute = location.pathname.toLowerCase().startsWith("/admin");
  const hideNavbar =
    hideNavbarRoutes.includes(location.pathname.toLowerCase()) || isAdminRoute;

  return (
    <>
      {!hideNavbar && <Navbar />}
      {children}
    </>
  );
};

const AppRoutesContent = () => (
  <MainLayout>
    <Routes>
      <Route path="/" element={<Home />} />
      {/* MUDANÇA AQUI: A rota /login agora usa o seu AdminLogin renomeado para Login */}
      <Route path="/login" element={<Login />} />
      <Route path="/cadastro" element={<Register />} />
      <Route path="/remember" element={<RememberPage />} />

      <Route
        path="/admin"
        element={
          <ProtectedRoute requiredRole="admin">
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminIndex />} />
        <Route path="editar" element={<EditarProdutos />} />
      </Route>
    </Routes>
  </MainLayout>
);

export default AppRoutesContent;