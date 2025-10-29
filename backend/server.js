require('dotenv').config();

const express = require('express');
const cors = require('cors');

const userRoutes = require('./routes/users');
const candidateRoutes = require('./routes/candidates');
const profileRoutes = require('./routes/profile');

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

app.use('/api/users', userRoutes);

app.use('/api/candidates', candidateRoutes);

app.use('/api/profile', profileRoutes);

app.listen(port, () => {
  console.log(`Servidor backend corriendo en http://localhost:${port}`);
});