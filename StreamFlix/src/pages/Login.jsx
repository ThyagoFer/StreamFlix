import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/LoginRegister.css';
import logoImage from '../assets/logo.png';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // Mensagens reativadas
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Por favor, preencha todos os campos.');
      return;
    }
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(user => user.email === email && user.password === password);
    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
      navigate('/home');
    } else {
      setError('Email ou senha inválidos.');
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
              id="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Insira o nome de usuário"
            />
          </div>
          <div className="input-group">
            <input 
              type="password" 
              id="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Favor digitar a senha"
            />
          </div>
          <button type="submit">Entrar</button>
        </form>
        {/* A linha abaixo irá mostrar o que está acontecendo */}
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