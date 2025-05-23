import { FaLock, FaUserLock, FaUser } from "react-icons/fa";
import { useState } from "react";
import styles from "../../Styles/AuthForm.module.css";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [restaurantId, setRestaurantId] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      alert("As senhas não coincidem!");
      return;
    }
    alert("Cadastro realizado com sucesso!");
  };

  return (
    <div className={styles["auth-page"]}>
      <form className={styles.container} onSubmit={handleSubmit}>
        <h1 className={styles.title}>Faça seu Cadastro</h1>

        <div className={styles["input-field"]}>
          <input
            type="email"
            placeholder="E-mail"
            required
            onChange={(e) => setUsername(e.target.value)}
          />
          <FaUser className={styles.icon} />
        </div>

        <div className={styles["input-field"]}>
          <input
            type="password"
            placeholder="Senha"
            required
            onChange={(e) => setPassword(e.target.value)}
          />
          <FaLock className={styles.icon} />
        </div>

        <div className={styles["input-field"]}>
          <input
            type="password"
            placeholder="Confirme a Senha"
            required
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <FaLock className={styles.icon} />
        </div>

        <div className={styles["input-field"]}>
          <input
            type="text"
            placeholder="ID do Restaurante"
            required
            onChange={(e) => setRestaurantId(e.target.value)}
          />
          <FaUserLock className={styles.icon} />
        </div>

        <button className={styles.button}>Entrar</button>
      </form>
    </div>
  );
};

export default Register;
