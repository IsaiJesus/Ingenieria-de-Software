require('dotenv').config();

const express = require('express');
const cors = require('cors');

const userRoutes = require('./routes/users');
const candidateRoutes = require('./routes/candidates');
const profileRoutes = require('./routes/profile');
const vacanciesRoutes = require('./routes/vacancies');
const applicationsRoutes = require('./routes/applications');
const interviewsRoutes = require('./routes/interviews')
const employeesRoutes = require('./routes/employees')

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

app.use('/api/users', userRoutes);

app.use('/api/candidates', candidateRoutes);

app.use('/api/profile', profileRoutes);

app.use('/api/vacancies', vacanciesRoutes);

app.use('/api/applications', applicationsRoutes);

app.use('/api/interviews', interviewsRoutes);

app.use('/api/employees', employeesRoutes);

app.listen(port, () => {
  console.log(`Servidor backend corriendo en http://localhost:${port}`);
});