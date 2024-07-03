const Expense = require("../models/expense");
const mongoose = require('mongoose'); // Ensure mongoose is imported

// Controller to add a new expense
const addExpense = async (req, res) => {
  const { title, amount, date, description, category } = req.body;
  const userId = req.user.id; // Extracted from authenticated token

  // Validation checks
  if (!title || !category || !description || !date) {
    return res.status(400).json({ message: 'Fill the necessary details!' });
  }

  if (typeof amount !== 'number' || amount <= 0) {
    return res.status(400).json({ message: 'Amount should be a positive number' });
  }

  const expense = new Expense({
    title,
    amount,
    date,
    description,
    category,
    userId // Associate expense with the authenticated user
  });

  try {
    await expense.save();
    res.status(200).json({ message: 'Expense successfully added!', expense });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Controller to get expenses of the authenticated user
const getExpenses = async (req, res) => {
  const userId = req.user.id; // Extracted from authenticated token

  try {
    const expenses = await Expense.find({ userId }).sort({ date: 'desc' });
    res.status(200).json(expenses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Controller to delete expense of the authenticated user by expense ID
const deleteExpense = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id; // Extracted from authenticated token

  try {
    const deletedExpense = await Expense.findOneAndDelete({ _id: id, userId });
    if (!deletedExpense) {
      return res.status(404).json({ message: 'Expense not found' });
    }
    res.status(200).json({ message: 'Expense deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};
const getTotalExpense = async (req, res) => {
  const userId = req.user.id; // Extracted from authenticated token
  console.log('userId:', userId);

  try {
    // Calculate total expense
    const totalExpenseResult = await Expense.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      { $group: { _id: null, totalExpense: { $sum: "$amount" } } }
    ]);
    console.log('totalExpenseResult:', totalExpenseResult);

    // Extract total expense from result
    const totalExpense = totalExpenseResult.length > 0 ? totalExpenseResult[0].totalExpense : 0;
    console.log('totalExpense:', totalExpense);

    res.status(200).json({ totalExpense });
  } catch (error) {
    console.error('Error in getTotalExpense:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
module.exports = {
  addExpense,
  getExpenses,
  deleteExpense,
  getTotalExpense
};
