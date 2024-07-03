const express = require('express');
const { addIncome, getIncomes, deleteIncome,getTotalIncome } = require('../controllers/incomeController');
const { addExpense, getExpenses, deleteExpense, getTotalExpense } = require('../controllers/expenseController');
const authMiddleware = require('../middlewares/auth');

const router = express.Router();

// Income routes
router.post('/add-income', authMiddleware, addIncome);
router.get('/get-incomes', authMiddleware, getIncomes);
router.delete('/delete-income/:id', authMiddleware, deleteIncome);

// Expense routes
router.post('/add-expense', authMiddleware, addExpense);
router.get('/get-expenses', authMiddleware, getExpenses);
router.delete('/delete-expense/:id', authMiddleware, deleteExpense);

// New route for fetching total stats
router.get('/total-expense', authMiddleware,getTotalExpense );
router.get('/total-income', authMiddleware,getTotalIncome );

module.exports = router;
