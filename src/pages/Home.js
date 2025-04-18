import React from 'react';
import { useNavigate } from 'react-router-dom'; 
import styles from '../styles/Home.module.css';

const Home = () => {
  // Hook to programmatically navigate
  const navigate = useNavigate();

  // Handler for the Enter button click
  const handleEnterClick = () => {
    const token = localStorage.getItem('token'); // Check for auth token
    if (token) {
      navigate('/users'); // Go to users page if token exists
    } else {
      navigate('/signin'); // Go to signin page if no token
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Sistema de Gestão de Usuários</h1>

      <button
        onClick={handleEnterClick}
        className={styles.enterButton} 
      >
        Entrar
      </button>
    </div>
  );
};

export default Home;