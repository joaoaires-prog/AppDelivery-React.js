import { FaLock, FaUser } from "react-icons/fa";
import { useState } from "react";
import styles from "../../Styles/AuthForm.module.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    alert("Logando...");
  };

  return (
    <div className={styles["auth-page"]}>
      <form className={styles.container} onSubmit={handleSubmit}>
        <h1 className={styles.title}>Faça seu Login</h1>

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

        <div className={styles["recall-forget"]}>
          <label>
            <input type="checkbox" />
            Lembrar de mim?
          </label>
          <a href="/Remember">Esqueceu a Senha?</a>
        </div>

        <button className={styles.button}>Entrar</button>

        <div className={styles["signup-link"]}>
          <a href="/Cadastro">Registrar-se</a>
        </div>
      </form>
    </div>
  );
};

export default Login;
