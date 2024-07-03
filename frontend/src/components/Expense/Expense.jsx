import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaTrash } from 'react-icons/fa';
import './Expense.css';
import api from '../../utils/api';
import Navbar from '../navbar/Navbar';
import { motion } from 'framer-motion'; // Import motion from Framer Motion

const Expense = ({ token }) => {
  const [expenses, setExpenses] = useState([]);
  const [totalExpense, setTotalExpense] = useState(0);

  useEffect(() => {
    if (token) {
      fetchExpenses();
    } else {
      // Reset expenses and totalExpense if token is null (user logged out)
      setExpenses([]);
      setTotalExpense(0);
    }
  }, [token]);

  const fetchExpenses = () => {
    api.get('/transactions/get-expenses', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(response => {
      console.log('Fetched expenses:', response.data); // Check the response data
      setExpenses(response.data);
      const total = response.data.reduce((sum, expense) => sum + expense.amount, 0);
      setTotalExpense(total);
    })
    .catch(error => {
      console.error("Error fetching expenses:", error);
      toast.error('Failed to fetch expenses.');
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newExpense = {
      title: e.target.title.value,
      amount: parseFloat(e.target.amount.value),
      date: e.target.date.value,
      description: e.target.description.value,
      category: e.target.category.value
    };
    console.log('New Expense:', newExpense); 
    api.post('/transactions/add-expense', newExpense, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(response => {
      console.log('Expense added:', response.data); // Log the added expense data
      setExpenses([response.data.expense, ...expenses]);
      setTotalExpense(totalExpense + parseFloat(e.target.amount.value));
      toast.success('Expense added successfully!');
      e.target.reset();
    })
    .catch(error => {
      console.error("Error adding expense:", error);
      toast.error('Failed to add expense.');
    });
  };

  const handleDelete = (id) => {
    api.delete(`/transactions/delete-expense/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(response => {
      setExpenses(expenses.filter(expense => expense._id !== id));
      const deletedExpense = expenses.find(expense => expense._id === id);
      if (deletedExpense) {
        setTotalExpense(totalExpense - deletedExpense.amount);
      }
      toast.success('Expense deleted successfully!');
    })
    .catch(error => {
      console.error("Error deleting expense:", error);
      toast.error('Failed to delete expense.');
    });
  };

  return (
    <>
      <ToastContainer />
      <Navbar />
      <motion.div className="expenseContainer" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        {/* Form for adding expense */}
        <motion.div className="addExpense" initial={{ x: -100 }} animate={{ x: 0 }} transition={{ duration: 0.5 }}>
          <form onSubmit={handleSubmit}>
            <input type="text" name="title" placeholder='Expense Title' required />
            <input type="number" name="amount" placeholder='Expense Amount' required />
            <input type="date" name="date" placeholder='Select Date' required />
            <textarea name="description" placeholder='Description' className="fixedTextArea" required />
            <select name="category" required>
              <option value="">Select Category</option>
              <option value="Food">Food</option>
              <option value="Transport">Transport</option>
              <option value="Utilities">Utilities</option>
              <option value="Other">Other</option>
            </select>
            <button type="submit">Add Expense</button>
          </form>
        </motion.div>

        {/* Display section for expenses */}
        <motion.div className="expenseStats" initial={{ x: 100 }} animate={{ x: 0 }} transition={{ duration: 0.5 }}>
          <div className="expenseDisplay">
            <h2>Total Expense: ₹ {totalExpense}</h2>
          </div>
          <div className="currentHistory">
            {expenses.length > 0 ? (
              expenses.map((expense, index) => (
                <motion.div className="expenseItem" key={index} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: index * 0.1 }}>
                  <div className="details">
                    <div>
                      <h4>{expense.title}</h4>
                      <p>{expense.description}</p>
                    </div>
                  </div>
                  <div className="actions">
                    <p className='amountExpense'> - ₹{expense.amount}</p>
                    <p>{expense.date ? expense.date.split('T')[0] : 'N/A'}</p>
                    <button className="deleteButton" onClick={() => handleDelete(expense._id)}>
                      <FaTrash />
                    </button>
                  </div>
                </motion.div>
              ))
            ) : (
              <p>Add expense</p>
            )}
          </div>
        </motion.div>
      </motion.div>
    </>
  );
};

export default Expense;
