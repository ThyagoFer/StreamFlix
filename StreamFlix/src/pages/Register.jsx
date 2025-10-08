import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/LoginRegister.css';
import logoImage from '../assets/logo.png';

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState(''); // Mensagens reativadas
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setMessage('Por favor, preencha todos os campos.');
      return;
    }
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const userExists = users.find(user => user.email === email);
    if (userExists) {
      setMessage('Este email já está cadastrado.');
      return;
    }
    const newUser = { email, password };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    setMessage('Cadastro realizado com sucesso! Redirecionando...');
    setTimeout(() => {
      navigate('/');
    }, 2000);
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
              id="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Digite seu melhor email" 
            />
          </div>
          <div className="input-group">
            <input 
              type="password" 
              id="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Crie uma senha forte" 
            />
          </div>
          <button type="submit">Cadastrar</button>
        </form>
        {/* A linha abaixo irá mostrar o que está acontecendo */}
        {message && <p className="error-message">{message}</p>}
        <div className="form-links-container">
            <Link to="/">Já tem uma conta? Entrar agora.</Link>
        </div>
      </div>
    </div>
  );
}

export default Register;