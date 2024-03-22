import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './login.css';

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
  },
  input: {
    marginBottom: '10px',
    padding: '8px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    width: '300px',
  },
  button: {
    padding: '10px 20px',
    borderRadius: '4px',
    border: 'none',
    backgroundColor: '#007bff',
    color: '#fff',
    cursor: 'pointer',
    marginRight: '10px',
  },
  image: {
    maxWidth: '100px', // Adjust as needed
  },
};

const Login = () => {
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [signupData, setSignupData] = useState({ username: '', password: '', role: '', image: null });
  const [loggedInUser, setLoggedInUser] = useState(null);

  useEffect(() => {
    const loggedInUserData = localStorage.getItem('loggedInUser');
    if (loggedInUserData) {
      setLoggedInUser(JSON.parse(loggedInUserData));
    }

    // Clear localStorage on page unload
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  const handleBeforeUnload = () => {
    localStorage.removeItem('loggedInUser');
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:3002/login', loginData);
      setLoggedInUser(response.data);
      localStorage.setItem('loggedInUser', JSON.stringify(response.data));
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleSignup = async () => {
    try {
      const formData = new FormData();
      formData.append('username', signupData.username);
      formData.append('password', signupData.password);
      formData.append('role', signupData.role);
      formData.append('image', signupData.image);

      const response = await axios.post('http://localhost:3002/signup', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setLoggedInUser(response.data);
      localStorage.setItem('loggedInUser', JSON.stringify(response.data));
    } catch (error) {
      console.error('Signup failed:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('loggedInUser');
    setLoggedInUser(null);
  };

  return (
    <div style={styles.container} className={`login-card ${loggedInUser ? 'hidden' : ''}`}>
      {loggedInUser ? (
        <div className="user-details-card">
          <div className='user-img'>
            {loggedInUser.image && <img src={loggedInUser.image} alt="User" style={styles.image} />}
          </div>
          <div className='user-details'>
            <h2>Name : {loggedInUser.username}</h2>
            <h2>Role : {loggedInUser.role}</h2>
          </div>
          <button className='logout' style={styles.button} onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <>
          <div className='login'>
            <h2>Login</h2>
            <input
              style={styles.input}
              type="text"
              placeholder="Username"
              value={loginData.username}
              onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
            />
            <input
              style={styles.input}
              type="password"
              placeholder="Password"
              value={loginData.password}
              onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
            />
            <button style={styles.button} onClick={handleLogin}>Login</button>
          </div>
          <div className='signup'>
            <h2>Signup</h2>
            <input
              style={styles.input}
              type="text"
              placeholder="Username"
              value={signupData.username}
              onChange={(e) => setSignupData({ ...signupData, username: e.target.value })}
            />
            <input
              style={styles.input}
              type="password"
              placeholder="Password"
              value={signupData.password}
              onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
            />
            <select placeholder="Role" style={styles.input} value={signupData.role} onChange={(e) => setSignupData({ ...signupData, role: e.target.value })}>
              <option></option>
              <option value="Cashier">Cashier</option>
              <option value="Product Manager">Product Manager</option>
              <option value="Manager">Manager</option>
              <option value="Owner">Owner</option>
            </select>
            <input
              style={styles.input}
              type="file"
              placeholder="Image"
              accept="image/*"
              onChange={(e) => setSignupData({ ...signupData, image: e.target.files[0] })}
            />
            <button style={styles.button} onClick={handleSignup}>Signup</button>
          </div>
        </>
      )}
    </div>
  );
};

export default Login;
