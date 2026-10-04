require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/authRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const savingsGoalRoutes = require('./routes/savingsGoalRoutes');
const budgetRoutes = require('./routes/budgetRoutes');
const statRoutes = require('./routes/statRoutes');
const balanceRoutes = require('./routes/balanceRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use(
  '/uploads',
  express.static(
    path.join(
      __dirname,
      '../uploads'
    )
  )
);

app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/savings-goals', savingsGoalRoutes);
app.use('/api/budgets', budgetRoutes);
app.use('/api/stats', statRoutes);
app.use('/api/balance', balanceRoutes);
app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
  res.json({
    message: 'Expense Manager Backend API is running!',
  });
});

app.listen(PORT, () => {
  console.log(
    `Server đang chạy tại http://localhost:${PORT}`
  );
});