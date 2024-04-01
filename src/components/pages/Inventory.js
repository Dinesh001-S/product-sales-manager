import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './inventory.css';

const ProductList = () => {
  const [productName, setProductName] = useState('');
  const [price, setPrice] = useState('');
  const [type, setType] = useState('');
  const [units, setUnits] = useState(''); // New state for units
  const [products, setProducts] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day < 10 ? '0' + day : day}-${month < 10 ? '0' + month : month}-${year}`;
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:3002/products');
        setProducts(response.data.products);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  const addProduct = async () => {
    if (!productName || !price || !type || !units) {
      alert('Please fill in all fields');
      return;
    }

    try {
      await axios.post('http://localhost:3002/products', {
        productName,
        price,
        type,
        units
      });

      const response = await axios.get('http://localhost:3002/products');
      setProducts(response.data.products);

      setProductName('');
      setPrice('');
      setType('');
      setUnits(0);
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getClassNamesFor = (name) => {
    if (!sortConfig) {
      return;
    }
    return sortConfig.key === name ? sortConfig.direction : undefined;
  };

  const sortedProducts = [...products].sort((a, b) => {
    if (sortConfig.direction === 'ascending') {
      return a[sortConfig.key] > b[sortConfig.key] ? 1 : -1;
    } else {
      return a[sortConfig.key] < b[sortConfig.key] ? 1 : -1;
    }
  });

  return (
    <div>
    <br/>
    <br/>
      <h2>Add Product</h2>
      <form className='inventry-form'>
        <label>
          <h4>Product Name</h4>
          <input type="text" value={productName} onChange={(e) => setProductName(e.target.value)} />
        </label>
        <br />
        <label>
          <h4>Price</h4>
          <input type="text" value={price} onChange={(e) => setPrice(e.target.value)} />
        </label>
        <br />
        <label>
          <h4>Type</h4>
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option></option>
            <option value="Grocery">Grocery</option>
            <option value="Stationary">Stationary</option>
            <option value="Toys">Toys</option>
            <option value="Electronic">Electronic</option>
          </select>
        </label>
        <br />
        <label>
          <h4>Units</h4>
          <input type="number" value={units} onChange={(e) => setUnits(e.target.value)} />
        </label>
        <br />
        <button type="button" onClick={addProduct}>Add Product</button>
      </form>

      <h2>Product List</h2>
      <table className='inventry-table'>
        <thead>
          <tr>
          <th onClick={() => requestSort('productName')} className={getClassNamesFor('productName')}>Product Name</th>
          <th onClick={() => requestSort('price')} className={getClassNamesFor('price')}>Price</th>
          <th onClick={() => requestSort('type')} className={getClassNamesFor('type')}>Type</th>
          <th onClick={() => requestSort('date')} className={getClassNamesFor('date')}>Date</th>
          <th onClick={() => requestSort('units')} className={getClassNamesFor('units')}>Units</th> {/* Header for Units */}
          <th>Edit</th> {/* Header for Edit */}
        </tr>
      </thead>
      <tbody>
        {sortedProducts.map((product, index) => (
          <tr key={index}>
            <td>{product.productName}</td>
            <td>{product.price}</td>
            <td>{product.type}</td>
            <td>{formatDate(product.date)}</td>
            <td>{product.units}</td> {/* Display Units */}
            <td><button>Edit</button></td> {/* Edit Button */}
          </tr>
       ))}
      </tbody>
    </table>

    </div>
  );
};

export default ProductList;
