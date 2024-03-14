import React, { useState, useEffect } from 'react';
import './bills.css';
import axios from 'axios';

const Bill = () => {
  const [productName, setProductName] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [date, setDate] = useState('');
  const [purchaseList, setPurchaseList] = useState([]);

  useEffect(() => {
    // Fetch and update purchaseList from the server if needed
    // For example, if you have an API endpoint to get previous purchases.
  }, []); // Run this effect only once on component mount

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
      // Handle error, show alert, etc.
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
    setDate('');
  };

  return (
    <div className='container'>
      <div className='box'>
        <form onSubmit={handleSubmit}>
          <label>
            Product Name:
          </label>
          <input type="text" value={productName} onChange={(e) => setProductName(e.target.value)} />
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

// import React, { useState  } from 'react';
// import './bills.css';
// import axios from 'axios';

// const Bill = () => {
//   const [productName, setProductName] = useState('');
//   const [price, setPrice] = useState('');
//   const [quantity, setQuantity] = useState('');
//   const [date, setDate] = useState('');
//   const [productList, setProductList] = useState([]);

//   const calculateTotal = () => {
//     return productList.reduce((total, product) => total + (parseFloat(product.price)*parseFloat(product.quantity)), 0).toFixed(2);
//   };

//   const handleBillClick = async () => {
//     try {
//       // Send a request to the server endpoint to store data in MongoDB
//       await axios.post('http://localhost:3002/bill', {
//         productList,
//       });
//       // Clear the product list
//       setProductList([]);
//     } catch (error) {
//       console.error('Error storing data:', error);
//       // Handle error, show alert, etc.
//     }
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     // Validate input fields
//     if (!productName || !price || !quantity || !date) {
//       alert('Please fill in all fields');
//       return;
//     }

//     // Create a new product object
//     const newProduct = {
//       productName,
//       price,
//       quantity,
//       date,
//     };

//     // Update the product list
//     setProductList([...productList, newProduct]);

//     // Clear form fields
//     setProductName('');
//     setPrice('');
//     setQuantity('');
//     setDate('');
//   };

//   return (
//     <div className='container'>
//       <div className='box'>
//         <form onSubmit={handleSubmit}>
//           <label>
//             Product Name:
//           </label>
//           <input type="text" value={productName} onChange={(e) => setProductName(e.target.value)} />
//           <br />
//           <label>
//             Price:
//           </label>
//           <input type="text" value={price} onChange={(e) => setPrice(e.target.value)} />
//           <br />
//           <label>
//             Quantity:
//           </label>
//           <input type="text" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
//           <br />
//           <label>
//             Date:
//           </label>
//           <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
//           <br />
//           <button type="submit">Add Product</button>
//         </form>

//         <table>
//           <thead>
//             <tr>
//               <th>Product Name</th>
//               <th>Price</th>
//               <th>Quantity</th>
//               <th>Date</th>
//             </tr>
//           </thead>
//           <tbody>
//             {productList.map((product, index) => (
//               <tr key={index}>
//                 <td>{product.productName}</td>
//                 <td>{product.price}</td>
//                 <td>{product.quantity}</td>
//                 <td>{product.date}</td>
//               </tr>
//             ))}
//           </tbody>
//           <tfoot>
//             <tr>
//               <td colSpan="4" style={{ textAlign: 'right' }}>
//                 Total: ₹{calculateTotal()}
//               </td>
//             </tr>
//             <tr>
//               <td colSpan="4" style={{ textAlign: 'center' }}>
//                 <button className="bill"  onClick={handleBillClick}>Bill</button>
//               </td>
//             </tr>
//           </tfoot>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default Bill;