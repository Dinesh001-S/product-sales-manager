import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Employees = () => {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:3002/users');
      setEmployees(response.data.users);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3002/users/${id}`);
      setEmployees(prevEmployees => prevEmployees.filter(employee => employee._id !== id));
    } catch (error) {
      console.error('Error deleting employee:', error);
    }
  };

  return (
    <div>
    <br/><br/>
      <h1>Employees</h1>
      <table>
        <thead>
          <tr>
            <th>Username</th>
            <th>Role</th>
            <th>Gender</th>
            <th>Age</th>
            <th>Shift</th>
            <th>Joining Date</th> {/* New column for joining date */}
            <th>Action</th> {/* New column for delete button */}
          </tr>
        </thead>
        <tbody>
          {employees.map(employee => (
            <tr key={employee._id}>
              <td>{employee.username}</td>
              <td>{employee.role}</td>
              <td>{employee.gender}</td>
              <td>{employee.age}</td>
              <td>{employee.shift}</td>
              <td>{new Date(employee.date).toLocaleDateString()}</td> {/* Display joining date */}
              <td>
                <button onClick={() => handleDelete(employee._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Employees;
