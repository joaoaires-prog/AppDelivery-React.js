import { FaLock, FaUser } from "react-icons/fa";
import { useState } from "react";
import styles from "../../Styles/AuthForm.module.css";
import { useNavigate } from 'react-router-dom'; 

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

   const navigate = useNavigate(); 

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
      const response = await fetch('http://localhost:3001/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          senha: password
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage("Login realizado com sucesso!");
        
        // --- NOVIDADE AQUI: Lidando com o TOKEN JWT ---
        if (data.token) {
          // Armazene o token. localStorage é persistente, sessionStorage é para a sessão atual.
          if (rememberMe) {
            localStorage.setItem('authToken', data.token);
            // Opcional: localStorage.setItem('userData', JSON.stringify(data.data));
            console.log('Token armazenado no localStorage:', data.token);
          } else {
            sessionStorage.setItem('authToken', data.token);
            // Opcional: sessionStorage.setItem('userData', JSON.stringify(data.data));
            console.log('Token armazenado no sessionStorage:', data.token);
          }
        }
        // --- FIM DA NOVIDADE ---

        setEmail("");
        setPassword("");
        
        // Redirecionar após 1.5 segundos
        setTimeout(() => {
          // Redirecionar para dashboard ou página principal
          // window.location.href = '/dashboard'; // exemplo com redirecionamento full page
          // Ou se estiver usando React Router:
          // navigate('/dashboard'); 
          console.log('Redirecionando para dashboard...');
          // Para este exemplo, vamos apenas alertar e limpar o formulário.
          // Em um projeto real, você redirecionaria para uma rota protegida.
        }, 1500);
        
      } else {
        setMessage(data.message || "Erro ao fazer login");
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
        <h1 className={styles.title}>Faça seu Login</h1>

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
          <a href="/Remember">Esqueceu a Senha?</a>
        </div>

        <button 
          type="submit"
          className={styles.button}
          disabled={loading}
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>

        <div className={styles["signup-link"]}>
          <a href="/Cadastro">Registrar-se</a>
        </div>
      </form>
    </div>
  );
};

export default Login;