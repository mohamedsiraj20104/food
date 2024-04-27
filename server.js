const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const axios = require('axios');

const app = express();
const PORT =  3000; // Use the provided port or default to 3000

// Connect to MongoDB
const mongoURI = 'mongodb+srv://siraj:2FJ63FMlPnQHHpcT@cluster0.xxdhvm1.mongodb.net/LOGIN_DB?retryWrites=true&w=majority'; // Update with your MongoDB connection string

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1); // Exit the process if unable to connect to MongoDB
  });

// Define the user schema
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  location: String,
  mobile_number: String,
  veg_or_non_veg: String,
  cooked_time: String,
  address: String,
});

const User = mongoose.model('User', userSchema);

app.use(cors()); // Enable CORS
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.options('*', cors()); // Handle CORS preflight requests
app.use(express.static(path.join(__dirname, 'public')));

// Serve the index.html file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Handle form submission
app.post('/submitForm', async (req, res) => {
  const { name, email, location, mobile_number, veg_or_non_veg, cooked_time } = req.body;

  try {

    console.log(name, email, location, mobile_number, veg_or_non_veg, cooked_time , "req")
    // Split the location into latitude and longitude
    const [latitude, longitude] = location.split(',');
    console.log(latitude, longitude, "lati")

    // Call the geolocation API to get the address
    const geoResponse = await axios.get(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
    const address = geoResponse.data.display_name;

    console.log(address, "add)

    // Create a new user with the resolved address
    const user = new User({
      name, email, location, mobile_number, veg_or_non_veg, cooked_time, address
    });
    
    // Save the user to the database
    const result = await user.save();
    console.log('User saved with address:', result);
    res.json({ success: true });
  } catch (error) {
    console.error('Error saving user or fetching address:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
