import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from "../Pages/Home/Home";
import Login from "../Pages/Login/Login";
import Register from "../Pages/Register/Register";

const AppRoutes = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/Login" element={<Login />} />
      <Route path="/Cadastro" element={<Register />} />
    </Routes>
  </Router>
);

export default AppRoutes;

