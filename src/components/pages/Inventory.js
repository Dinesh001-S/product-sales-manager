import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './inventory.css';

const ProductList = () => {
  const [productName, setProductName] = useState('');
  const [price, setPrice] = useState('');
  const [type, setType] = useState('');
  const [units, setUnits] = useState('');
  const [products, setProducts] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [editedUnitId, setEditedUnitId] = useState(null); // State to track which unit is being edited
  const [editedValues, setEditedValues] = useState({}); // State to track edited values for each product

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('https://product-and-sales-manager-server.onrender.com/products');
        setProducts(response.data.products);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day < 10 ? '0' + day : day}-${month < 10 ? '0' + month : month}-${year}`;
  };

  const addProduct = async () => {
    if (!productName || !price || !type || !units) {
      alert('Please fill in all fields');
      return;
    }

    try {
      await axios.post('https://product-and-sales-manager-server.onrender.com/products', {
        productName,
        price,
        type,
        units
      });

      const response = await axios.get('https://product-and-sales-manager-server.onrender.com/products');
      setProducts(response.data.products);

      setProductName('');
      setPrice('');
      setType('');
      setUnits('');
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  const editProduct = async (productId, updatedProduct) => {
    try {
      await axios.put(`https://product-and-sales-manager-server.onrender.com/products/${productId}`, updatedProduct);

      const updatedProducts = products.map(product => {
        if (product._id === productId) {
          return { ...product, ...updatedProduct };
        }
        return product;
      });
      setProducts(updatedProducts);
      setEditedValues(prevState => ({
        ...prevState,
        [productId]: null
      }));
      setEditedUnitId(null);
    } catch (error) {
      console.error('Error editing product:', error);
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

  const handleEdit = async (productId, fieldName, value) => {
    // Calculate new unit value by adding the old value and the edited value
    const oldUnits = parseInt(products.find(product => product._id === productId).units);
    const newUnits = parseInt(value) + oldUnits;
    const updatedProduct = { [fieldName]: newUnits };
    await editProduct(productId, updatedProduct);
  };

  const handleEditButtonClicked = (productId) => {
    setEditedUnitId(productId);
  };

  const handleEnterKeyPress = (e, productId) => {
    if (e.key === 'Enter') {
      handleEdit(productId, 'units', editedValues[productId]);
    }
  };

  const handleInputChange = (e, productId) => {
    const { value } = e.target;
    setEditedValues(prevState => ({
      ...prevState,
      [productId]: value
    }));
  };

  return (
    <div>
      <br />
      <br />
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
          <input
            type="number"
            value={units}
            onChange={(e) => setUnits(e.target.value)}
          />
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
            <th onClick={() => requestSort('units')} className={getClassNamesFor('units')}>Units</th>
            <th>New Stocks</th>
          </tr>
        </thead>
        <tbody>
          {sortedProducts.map(product => (
            <tr key={product._id}>
              <td>{product.productName}</td>
              <td>{product.price}</td>
              <td>{product.type}</td>
              <td>{formatDate(product.date)}</td>
              <td>
                {editedUnitId === product._id ?
                  <input
                    type="number"
                    value={editedValues[product._id] !== null ? editedValues[product._id] : product.units}
                    onChange={(e) => handleInputChange(e, product._id)}
                    onBlur={() => handleEdit(product._id, 'units', editedValues[product._id])}
                    onKeyPress={(e) => handleEnterKeyPress(e, product._id)}
                  />
                  :
                  product.units
                }
              </td>
              <td>
                <button onClick={() => handleEditButtonClicked(product._id)}>Update</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductList;
