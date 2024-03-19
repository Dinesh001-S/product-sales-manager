// Import necessary modules
import React, { useState } from 'react';
import axios from 'axios';
import './login.css'

// CSS styles
const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    // justifyContent: 'center',
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
  },
};

// Main Component
const Login = () => {
  // State variables for login and signup forms
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [signupData, setSignupData] = useState({ username: '', password: '', role: '', image: null });

  // Function to handle login form submission
  const handleLogin = async () => {
    try {
      // Make POST request to login endpoint
      const response = await axios.post('http://localhost:3002/login', loginData);
      console.log(response.data); // Logged in user data
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  // Function to handle signup form submission
  const handleSignup = async () => {
    try {
      const formData = new FormData();
      formData.append('username', signupData.username);
      formData.append('password', signupData.password);
      formData.append('role', signupData.role);
      formData.append('image', signupData.image);

      // Make POST request to signup endpoint
      const response = await axios.post('http://localhost:3002/signup', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log(response.data); // Newly created user data
    } catch (error) {
      console.error('Signup failed:', error);
    }
  };

  // JSX for login and signup forms
  return (
    <div style={styles.container} className='login-card'>
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
        {/* <button style={styles.button} onClick={handleSignup}>Signup</button> */}
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
        <input
          style={styles.input}
          type="text"
          placeholder="Role (casier, sales, manager, owner)"
          value={signupData.role}
          onChange={(e) => setSignupData({ ...signupData, role: e.target.value })}
        />
        <input
          style={styles.input}
          type="file"
          placeholder="Image"
          accept="image/*"
          onChange={(e) => setSignupData({ ...signupData, image: e.target.files[0] })}
        />
        <button style={styles.button} onClick={handleSignup}>Signup</button>
      </div>
    </div>
  );
};

export default Login;
