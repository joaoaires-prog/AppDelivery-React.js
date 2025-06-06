// src/Pages/Auth/Register.jsx

"use client";

import { FaLock, FaUser, FaStore } from "react-icons/fa";
import { useState } from "react";
import styles from "../../Styles/AuthForm.module.css";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext"; //

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [restaurantId, setRestaurantId] = useState(""); // Este estado agora guardará o ID NUMÉRICO
  const [nomeAdmin, setNomeAdmin] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();
  const { registerAdmin } = useAuth(); //

  // ATUALIZE ESTE OBJETO COM OS IDs NUMÉRICOS REAIS DA SUA TABELA 'restaurantes' NO SUPABASE
  // Exemplo: "Nome Exibido no Select": ID_NUMERICO_DO_RESTAURANTE_NO_BD
  const restaurantesDisponiveis = {
    "Mais1Café": 3, // Exemplo: se o ID de 'Mais1Café' na tabela 'restaurantes' for 1
    "Apetitis": 2,  // Exemplo: se o ID de 'Apetitis' na tabela 'restaurantes' for 2
    "Pica Pau Crepes": 1, // Exemplo: se o ID de 'Pica Pau Crepes' na tabela 'restaurantes' for 3
    // Adapte esses IDs para os que você tem no seu banco!
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    console.log("Register.jsx: handleSubmit chamado.");

    if (password !== confirmPassword) {
      setMessage("As senhas não coincidem!");
      setLoading(false);
      console.log("Register.jsx: Senhas não coincidem. Retornando.");
      return;
    }

    if (password.length < 6) {
      setMessage("A senha deve ter pelo menos 6 caracteres!");
      setLoading(false);
      console.log("Register.jsx: Senha muito curta. Retornando.");
      return;
    }

    if (!nomeAdmin || !restaurantId) {
      setMessage("Nome do administrador e restaurante são obrigatórios!");
      setLoading(false);
      console.log(
        "Register.jsx: Campos de admin obrigatórios faltando. Retornando."
      );
      return;
    }

    const payload = {
      email,
      senha: password,
      nome: nomeAdmin,
      restaurante: restaurantId, // restaurantId agora já é o ID numérico
    };
    console.log(
      "Register.jsx: Todas as validações passadas. Payload para registerAdmin:",
      payload
    ); //

    const result = await registerAdmin(payload); //
    if (result.success) {
      console.log(
        "Register.jsx: Registro bem-sucedido. Mensagem:",
        result.message
      );
      setMessage(
        result.message ||
          "Administrador cadastrado com sucesso! Redirecionando para login..."
      );

      // Limpar os campos do formulário
      setPassword("");
      setConfirmPassword("");
      setRestaurantId("");
      setNomeAdmin("");

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } else {
      console.log("Register.jsx: Registro falhou. Erro:", result.error);
      setMessage(result.error || "Erro ao cadastrar administrador");
    }
    setLoading(false);
  };

  return (
    <div className={styles["auth-page"]}>
      <form className={styles.container} onSubmit={handleSubmit}>
        <h1 className={styles.title}>Cadastro de Administrador</h1>

        <div className={styles["admin-notice"]}>
          <p>🔐 Cadastre-se como administrador do seu restaurante</p>
        </div>

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
            type="text"
            placeholder="Nome do Administrador"
            value={nomeAdmin}
            required
            disabled={loading}
            onChange={(e) => setNomeAdmin(e.target.value)}
          />
          <FaUser className={styles.icon} />
        </div>

        <div className={styles["input-field"]}>
          <input
            type="email"
            placeholder="E-mail (ex: admin@restaurante.com)"
            value={email}
            required
            disabled={loading}
            onChange={(e) => setEmail(e.target.value)}
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

        <div className={styles["input-field"]}>
          <input
            type="password"
            placeholder="Confirme a Senha"
            value={confirmPassword}
            required
            disabled={loading}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <FaLock className={styles.icon} />
        </div>

        <div className={styles["input-field"]}>
          <select
            value={restaurantId}
            required
            disabled={loading}
            onChange={(e) => setRestaurantId(parseInt(e.target.value))} // <--- Converte para inteiro aqui!
            className={styles.select}
          >
            <option value="">Selecione o Restaurante</option>
            {Object.entries(restaurantesDisponiveis).map(([nomeExibir, idNumerico]) => (
              <option key={idNumerico} value={idNumerico}> {/* value agora é o ID NUMÉRICO */}
                {nomeExibir}
              </option>
            ))}
          </select>
          <FaStore className={styles.icon} />
        </div>

        <button type="submit" className={styles.button} disabled={loading}>
          {loading ? "Cadastrando..." : "Cadastrar Administrador"}
        </button>

        <div className={styles["admin-info"]}>
          <h4>Instruções para Administradores:</h4>
          <div className={styles["admin-instructions"]}>
            <p>Use um email com padrão: admin@nomerestaurante.com</p>
            <p>Selecione o restaurante que você irá gerenciar</p>
            <p>A senha deve ter pelo menos 6 caracteres</p>
            <p>Após o cadastro, faça login para acessar o painel</p>
          </div>
        </div>

        <div className={styles["login-link"]}>
          <Link to="/login">Já tem uma conta? Faça login</Link>
        </div>
      </form>
    </div>
  );
};

export default Register;