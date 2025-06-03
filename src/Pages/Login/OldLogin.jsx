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
  const { login: adminLogin } = useAuth();

  const from = location.state?.from?.pathname || "/";

  const checkIfAdminEmail = (email) => {
    const adminEmails = [
      "admin@mais1cafe.com",
      "admin@apetitis.com",
      "admin@picapau.com",
    ];
    return adminEmails.includes(email.toLowerCase());
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    if (!email || !password) {
      setMessage("Todos os campos são obrigatórios!");
      setLoading(false);
      return;
    }

    if (checkIfAdminEmail(email)) {
      // Login de administrador
      const result = adminLogin(email, password);

      if (result.success) {
        setMessage("Login de administrador realizado com sucesso!");
        setEmail("");
        setPassword("");

        setTimeout(() => {
          const redirectTo = from.startsWith("/admin") ? from : "/admin";
          navigate(redirectTo, { replace: true });
        }, 1500);
      } else {
        setMessage(result.error || "Erro ao fazer login de administrador");
      }
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:3001/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          senha: password,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage("Login realizado com sucesso!");

        if (data.token) {
          if (rememberMe) {
            localStorage.setItem("authToken", data.token);
            console.log("Token armazenado no localStorage:", data.token);
          } else {
            sessionStorage.setItem("authToken", data.token);
            console.log("Token armazenado no sessionStorage:", data.token);
          }
        }

        setEmail("");
        setPassword("");

        setTimeout(() => {
          console.log("Redirecionando para dashboard...");
          navigate("/", { replace: true });
        }, 1500);
      } else {
        setMessage(data.message || "Erro ao fazer login");
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
      setMessage("Erro de conexão com o servidor");
    } finally {
      setLoading(false);
    }
  };

  const handleEmailChange = (e) => {
    const emailValue = e.target.value;
    setEmail(emailValue);
    setIsAdminLogin(checkIfAdminEmail(emailValue));
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

        {!isAdminLogin && (
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
        )}

        <button type="submit" className={styles.button} disabled={loading}>
          {loading ? "Entrando..." : isAdminLogin ? "Acessar Painel" : "Entrar"}
        </button>

        {!isAdminLogin && (
          <div className={styles["signup-link"]}>
            <a href="/cadastro">Registrar-se</a>
          </div>
        )}

        {isAdminLogin && (
          <div className={styles["admin-info"]}>
            <h4>Contas de teste:</h4>
            <div className={styles["test-accounts"]}>
              <p>
                <strong>Mais1Café:</strong> admin@mais1cafe.com
              </p>
              <p>
                <strong>Apetitis:</strong> admin@apetitis.com
              </p>
              <p>
                <strong>Pica Pau:</strong> admin@picapau.com
              </p>
              <p>
                <em>Senha para todos: 123456</em>
              </p>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default Login;
