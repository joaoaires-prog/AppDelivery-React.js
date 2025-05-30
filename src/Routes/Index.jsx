import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { AuthProvider } from "../Context/AuthContext";

// Componentes existentes
import Home from "../Pages/Home/Home";
import Login from "../Pages/Login/Login";
import Register from "../Pages/Register/Register";
import Remember from "../Pages/Remember/remember";
import Navbar from "../Components/Navbar";

// Componentes do admin
import AdminLayout from "../Layouts/AdminLayout";
import AdminIndex from "../Pages/Admin/Index";
import EditarProdutos from "../Pages/Admin/EditarProdutos";
import ProtectedRoute from "../Components/Admin/RotasProtegidas";

const Layout = ({ children }) => {
  const location = useLocation();

  // Rotas onde a navbar deve ser ocultada
  const hideNavbarRoutes = ["/login", "/cadastro", "/remember", "/admin"];

  // Verificar se é uma rota admin (inclui subrotas como /admin/editar)
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

const AppRoutes = () => (
  <AuthProvider>
    <Router>
      <Layout>
        <Routes>
          {/* Rotas públicas existentes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Register />} />
          <Route path="/remember" element={<Remember />} />

          {/* Rotas administrativas protegidas */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminIndex />} />
            <Route path="editar" element={<EditarProdutos />} />
          </Route>
        </Routes>
      </Layout>
    </Router>
  </AuthProvider>
);

export default AppRoutes;
