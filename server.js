const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors'); // Added CORS middleware
const path = require('path');

const app = express();
const PORT = 3000;

// Connect to MongoDB
const mongoURI = 'mongodb+srv://siraj:2FJ63FMlPnQHHpcT@cluster0.xxdhvm1.mongodb.net/LOGIN_DB?retryWrites=true&w=majority';

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });

  const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    location: String,
    mobile_number: String,
    veg_or_non_veg: String,
    cooked_time: String,
  });

const User = mongoose.model('User', userSchema);

app.use(cors()); // Enable CORS

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.options('*', cors()); // Handle CORS preflight requests

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/submitForm', async (req, res) => {
    const { name, email, location, mobile_number, veg_or_non_veg, cooked_time } = req.body;
  
    const user = new User({ 
      name,
      email,
      location,
      mobile_number,
      veg_or_non_veg,
      cooked_time,
    });

  try {
    const result = await user.save();
    console.log('User saved:', result);

    res.json({ success: true });
  } catch (error) {
    console.error('Error saving user:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
