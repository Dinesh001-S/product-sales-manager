import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './inventry.css'

const ProductList = () => {
  const [productName, setProductName] = useState('');
  const [price, setPrice] = useState('');
  const [type, setType] = useState('')
  const [products, setProducts] = useState([]);

  // Fetch existing products from MongoDB Atlas on component mount
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

    if (!productName || !price || !type) {
      alert('Please fill in all fields');
      return;
    }

    try {
      // Send a request to the server endpoint to add a new product to MongoDB Atlas
      await axios.post('http://localhost:3002/products', {
        productName,
        price,
        type
      });

      // Fetch the updated list of products after adding a new one
      const response = await axios.get('http://localhost:3002/products');
      setProducts(response.data.products);

      // Clear the form fields
      setProductName('');
      setPrice('');
      setType('')
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  return (
    <div>
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
  <button type="button" onClick={addProduct}>Add Product</button>
</form>


      <h2>Product List</h2>
      {/* <ul>
        {products.map((product, index) => (
          <li key={index}>{product.productName} - ₹{product.price}</li>
        ))}
      </ul> */}
      <table className='inventry-table'>
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Price</th>
              <th>Type</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <tr key={index}>
                <td>{product.productName}</td>
                <td>{product.price}</td>
                <td>{product.type}</td>
              </tr>
            ))}
          </tbody>
        </table>
    </div>
  );
};

export default ProductList;