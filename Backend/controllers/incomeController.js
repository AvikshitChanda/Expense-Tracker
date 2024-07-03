const Income = require("../models/income");
const mongoose = require('mongoose');

const addIncome = async (req, res) => {
  const { title, amount, date, description, category } = req.body;
  const userId = req.user.id; 
  console.log(userId)
 
  if (!title || !category || !description || !date) {
    return res.status(400).json({ message: 'Fill the necessary details!' });
  }

  if (typeof amount !== 'number' || amount <= 0) {
    return res.status(400).json({ message: 'Amount should be a positive number' });
  }

  const income = new Income({
    title,
    amount,
    date,
    description,
    category,
    userId 
  });

  try {
    await income.save();
    res.status(200).json({ message: 'Successfully added!', income });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};


const getIncomes = async (req, res) => {
  const userId = req.user.id; 
 

  try {
    const incomes = await Income.find({ userId }).sort({ date: 'desc' });
    res.status(200).json(incomes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};


const deleteIncome = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const deletedIncome = await Income.findOneAndDelete({ _id: id, userId });
    if (!deletedIncome) {
      return res.status(404).json({ message: 'Income not found' });
    }
    res.status(200).json({ message: 'Income deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};
const getTotalIncome = async (req, res) => {
  const userId = req.user.id;

  try {

    const totalIncomeResult = await Income.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      { $group: { _id: null, totalIncome: { $sum: "$amount" } } }
    ]);

 
    const totalIncome = totalIncomeResult.length > 0 ? totalIncomeResult[0].totalIncome : 0;

    res.status(200).json({ totalIncome });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  addIncome,
  getIncomes,
  deleteIncome,
  getTotalIncome
};
