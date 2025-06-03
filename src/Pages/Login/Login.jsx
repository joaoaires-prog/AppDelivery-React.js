"use client";

import { FaLock, FaUser } from "react-icons/fa";
import { useState } from "react";
import styles from "../../Styles/AuthForm.module.css";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isAdminLogin, setIsAdminLogin] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { login: authContextLogin, user: authUser } = useAuth();
  const from = location.state?.from?.pathname || "/";

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    if (!email || !password) {
      setMessage("Todos os campos são obrigatórios!");
      setLoading(false);
      return;
    }

    try {
      const result = await authContextLogin(email, password);

      if (result.success) {
        setMessage("Login realizado com sucesso!");
        setEmail("");
        setPassword("");

        const userRole = result.user?.role;

        if (userRole === "admin") {
          setIsAdminLogin(true);
          setTimeout(() => {
            navigate("/admin/editar", { replace: true });
          }, 1500);
        } else {
          setIsAdminLogin(false);
          setTimeout(() => {
            navigate(from, { replace: true });
          }, 1500);
        }
      } else {
        setMessage(result.error || "Erro ao fazer login");
      }
    } catch (error) {
      console.error("Erro no processo de login:", error);
      setMessage("Ocorreu um erro inesperado. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleEmailChange = (e) => {
    const emailValue = e.target.value;
    setEmail(emailValue);
  };

  return (
    <div className={styles["auth-page"]}>
      <form className={styles.container} onSubmit={handleSubmit}>
        <h1 className={styles.title}>
          {isAdminLogin ? "Login Administrativo" : "Faça seu Login"}
        </h1>

        {isAdminLogin && (
          <div className={styles["admin-notice"]}>
            <p>🔐 Acesso restrito para administradores</p>
          </div>
        )}

        {message && (
          <div
            className={`${styles.message} ${
              message.includes("sucesso") ? styles.success : styles.error
            }`}
          >
            {message}
          </div>
        )}

        <div className={styles["input-field"]}>
          <input
            type="email"
            placeholder="E-mail"
            value={email}
            required
            disabled={loading}
            onChange={handleEmailChange}
          />
          <FaUser className={styles.icon} />
        </div>

        <div className={styles["input-field"]}>
          <input
            type="password"
            placeholder="Senha"
            value={password}
            required
            disabled={loading}
            onChange={(e) => setPassword(e.target.value)}
          />
          <FaLock className={styles.icon} />
        </div>

        <div className={styles["recall-forget"]}>
          <label>
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              disabled={loading}
            />
            Lembrar de mim?
          </label>
          <a href="/remember">Esqueceu a Senha?</a>
        </div>

        <button type="submit" className={styles.button} disabled={loading}>
          {loading ? "Entrando..." : "Entrar"}
        </button>

        <div className={styles["signup-link"]}>
          <a href="/cadastro">Registrar-se</a>
        </div>
      </form>
    </div>
  );
};

export default Login;
