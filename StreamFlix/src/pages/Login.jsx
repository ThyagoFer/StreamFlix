import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/LoginRegister.css';
import logoImage from '../assets/logo.png';
import { apiLogin } from '../service/api';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Por favor, preencha todos os campos.');
      return;
    }

    const result = await apiLogin(email, password);

    if (result.access) {
      localStorage.setItem('token', result.access);
      localStorage.setItem('currentUser', JSON.stringify({
        name: result.user?.name || email.split('@')[0],
        email: email
      }));
      navigate('/home');
    } else {
      setError(result.detail || 'Email ou senha inválidos.');
    }
  };

  return (
    <div className="auth-container">
      <Link to="/" className="auth-logo-link">
        <img src={logoImage} alt="Logo StreamFlix" className="auth-logo-img" />
      </Link>
      
      <div className="form-box">
        <h1>Entrar</h1>
        <form onSubmit={handleLogin}>
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
          <button type="submit">Entrar</button>
        </form>

        {error && <p className="error-message">{error}</p>}
        
        <div className="form-links-container">
          <span>Novo por aqui? <Link to="/register">Assine agora.</Link></span>
          <Link to="/forgot-password">Esqueceu a senha?</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;