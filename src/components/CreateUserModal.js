import React, { useState } from 'react';
import styles from '../styles/CreateUserModal.module.css';
import UserService from '../services/UserService'; // Asegúrate que la ruta es correcta

const CreateUserModal = ({ onClose, onUserCreated, token }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    type: 'regular', // default value
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'O nome é obrigatório.';
    if (!formData.email.trim()) {
      newErrors.email = 'O email é obrigatório.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'O formato do email é inválido.';
    }
    if (!formData.password) newErrors.password = 'A senha é obrigatória.';
    // 'type' has a default value, so it does not need validation here.

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
    // Clean the error of the specific field when user types
    if (errors[name]) {
        setErrors(prevErrors => ({
            ...prevErrors,
            [name]: null
        }));
    }
    setApiError(''); // Clean api error at changing data
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form behavior
    setApiError(''); // Clean previous API errors

    if (!validateForm()) {
      return; // Stops the submission if there are validation errors
    }

    setIsLoading(true);
    try {
        // expecting 'name', 'email', 'password', 'type'
        const newUser = await UserService.create(formData, token);
        setIsLoading(false);
        alert('Usuário criado com sucesso!'); 
        onUserCreated(); // refresh the list and close the modal
    } catch (error) {
        setIsLoading(false);
        console.error("Erro ao criar usuário:", error);
        setApiError(error.message || 'Falha ao criar usuário. Verifique os dados e tente novamente.');
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button onClick={onClose} className={styles.closeButton}>&times;</button>
        <h2>Criar Novo Usuário</h2>
        {apiError && <p className={styles.apiError}>{apiError}</p>}
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="name">Nome:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={errors.name ? styles.inputError : ''}
            />
            {errors.name && <p className={styles.errorText}>{errors.name}</p>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? styles.inputError : ''}
            />
            {errors.email && <p className={styles.errorText}>{errors.email}</p>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password">Senha:</label>
            <input
              type="text" 
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? styles.inputError : ''}
            />
            {errors.password && <p className={styles.errorText}>{errors.password}</p>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="type">Tipo:</label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
            >
              <option value="regular">Regular</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <button type="submit" className={styles.submitButton} disabled={isLoading}>
            {isLoading ? 'Criando...' : 'Criar'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateUserModal;