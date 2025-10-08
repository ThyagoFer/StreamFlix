import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/LoginRegister.css';
import logoImage from '../assets/logo.png';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleRecovery = (e) => {
    e.preventDefault();
    if (!email) {
      setMessage('Por favor, digite seu email.');
      setIsSuccess(false);
      return;
    }

    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(user => user.email === email);

    if (user) {
      // Se encontrou o usuário, define a mensagem de sucesso
      setMessage(`Sua senha é: ${user.password}`);
      setIsSuccess(true);
    } else {
      // Se não encontrou, define a mensagem de erro
      setMessage('Email não encontrado em nosso sistema.');
      setIsSuccess(false);
    }
  };

  return (
    <div className="auth-container">
      <Link to="/" className="auth-logo-link">
        <img src={logoImage} alt="Logo StreamFlix" className="auth-logo-img" />
      </Link>
      <div className="form-box">
        <h1>Recuperar Senha</h1>
        <form onSubmit={handleRecovery}>
          <div className="input-group">
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Digite o email da sua conta" 
            />
          </div>
          <button type="submit" className="submit-btn">Recuperar</button>
        </form>
        
        {/* Este bloco agora exibe a mensagem (sucesso ou erro) abaixo do formulário */}
        {message && (
          <p className={isSuccess ? 'success-message' : 'error-message'}>
            {message}
          </p>
        )}

        <div className="form-links-container">
          <Link to="/">Voltar para o Login</Link>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;