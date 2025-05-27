import { FaLock, FaUserLock, FaUser } from "react-icons/fa";
import { useState } from "react";
import styles from "../../Styles/AuthForm.module.css";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [restaurantId, setRestaurantId] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    // Validação das senhas
    if (password !== confirmPassword) {
      setMessage("As senhas não coincidem!");
      setLoading(false);
      return;
    }

    // Validação da força da senha
    if (password.length < 6) {
      setMessage("A senha deve ter pelo menos 6 caracteres!");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          senha: password,
          restaurantId: restaurantId
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage("Cadastro realizado com sucesso!");
        // Limpar formulário
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setRestaurantId("");
        
        // Redirecionar ou fazer outras ações necessárias
        // window.location.href = '/login'; // exemplo
      } else {
        setMessage(data.message || "Erro ao realizar cadastro");
      }
    } catch (error) {
      console.error('Erro na requisição:', error);
      setMessage("Erro de conexão com o servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles["auth-page"]}>
      <form className={styles.container} onSubmit={handleSubmit}>
        <h1 className={styles.title}>Faça seu Cadastro</h1>

        {message && (
          <div className={`${styles.message} ${message.includes('sucesso') ? styles.success : styles.error}`}>
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
          <input
            type="text"
            placeholder="ID do Restaurante"
            value={restaurantId}
            required
            disabled={loading}
            onChange={(e) => setRestaurantId(e.target.value)}
          />
          <FaUserLock className={styles.icon} />
        </div>

        <button 
          type="submit" 
          className={styles.button}
          disabled={loading}
        >
          {loading ? "Cadastrando..." : "Cadastrar"}
        </button>
      </form>
    </div>
  );
};

export default Register;