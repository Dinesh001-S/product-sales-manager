import React, { useState, useEffect } from 'react';
import './bills.css';
import axios from 'axios';

const Bill = () => {
  const [productName, setProductName] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]); // Current date
  const [purchaseList, setPurchaseList] = useState([]);
  const [productSuggestions, setProductSuggestions] = useState([]);

  useEffect(() => {
    fetchProductSuggestions();
  }, []);

  const fetchProductSuggestions = async () => {
    try {
      const response = await axios.get('https://product-and-sales-manager-server.onrender.com/products/suggestions');
      setProductSuggestions(response.data.productNames);
    } catch (error) {
      console.error('Error fetching product suggestions:', error);
    }
  };

  const fetchProductPrice = async (productName) => {
    try {
      const response = await axios.get(`https://product-and-sales-manager-server.onrender.com/products/price?productName=${productName}`);
      setPrice(response.data.price);
    } catch (error) {
      console.error('Error fetching product price:', error);
    }
  };

  const calculateTotal = () => {
    return purchaseList.reduce((total, purchase) => total + parseFloat(purchase.price) * parseFloat(purchase.quantity), 0).toFixed(2);
  };

  const handleBillClick = async () => {
    try {
      const total = calculateTotal();
      await axios.post('https://product-and-sales-manager-server.onrender.com/bill', {
        purchases: purchaseList,
        total,
      });
      setPurchaseList([]);
    } catch (error) {
      console.error('Error storing data:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!productName || !price || !quantity || !date) {
      alert('Please fill in all fields');
      return;
    }

    const newPurchase = {
      productName,
      price,
      quantity,
      date,
    };

    setPurchaseList([...purchaseList, newPurchase]);

    setProductName('');
    setPrice('');
    setQuantity('');
    setDate(new Date().toISOString().split('T')[0]);
  };

  return (
    <div className='container'>
      <div className='box'>
        <form onSubmit={handleSubmit}>
          <label>
            Product Name:
          </label>
          <input
            type="text"
            value={productName}
            onChange={(e) => { setProductName(e.target.value); fetchProductPrice(e.target.value); }}
            list="productSuggestions"
          />
          <datalist id="productSuggestions">
            {productSuggestions.map((productName, index) => (
              <option key={index} value={productName} />
            ))}
          </datalist>
          <br />
          <label>
            Price:
          </label>
          <input type="text" value={price} onChange={(e) => setPrice(e.target.value)} readOnly />
          <br />
          <label>
            Quantity:
          </label>
          <input type="text" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
          <br />
          <label>
            Date:
          </label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          <br />
          <button type="submit">Add Product</button>
        </form>

        <table>
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {purchaseList.map((purchase, index) => (
              <tr key={index}>
                <td>{purchase.productName}</td>
                <td>{purchase.price}</td>
                <td>{purchase.quantity}</td>
                <td>{purchase.date}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="4" style={{ textAlign: 'right' }}>
                Total: ₹{calculateTotal()}
              </td>
            </tr>
            <tr>
              <td colSpan="4" style={{ textAlign: 'center' }}>
                <button className="bill" onClick={handleBillClick}>Bill</button>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default Bill;
