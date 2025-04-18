// // src/pages/UserEdit.js
// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import UserService from '../services/UserService';
// import styles from '../styles/UserEdit.module.css';

// export const userLoader = async ({ params }) => {
//   const { userId } = params;
//   const token = localStorage.getItem('token');
//   if (!token) {
//     return null; // Or redirect to sign-in
//   }
//   try {
//     const user = await UserService.get(userId, token);
//     return user;
//   } catch (error) {
//     console.error('Error loading user:', error);
//     return null; // Or handle error appropriately
//   }
// };

// const UserEdit = () => {
//   const { userId } = useParams();
//   const navigate = useNavigate();
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     const fetchUser = async () => {
//       setLoading(true);
//       setError('');
//       try {
//         const token = localStorage.getItem('token');
//         if (!token) {
//           navigate('/signin');
//           return;
//         }
//         const userData = await UserService.get(userId, token);
//         setUser(userData);
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUser();
//   }, [userId, navigate]);

//   const handleChange = (event) => {
//     const { name, value } = event.target;
//     setUser(prevUser => ({
//       ...prevUser,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     setError('');
//     try {
//       const token = localStorage.getItem('token');
//       if (!token) {
//         navigate('/signin');
//         return;
//       }
//       await UserService.update(userId, user, token);
//       navigate('/users');
//     } catch (err) {
//       setError(err.message);
//     }
//   };

//   if (loading) {
//     return <p>Carregando dados do usuário...</p>;
//   }

//   if (error) {
//     return <p className={styles.error}>Erro ao carregar dados do usuário: {error}</p>;
//   }

//   if (!user) {
//     return <p>Usuário não encontrado.</p>;
//   }

//   return (
//     <div className={styles.container}>
//       <h2 className={styles.heading}>Editar Usuário</h2>
//       {error && <p className={styles.error}>{error}</p>}
//       <form onSubmit={handleSubmit} className={styles.form}>
//         <div>
//           <label htmlFor="name" className={styles.label}>Nome:</label>
//           <input
//             type="text"
//             id="name"
//             name="name"
//             value={user.name || ''}
//             onChange={handleChange}
//             className={styles.input}
//           />
//         </div>
//         <div>
//           <label htmlFor="email" className={styles.label}>Email:</label>
//           <input
//             type="email"
//             id="email"
//             name="email"
//             value={user.email || ''}
//             onChange={handleChange}
//             className={styles.input}
//           />
//         </div>
//         <div className={styles.buttonContainer}>
//           <button type="submit" className={styles.saveButton}>Salvar Alterações</button>
//           <button type="button" onClick={() => navigate('/users')} className={styles.cancelButton}>Cancelar</button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default UserEdit;

// src/pages/UserEdit.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import UserService from '../services/UserService';
import styles from '../styles/UserEdit.module.css'; // Assuming you have relevant styles

// userLoader remains the same as it focuses on fetching initial data
export const userLoader = async ({ params }) => {
  const { userId } = params;
  const token = localStorage.getItem('token');
  if (!token) {
    // Consider redirecting to sign-in from the loader as well
    // For example: return redirect('/signin'); (requires importing redirect from react-router-dom)
    console.warn('No token found, authentication required.');
    return null;
  }
  try {
    // Ensure the UserService.get fetches all necessary fields, including 'type'
    const user = await UserService.get(userId, token);
    return user;
  } catch (error) {
    console.error('Error loading user:', error);
    // Handle error appropriately, maybe return an error object or status
    return null;
  }
};

const UserEdit = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  // Use fetched data to initialize user state
  // 'userData' comes from the loader or useEffect fetch
  const [user, setUser] = useState(null); // Will hold name, email, type
  const [newPassword, setNewPassword] = useState(''); // Separate state for password change
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      setError('');
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/signin'); // Redirect if no token
          return;
        }
        // Fetch user data including 'type'
        const userData = await UserService.get(userId, token);
        if (userData) {
          // Ensure the 'type' field exists, provide default if necessary
          setUser({
            name: userData.name || '',
            email: userData.email || '',
            type: userData.type || 'regular', // Default to 'regular' if type is missing
          });
        } else {
           throw new Error('Usuário não encontrado ou falha ao carregar.');
        }
      } catch (err) {
        console.error("Fetch user error:", err);
        setError(err.message || 'Erro ao carregar dados do usuário.');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId, navigate]); // Dependency array

  // Handles changes for name, email, and type
  const handleChange = (event) => {
    const { name, value } = event.target;
    setUser(prevUser => ({
      ...prevUser,
      [name]: value,
    }));
     setError(''); // Clear error on change
  };

  // Handles changes specifically for the new password field
  const handlePasswordChange = (event) => {
    setNewPassword(event.target.value);
     setError(''); // Clear error on change
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    // Basic validation (can be enhanced)
    if (!user.name || !user.email) {
        setError('Nome e Email são obrigatórios.');
        return;
    }
     if (user.email && !/\S+@\S+\.\S+/.test(user.email)) {
        setError('O formato do email é inválido.');
        return;
    }


    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/signin');
        return;
      }

      // Prepare data payload for update
      const updateData = {
        name: user.name,
        email: user.email,
        type: user.type,
      };

      // Only include password in the payload if it's being changed
      if (newPassword) {
        // Add password validation if needed (e.g., minimum length)
        // if (newPassword.length < 6) {
        //     setError('A nova senha deve ter pelo menos 6 caracteres.');
        //     return;
        // }
        updateData.password = newPassword;
      }

      console.log("Sending update data:", updateData); // For debugging

      // Call the update service
      await UserService.update(userId, updateData, token);
      alert('Usuário atualizado com sucesso!'); // Provide feedback
      navigate('/users'); // Navigate back to the user list or profile page

    } catch (err) {
      console.error("Update user error:", err);
      // Display specific API error if available, otherwise generic message
      setError(err.response?.data?.message || err.message || 'Falha ao atualizar usuário.');
    }
  };

  // Render Loading state
  if (loading) {
    return <p>Carregando dados do usuário...</p>;
  }

  // Render Error state (after loading attempt)
  if (error && !user) { // Show primary error if user data couldn't be loaded at all
     return <p className={styles.error}>Erro ao carregar dados: {error}</p>;
  }

  // Render Not Found state (if API confirms user doesn't exist)
  if (!user) {
      // This case might be handled by the error state depending on API response
    return <p>Usuário não encontrado.</p>;
  }

  // Render the form
  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Editar Usuário</h2>
      {/* Display non-blocking errors (e.g., validation, update failure) */}
      {error && <p className={styles.error}>{error}</p>}
      <form onSubmit={handleSubmit} className={styles.form}>
        {/* Name Field */}
        <div className={styles.formGroup}> {/* Use formGroup for consistency */}
          <label htmlFor="name" className={styles.label}>Nome:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={user.name} // Controlled component
            onChange={handleChange}
            className={styles.input}
            required // HTML5 validation
          />
        </div>

        {/* Email Field */}
        <div className={styles.formGroup}>
          <label htmlFor="email" className={styles.label}>Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={user.email} // Controlled component
            onChange={handleChange}
            className={styles.input}
            required // HTML5 validation
          />
        </div>

        {/* Password Field (Optional Change) */}
        <div className={styles.formGroup}>
          <label htmlFor="password" className={styles.label}>Nova Senha:</label>
          <input
            type="password" // Use type="password"
            id="password"
            name="password"
            value={newPassword} // Controlled component using separate state
            onChange={handlePasswordChange}
            className={styles.input}
            placeholder="Deixe em branco para manter a senha atual" // Inform user
            autoComplete="new-password" // Help password managers
          />
           {/* Optional: Add password confirmation field */}
        </div>

        {/* Type Field */}
        <div className={styles.formGroup}>
          <label htmlFor="type" className={styles.label}>Tipo:</label>
          <select
            id="type"
            name="type"
            value={user.type} // Controlled component
            onChange={handleChange}
            className={styles.input} // Use same style as input or a specific select style
          >
            <option value="regular">Regular</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        {/* Action Buttons */}
        <div className={styles.buttonContainer}>
          <button type="submit" className={styles.saveButton}>Salvar Alterações</button>
          <button type="button" onClick={() => navigate('/users')} className={styles.cancelButton}>Cancelar</button>
        </div>
      </form>
    </div>
  );
};

export default UserEdit;