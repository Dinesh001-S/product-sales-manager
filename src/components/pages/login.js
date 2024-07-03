import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './login.css';
// import user from './images/download.png';

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
    backgroundColor: 'rgb(0 66 137)',
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
  const [loggedInUser, setLoggedInUser] = useState(null);

  useEffect(() => {
    const loggedInUserData = localStorage.getItem('loggedInUser');
    if (loggedInUserData) {
      setLoggedInUser(JSON.parse(loggedInUserData));
    }

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  const handleBeforeUnload = () => {
    localStorage.removeItem('loggedInUser');
  };

  const handleLogin = async () => {

    if(!loginData.username || !loginData.password){
      alert("Enter Your Username and Password");
      return;
    }
    try {
      const response = await axios.post('http://product-and-sales-manager-server.onrender.com/login', loginData);
      setLoggedInUser(response.data);
      localStorage.setItem('loggedInUser', JSON.stringify(response.data));
    } catch (error) {
      if(error.response && error.response.status === 401){
        alert("Unauthorized or wrong username and password.");
      }
      else console.error('Login failed:', error);
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
            {loggedInUser.image && <img src={`data:${loggedInUser.image};base64,${loggedInUser.data}`} alt={loggedInUser.username} style={styles.image} />}
            {console.log(loggedInUser.image)}
          </div>
          <div className='user-details'>
            <h2>Name: <p>{loggedInUser.username}</p></h2>
            <h2>Role: <p>{loggedInUser.role}</p></h2>
            <h2>Gender: <p>{loggedInUser.gender}</p></h2>
            <h2>Age: <p>{loggedInUser.age}</p></h2>
            <h2>Shift: <p>{loggedInUser.shift}</p></h2>
          </div>
          <div className='user-btn'>
            {(loggedInUser.role === 'Manager' || loggedInUser.role === 'Owner') && (
              <div className='btn'>
                <Link to='/signup' className='title'>
                  <button className='new-employee' style={styles.button}>New Employee</button>
                </Link>
                <Link to='/employees' className='title'>
                  <button className='employees' style={styles.button}>Employees</button>
                </Link>
              </div>
            )}
          </div>
          <button className='logout' style={styles.button} onClick={handleLogout}>Logout</button>
        </div>
      ) : (
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
      )}
    </div>
  );
};

export default Login;
