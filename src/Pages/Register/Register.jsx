import { FaLock, FaSadCry, FaUserLock  } from "react-icons/fa";
import { FaUser } from "react-icons/fa";
import { useState } from "react";
import './Register.css';

const Register = () => {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (event) => {
        event.preventDefault();

        alert("Enviando os Dados:")
    }

    return (
        <div className="container">
            <form onSubmit={handleSubmit}>
                <h1>Faça seu Cadastro</h1>
                <div className="input-field">
                    <input type="email"
                        placeholder='E-mail'
                        required
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <FaUser className="icon"></FaUser>
                </div>
                <div className="input-field">
                    <input type="password"
                        placeholder='Senha'
                        required
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <FaLock className="icon"></FaLock>
                </div>
                <div className="input-field">
                    <input type="password"
                        placeholder='Confirme a Senha'
                        required
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <FaLock className="icon"></FaLock>
                </div>
                <div className="input-field">
                    <input type="id"
                        placeholder='ID do Restaurante'
                        required
                        onChange={(e) => setRestaurantId(e.target.value)}
                    />
                    <FaUserLock  className="icon"></FaUserLock >
                </div>
                <button className="button">Entrar</button>
            </form>
        </div>
    )
}
export default Register