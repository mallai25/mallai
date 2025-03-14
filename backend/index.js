const express = require('express');
const cors = require('cors');
require('dotenv').config()
const uploadRoute = require('./controller/routeUpload');

const app = express();
const PORT = 5000;

// Configure CORS
app.use(cors());

app.use(express.json());
app.use("/api/users", uploadRoute);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});