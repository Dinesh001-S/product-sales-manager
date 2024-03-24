import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './signup.css'

const Signup = () => {
  const [signupData, setSignupData] = useState({ 
    username: '', 
    password: '', 
    role: '', 
    image: null,
    age: '', // New field for age
    gender: '', // New field for gender
    shift: '', // New field for shift
  });
  const navigate = useNavigate();

  const styles = {
    // Styles remain the same
  };

  const handleSignup = async () => {
    try {
      // Check if any required field is empty
      if (!signupData.username || !signupData.password || !signupData.role || !signupData.age || !signupData.gender || !signupData.shift || !signupData.image) {
        alert("Please fill in all the fields");
        return;
      }

      const formData = new FormData();
      formData.append('username', signupData.username);
      formData.append('password', signupData.password);
      formData.append('role', signupData.role);
      formData.append('image', signupData.image);
      formData.append('age', signupData.age); // Append age
      formData.append('gender', signupData.gender); // Append gender
      formData.append('shift', signupData.shift); // Append shift

      // Send the formData to your backend server
      await axios.post('http://localhost:3002/signup', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      // Once the data is successfully inserted into the database, you can navigate to another page
      navigate('/');
    } catch (error) {
      console.error('Signup failed:', error);
    }
  };

  return (
    <div>
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
        <select
          placeholder="Role"
          style={styles.input}
          value={signupData.role}
          onChange={(e) => setSignupData({ ...signupData, role: e.target.value })}
        >
          <option value="">Select Role</option>
          <option value="Cashier">Cashier</option>
          <option value="Product Manager">Product Manager</option>
          <option value="Manager">Manager</option>
          <option value="Owner">Owner</option>
        </select>
        <input
          style={styles.input}
          type="text"
          placeholder="Age"
          value={signupData.age}
          onChange={(e) => setSignupData({ ...signupData, age: e.target.value })}
        />
        <select
          style={styles.input}
          value={signupData.gender}
          onChange={(e) => setSignupData({ ...signupData, gender: e.target.value })}
        >
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
        <select
          style={styles.input}
          value={signupData.shift}
          onChange={(e) => setSignupData({ ...signupData, shift: e.target.value })}
        >
          <option value="">Select Shift</option>
          <option value="day">Day</option>
          <option value="night">Night</option>
        </select>
        <input
          style={styles.input}
          type="file"
          accept="image/*"
          onChange={(e) => setSignupData({ ...signupData, image: e.target.files[0] })}
        />
        <button style={styles.button} onClick={handleSignup}>Signup</button>
      </div>
    </div>
  );
};

export default Signup;
