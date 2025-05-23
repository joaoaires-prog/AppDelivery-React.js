import { FaLock, FaUser } from "react-icons/fa";
import { useState } from "react";
import styles from "../../Styles/AuthForm.module.css";

const Remember = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (event) => {
        event.preventDefault();
        alert("Enviamos uma solicitação para seu email.");
    };

    return (
        <div className={styles["auth-page"]}>
            <form className={styles.container} onSubmit={handleSubmit}>
                <h1 className={styles.title}>Recupere sua senha</h1>

                <div className={styles["input-field"]}>
                    <input
                        type="email"
                        placeholder="E-mail"
                        required
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <FaUser className={styles.icon} />
                </div>

                <button className={styles.button}>Enviar link de Recuperação</button>

            </form>
        </div>
    );
};

export default Remember;

