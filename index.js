const express = require('express');
const { resolve } = require('path');
const mongoose = require('mongoose');
const MenuItem = require('./models/menu');
require('dotenv').config();

const app = express();
const port = 3010;

app.use(express.json()); 
app.use(express.static('static'));

const dbURI = process.env.MONGO_URI;

mongoose.connect(dbURI)
  .then(() => console.log('Database connected successfully'))
  .catch(err => console.log('Error connecting to database:', err));

app.get('/', (req, res) => {
  res.sendFile(resolve(__dirname, 'pages/index.html'));
});

app.post('/menu', async (req, res) => {
  try {
    const { name, description, price } = req.body;

    if (!name || !price) {
      return res.status(400).json({ message: 'Validation error: Name and price are required' });
    }

    const menuItem = new MenuItem({ name, description, price });
    await menuItem.save();

    res.status(201).json({ message: 'Menu item created successfully', menuItem });
  } catch (error) {
    console.error('Error creating menu item:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/menu', async (req, res) => {
  try {
    const menuItems = await MenuItem.find();
    res.status(200).json(menuItems);
  } catch (error) {
    console.error('Error fetching menu items:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});