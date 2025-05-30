"use client"

import { FaLock, FaUserLock, FaUser, FaStore } from "react-icons/fa"
import { useState } from "react"
import styles from "../../Styles/AuthForm.module.css"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../Context/AuthContext"

const Register = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [restaurantId, setRestaurantId] = useState("")
  const [nomeAdmin, setNomeAdmin] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [isAdminRegister, setIsAdminRegister] = useState(false)

  const navigate = useNavigate()
  const { registerAdmin } = useAuth()

  // Lista de restaurantes disponíveis
  const restaurantesDisponiveis = {
    mais1cafe: "Mais1Café",
    apetitis: "Apetitis",
    picapau: "Pica Pau Crepes",
  }

  // Verificar se é um registro de administrador
  const checkIfAdminRegister = (email, restaurantId) => {
    const adminPattern = /admin@/i
    const validRestaurants = Object.keys(restaurantesDisponiveis)
    return adminPattern.test(email) || validRestaurants.includes(restaurantId.toLowerCase())
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setMessage("")

    // Validação das senhas
    if (password !== confirmPassword) {
      setMessage("As senhas não coincidem!")
      setLoading(false)
      return
    }

    // Validação da força da senha
    if (password.length < 6) {
      setMessage("A senha deve ter pelo menos 6 caracteres!")
      setLoading(false)
      return
    }

    // Verificar se é registro de administrador
    if (checkIfAdminRegister(email, restaurantId)) {
      // Registro de administrador
      const result = registerAdmin({
        email,
        senha: password,
        nome: nomeAdmin,
        restaurante: restaurantId.toLowerCase(),
      })

      if (result.success) {
        setMessage("Administrador cadastrado com sucesso! Redirecionando para login...")
        // Limpar formulário
        setEmail("")
        setPassword("")
        setConfirmPassword("")
        setRestaurantId("")
        setNomeAdmin("")

        setTimeout(() => {
          navigate("/login")
        }, 2000)
      } else {
        setMessage(result.error || "Erro ao cadastrar administrador")
      }
      setLoading(false)
      return
    }

    // Registro normal de usuário (sua lógica existente)
    try {
      const response = await fetch("http://localhost:3001/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          senha: password,
          restaurantId: restaurantId,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setMessage("Cadastro realizado com sucesso!")
        // Limpar formulário
        setEmail("")
        setPassword("")
        setConfirmPassword("")
        setRestaurantId("")

        setTimeout(() => {
          navigate("/login")
        }, 2000)
      } else {
        setMessage(data.message || "Erro ao realizar cadastro")
      }
    } catch (error) {
      console.error("Erro na requisição:", error)
      setMessage("Erro de conexão com o servidor")
    } finally {
      setLoading(false)
    }
  }

  // Detectar automaticamente se é registro de admin
  const handleEmailChange = (e) => {
    const emailValue = e.target.value
    setEmail(emailValue)
    setIsAdminRegister(checkIfAdminRegister(emailValue, restaurantId))
  }

  const handleRestaurantChange = (e) => {
    const restaurantValue = e.target.value
    setRestaurantId(restaurantValue)
    setIsAdminRegister(checkIfAdminRegister(email, restaurantValue))
  }

  return (
    <div className={styles["auth-page"]}>
      <form className={styles.container} onSubmit={handleSubmit}>
        <h1 className={styles.title}>{isAdminRegister ? "Cadastro de Administrador" : "Faça seu Cadastro"}</h1>

        {isAdminRegister && (
          <div className={styles["admin-notice"]}>
            <p>🔐 Cadastro de administrador de restaurante</p>
          </div>
        )}

        {message && (
          <div className={`${styles.message} ${message.includes("sucesso") ? styles.success : styles.error}`}>
            {message}
          </div>
        )}

        {isAdminRegister && (
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
        )}

        <div className={styles["input-field"]}>
          <input
            type="email"
            placeholder={isAdminRegister ? "E-mail (ex: admin@restaurante.com)" : "E-mail"}
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
          {isAdminRegister ? (
            <select
              value={restaurantId}
              required
              disabled={loading}
              onChange={handleRestaurantChange}
              className={styles.select}
            >
              <option value="">Selecione o Restaurante</option>
              {Object.entries(restaurantesDisponiveis).map(([id, nome]) => (
                <option key={id} value={id}>
                  {nome}
                </option>
              ))}
            </select>
          ) : (
            <input
              type="text"
              placeholder="ID do Restaurante"
              value={restaurantId}
              required
              disabled={loading}
              onChange={handleRestaurantChange}
            />
          )}
          {isAdminRegister ? <FaStore className={styles.icon} /> : <FaUserLock className={styles.icon} />}
        </div>

        <button type="submit" className={styles.button} disabled={loading}>
          {loading ? "Cadastrando..." : isAdminRegister ? "Cadastrar Administrador" : "Cadastrar"}
        </button>

        {isAdminRegister && (
          <div className={styles["admin-info"]}>
            <h4>Instruções para Administradores:</h4>
            <div className={styles["admin-instructions"]}>
              <p>Use um email com padrão: admin@nomerestaurante.com</p>
              <p>Selecione o restaurante que você irá gerenciar</p>
              <p>A senha deve ter pelo menos 6 caracteres</p>
              <p>Após o cadastro, faça login para acessar o painel</p>
            </div>
          </div>
        )}

        <div className={styles["login-link"]}>
          <a href="/login">Já tem uma conta? Faça login</a>
        </div>
      </form>
    </div>
  )
}

export default Register
