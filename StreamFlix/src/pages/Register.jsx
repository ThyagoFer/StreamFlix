import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/LoginRegister.css';
import logoImage from '../assets/logo.png';
import { apiRegister } from '../service/api';

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setMessage('Por favor, preencha todos os campos.');
      return;
    }

    const result = await apiRegister(email, password);

    if (result.success) {
      setMessage('Cadastro realizado com sucesso!');
      setTimeout(() => navigate('/'), 1500);
    } else {
      setMessage(result.detail || 'Erro ao realizar cadastro.');
    }
  };

  return (
    <div className="auth-container">
      <Link to="/" className="auth-logo-link">
        <img src={logoImage} alt="Logo StreamFlix" className="auth-logo-img" />
      </Link>

      <div className="form-box">
        <h1>Cadastre-se</h1>
        <form onSubmit={handleRegister}>
          <div className="input-group">
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              placeholder="E-mail" 
            />
          </div>
          <div className="input-group">
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Senha" 
            />
          </div>
          <button type="submit">Cadastrar</button>
        </form>

        {message && <p className="error-message">{message}</p>}
        <div className="form-links-container">
            <Link to="/">Já tem uma conta? Entrar agora.</Link>
        </div>
      </div>
    </div>
  );
}

export default Register;