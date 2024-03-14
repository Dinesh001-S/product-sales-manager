const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3002;


const purchaseSchema = new mongoose.Schema({
  productName: String,
  price: Number,
  quantity: Number,
  date: Date,
});

const Purchase = mongoose.model('Purchase', purchaseSchema);

const billSchema = new mongoose.Schema({
  purchases: [purchaseSchema],
  total: Number,
});

const Bill = mongoose.model('Bill', billSchema);

app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb+srv://dinesh:pJPP7wn3X5SVMjCX@bill-data.2rwmc5n.mongodb.net/?retryWrites=true&w=majority&appName=bill-data', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.info('Connected to DB');
}).catch((e) => {
  console.error('Error connecting to DB:', e);
});

app.post('/bill', async (req, res) => {
  try {
    const { purchases, total } = req.body;

    const newBill = new Bill({
      purchases,
      total,
    });

    await newBill.save();

    res.status(200).json({ message: 'Data stored successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
const productSchema = new mongoose.Schema({
  productName: String,
  price: Number,
  type: String
});

// Create a model for the Product collection
const Product = mongoose.model('Product', productSchema);


// Endpoint to fetch existing products
app.get('/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json({ products });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Endpoint to add a new product
app.post('/products', async (req, res) => {
  try {
    const { productName, price,type } = req.body;
    const newProduct = new Product({ productName, price, type });
    await newProduct.save();
    res.json({ message: 'Product added successfully' });
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/', (req, res) => {
    res.send('Server is running. Use the appropriate API endpoints.');
  });
  
  //  Handle undefined routes with a wildcard route
   app.get('*', (req, res) => {
     res.status(404).send('404 - Not Found'); 
    });

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// const express = require('express');
// const mongoose = require('mongoose');
// const bodyParser = require('body-parser');
// const axios = require('axios');
// const cors = require('cors');

// const app = express();
// const PORT = process.env.PORT || 3002;

// app.use(cors());

// const productSchema = new mongoose.Schema({
//   productName: String,
//   price: Number,
//   quantity: Number,
//   date: Date,
// });

// const Product = mongoose.model('Product', productSchema);

// // Middleware
// app.use(bodyParser.json());

// // MongoDB connection
// mongoose.connect('mongodb+srv://dinesh:pJPP7wn3X5SVMjCX@bill-data.2rwmc5n.mongodb.net/?retryWrites=true&w=majority&appName=bill-data', { 
//   useNewUrlParser: true, 
//   useUnifiedTopology: true 
// }).then(() => {
//   console.info("Connected to DB");
// }).catch((e) => {
//   console.error("Error connecting to DB:", e);
// });

// // Define an endpoint to handle the "Bill" button click
// app.post('/bill', async (req, res) => {
//   try {
//     const { productList } = req.body;

//     // Assuming you want to store each product separately in MongoDB
//     const savePromises = productList.map(async (product) => {
//       const { productName, price, quantity, date } = product;
//       const newProduct = new Product({ productName, price, quantity, date });
//       await newProduct.save();
//     });

//     // Wait for all save operations to complete
//     await Promise.all(savePromises);
//     res.status(200).json({ message: 'Data stored successfully' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// });

// // Define a default route for the root URL
// app.get('/', (req, res) => {
//   res.send('Server is running. Use the appropriate API endpoints.');
// });

// // Handle undefined routes with a wildcard route
// app.get('*', (req, res) => {
//   res.status(404).send('404 - Not Found');
// });

// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });
