import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Home from "../Pages/Home/Home";
import Login from "../Pages/Login/Login";
import Register from "../Pages/Register/Register";
import Navbar from "../Components/Navbar";
import Remember from "../Pages/Remember/remember";

const Layout = ({ children }) => {
  const location = useLocation();

  const hideNavbarRoutes = ["/login", "/cadastro", "/remember"];
  const hideNavbar = hideNavbarRoutes.includes(location.pathname.toLowerCase());

  return (
    <>
      {!hideNavbar && <Navbar />}
      {children}
    </>
  );
};

const AppRoutes = () => (
  <Router>
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Register />} />
        <Route path="/remember" element={<Remember />} />
      </Routes>
    </Layout>
  </Router>
);

export default AppRoutes;
