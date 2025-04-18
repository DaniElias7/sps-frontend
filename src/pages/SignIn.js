// src/pages/SignIn.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserService from '../services/UserService';
import styles from '../styles/SignIn.module.css';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    try {
      const data = await UserService.login({ email, password });
      localStorage.setItem('token', data.token);
      localStorage.setItem('userEmail', email); // Example: Storing email for role check
      navigate('/users');
    } catch (err) {
      // Check if the error message from the backend indicates invalid credentials
  
      if (err === 'Falha ao fazer login' || err === 'Unauthorized' || err.includes('incorrect')) {
        console.log(err)
        setError('Invalid credentials. Please try again.');
      } else {
        setError(err); // Display other potential errors
      }
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Entrar</h2>
      {error && <p className={styles.error}>{error}</p>}
      <form onSubmit={handleSubmit} className={styles.form}>
        <div>
          <label htmlFor="email" className={styles.label}>Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={styles.input}
          />
        </div>
        <div>
          <label htmlFor="password" className={styles.label}>Senha:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className={styles.input}
          />
        </div>
        <button type="submit" className={styles.button}>Entrar</button>
      </form>
    </div>
  );
};

export default SignIn;