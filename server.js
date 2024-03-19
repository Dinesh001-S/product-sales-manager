const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');

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

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true },
  image: { type: String },
});

const User = mongoose.model('User', userSchema);

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Set up multer for handling file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Routes
app.post('/signup', upload.single('image'), async (req, res) => {
  try {
    const { username, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      username,
      password: hashedPassword,
      role,
      image: req.file.filename,
    });
    await user.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }
    // Here you can generate JWT token for authentication
    // For simplicity, returning user data without password
    res.status(200).json({
      username: user.username,
      role: user.role,
      image: user.image,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Serve static files from uploads folder
app.use('/uploads', express.static('uploads'));

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
