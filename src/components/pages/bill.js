import React, { useState, useEffect } from 'react';
import './bills.css';
import axios from 'axios';

const Bill = () => {
 const [productName, setProductName] = useState('');
 const [price, setPrice] = useState('');
 const [quantity, setQuantity] = useState('');
 const [date, setDate] = useState(new Date().toISOString().split('T')[0]); // Current date
 const [purchaseList, setPurchaseList] = useState([]);
 const [productSuggestions, setProductSuggestions] = useState([]); // State to store product name suggestions

 useEffect(() => {
  // Fetch product name suggestions when the component mounts
  fetchProductSuggestions();
 }, []);

 const fetchProductSuggestions = async () => {
  try {
   const response = await axios.get('http://localhost:3002/products/suggestions');
   setProductSuggestions(response.data.productNames);
  } catch (error) {
   console.error('Error fetching product suggestions:', error);
  }
 };

 const calculateTotal = () => {
  return purchaseList.reduce((total, purchase) => total + parseFloat(purchase.price) * parseFloat(purchase.quantity), 0).toFixed(2);
 };

 const handleBillClick = async () => {
  try {
   const total = calculateTotal();

   // Send a request to the server endpoint to store data in MongoDB
   await axios.post('http://localhost:3002/bill', {
    purchases: purchaseList,
    total,
   });
   // Clear the purchase list
   setPurchaseList([]);
  } catch (error) {
   console.error('Error storing data:', error);
  }
 };

 const handleSubmit = (e) => {
  e.preventDefault();

  // Validate input fields
  if (!productName || !price || !quantity || !date) {
   alert('Please fill in all fields');
   return;
  }

  // Create a new purchase object
  const newPurchase = {
   productName,
   price,
   quantity,
   date,
  };

  // Update the purchase list
  setPurchaseList([...purchaseList, newPurchase]);

  // Clear form fields
  setProductName('');
  setPrice('');
  setQuantity('');
  setDate(new Date().toISOString().split('T')[0]); // Reset date to current date
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
      onChange={(e) => setProductName(e.target.value)}
      list="productSuggestions" // Define a datalist for product suggestions
     />
     <datalist id="productSuggestions">
      {/* Map over productSuggestions to show suggestions */}
      {productSuggestions.map((productName, index) => (
       <option key={index} value={productName} />
      ))}
     </datalist>
     <br />
     <label>
      Price:
     </label>
     <input type="text" value={price} onChange={(e) => setPrice(e.target.value)} />
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
