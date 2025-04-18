import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import UserService from '../services/UserService';
import styles from '../styles/Users.module.css';
import CreateUserModal from '../components/CreateUserModal';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [token, setToken] = useState(localStorage.getItem('token'));

  const fetchUsersAndRole = useCallback(async () => {
    setLoading(true);
    setError('');
    const currentToken = localStorage.getItem('token');
    if (!currentToken) {
      navigate('/signin');
      return;
    }
    setToken(currentToken);

    try {
      const userData = await UserService.list(currentToken);
      setUsers(userData);

      const loggedInUserEmail = localStorage.getItem('userEmail');
      const loggedInUser = userData.find(user => user.email === loggedInUserEmail);
      setUserRole(loggedInUser?.type || 'regular');
    } catch (err) {
        console.error("Fetch Users Error:", err);
        if (err.message.includes('401') || err.message.includes('Unauthorized')) {
            setError('Your session has expired. Please log in again.');
            // Clears the storage also in case of a 401 error during loading
            localStorage.removeItem('token');
            localStorage.removeItem('userEmail');
            navigate('/signin');
        } else {
            setError(err.message || 'Failed to load users.');
        }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchUsersAndRole();
  }, [fetchUsersAndRole]);

  const handleDelete = async (id) => {
    if (window.confirm(`Are you sure you want to delete the user with ID ${id}?`)) {
        const currentToken = localStorage.getItem('token');
        if (!currentToken) {
          navigate('/signin');
          return;
        }
        try {
          await UserService.delete(id, currentToken);
          setUsers(users.filter(user => user.id !== id));
        } catch (err) {
          if (id == '1') {
            setError(err.message || `O Usuário com ID 1 não pode ser deletado`)
            setTimeout(() => {
                setError('');
            }, 3000)
        } else {
            setError(err.message || `Failed to delete user with ID ${id}`);        
        }
        }
      }
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleUserCreated = () => {
    handleCloseModal();
    fetchUsersAndRole();
  };

  // Logout function
  const handleLogout = () => {
    // Delete token and email from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    // Redirect to the signin page
    navigate('/signin');
  };

  if (loading && users.length === 0) {
    return <p className={styles.loading}>Loading users...</p>;
  }

  // If the error was a 401, the component will have already redirected in fetchUsersAndRole.
  // If it's another error, we show the error but allow to exit.

  return (
    <div className={styles.container}>
      <div className={styles.headerContainer}>
        <h2 className={styles.heading}>Lista de Usuários</h2>
        <div className={styles.headerActions}>
           {userRole === 'admin' && (
            <button onClick={handleOpenModal} className={styles.createButton}>
              Criar Usuário
            </button>
          )}
          {/* Logout button always visible on this page */}
          <button onClick={handleLogout} className={styles.logoutButton}>
            Sair
          </button>
        </div>
      </div>

      {/* Shows the error if it exists (could be a delete error, etc.) */}
      {error && <p className={styles.error}>{error}</p>}

      {/* The table is only rendered if there was no initial critical error */}
      {!error || !error.includes('Your session has expired') ? ( // Avoid rendering table if the error is a session error
        <table className={styles.table}>
          <thead> 
            <tr>
              <th className={styles.th}>ID</th>
              <th className={styles.th}>Name</th>
              {userRole === 'admin' && <th className={styles.th}>Email</th>}
              {userRole === 'admin' && <th className={styles.th}>Type</th>}
              <th className={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td className={styles.td}>{user.id}</td>
                <td className={styles.td}>{user.name}</td>
                {userRole === 'admin' && <td className={styles.td}>{user.email}</td>}
                {userRole === 'admin' && <td className={styles.td}>{user.type}</td>}
                <td className={`${styles.td} ${styles.actions}`}>
                  {userRole === 'admin' && (
                    <Link to={`/users/${user.id}`} className={styles.editButton}>Editar</Link>
                  )}
                {userRole === 'admin' && (
                    <button onClick={() => handleDelete(user.id)} className={styles.deleteButton}>Deletar</button>
                 )}
                {userRole !== 'admin' && (
                    <p className={styles.infoMessage}>Somente os admins podem editar e deletar usuários.</p>
                )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : null}

      {/* Conditional rendering of the modal */}
      {isModalOpen && (
        <CreateUserModal
          onClose={handleCloseModal}
          onUserCreated={handleUserCreated}
          token={token}
        />
      )}
    </div>
  );
};

export default Users;