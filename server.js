require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Import routes
const authRoutes = require('./auth/authRoutes');
const passwordRoutes = require('./password/passwordRoutes');
const productRoutes = require('./product/productRoutes');
const slideRoutes = require('./slides/slideRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/password', passwordRoutes);
app.use('/product', productRoutes);
app.use('/slides', slideRoutes);

app.use("/uploads", express.static("uploads"));


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
