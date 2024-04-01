const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

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
  type: String,
  units: Number,
  date: Date,
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
    const currentDate = new Date().toISOString().split('T')[0]; // Get the current date and time
    const newProduct = new Product({ productName, price, type,units, date: new Date(currentDate)}); 
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
  age: { type: String },
  gender: { type: String },
  date: { type: Date, default: Date.now },
  shift: { type: String },
  image: { data: Buffer, contentType: String }, // Modified to store image in the database
});

const User = mongoose.model('User', userSchema);
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Middleware and routes remain the same

app.post('/signup', upload.single('image'), async (req, res) => {
  try {
    if (!req.body.username || !req.body.password || !req.body.role) {
      return res.status(400).json({ error: 'Missing required fields: username, password, and role' });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const newUser = new User({
      username: req.body.username.trim(),
      password: hashedPassword,
      role: req.body.role.trim(),
      age: req.body.age,
      gender: req.body.gender,
      date: req.body.date, // Save the date from the request body
      shift: req.body.shift,
      image: {
        data: fs.readFileSync(req.file.path),
        contentType: 'image/png', // Adjust content type based on file type
      }
    });

    const savedUser = await newUser.save();
    if (!savedUser) {
      return res.status(500).json({ error: 'Failed to create user' });
    }

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Signup error:', error);
    if (error.name === 'MongoError' && error.code === 11000) {
      res.status(400).json({ error: 'Username already exists' });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
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
    app.use('/uploads', express.static('uploads'));
    res.status(200).json({
      username: user.username,
      role: user.role,
      image: user.image ? `../uploads/${user.image}` : null,
      gender: user.gender, 
      age: user.age,
      date: user.date,
      shift:user.shift,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json({ users });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Serve static files from uploads folder

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
