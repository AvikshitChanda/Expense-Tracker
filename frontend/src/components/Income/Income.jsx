import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaTrash } from 'react-icons/fa';
import './Income.css';
import api from '../../utils/api';
import Navbar from '../navbar/Navbar';
import { motion } from 'framer-motion'; // Import motion from Framer Motion

const Income = ({ token }) => {
  const [incomes, setIncomes] = useState([]);
  const [totalIncome, setTotalIncome] = useState(0);

  useEffect(() => {
    if (token) {
      fetchIncomes();
    } else {
      // Reset incomes and totalIncome if token is null (user logged out)
      setIncomes([]);
      setTotalIncome(0);
    }
  }, [token]);

  const fetchIncomes = () => {
    api.get('/transactions/get-incomes', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(response => {
      setIncomes(response.data);
      const total = response.data.reduce((sum, income) => sum + income.amount, 0);
      setTotalIncome(total);
    })
    .catch(error => {
      console.error("Error fetching incomes:", error);
      toast.error('Failed to fetch incomes.');
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newIncome = {
      title: e.target.title.value,
      amount: parseFloat(e.target.amount.value),
      date: e.target.date.value,
      description: e.target.description.value,
      category: e.target.category.value
    };
    console.log('New Income:', newIncome); 
    api.post('/transactions/add-income', newIncome, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(response => {
      console.log('Income added:', response.data); // Log the added income data
      setIncomes([response.data.income, ...incomes]);
      setTotalIncome(totalIncome + parseFloat(e.target.amount.value));
      toast.success('Income added successfully!');
      e.target.reset();
    })
    .catch(error => {
      console.error("Error adding income:", error);
      toast.error('Failed to add income.');
    });
  };

  const handleDelete = (id) => {
    api.delete(`/transactions/delete-income/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(response => {
      setIncomes(incomes.filter(income => income._id !== id));
      const deletedIncome = incomes.find(income => income._id === id);
      if (deletedIncome) {
        setTotalIncome(totalIncome - deletedIncome.amount);
      }
      toast.success('Income deleted successfully!');
    })
    .catch(error => {
      console.error("Error deleting income:", error);
      toast.error('Failed to delete income.');
    });
  };

  return (
    <>
      <ToastContainer />
      <Navbar />
      <motion.div className="incomeContainer" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        {/* Form for adding income */}
        <motion.div className="addIncome" initial={{ x: -100 }} animate={{ x: 0 }} transition={{ duration: 0.5 }}>
          <form onSubmit={handleSubmit}>
            <input type="text" name="title" placeholder='Income Title' required />
            <input type="number" name="amount" placeholder='Income Amount' required />
            <input type="date" name="date" placeholder='Select Date' required />
            <textarea name="description" placeholder='Description' className="fixedTextArea" required />
            <select name="category" required>
              <option value="">Select Category</option>
              <option value="Salary">Salary</option>
              <option value="Gift">Gift</option>
              <option value="Investment">Investment</option>
              <option value="Other">Other</option>
            </select>
            <button type="submit">Add Income</button>
          </form>
        </motion.div>

        {/* Display section for incomes */}
        <motion.div className="incomeStats" initial={{ x: 100 }} animate={{ x: 0 }} transition={{ duration: 0.5 }}>
          <div className="incomeDisplay">
            <h2>Total Income: ₹ {totalIncome}</h2>
          </div>
          <div className="currentHistory">
            {incomes.length > 0 ? incomes.map((income, index) => (
              <motion.div className="incomeItem" key={index} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: index * 0.1 }}>
                <div className="details">
                  <div>
                    <h4>{income.title}</h4>
                    <p>{income.description}</p>
                  </div>
                </div>
                <div className="actions">
                  <p className='amountIncome'> + ₹{income.amount}</p>
                  <p>{income.date ? income.date.split('T')[0] : 'N/A'}</p>
                  <button className="deleteButton" onClick={() => handleDelete(income._id)}>
                    <FaTrash />
                  </button>
                </div>
              </motion.div>
            )) : <p>Add income</p>}
          </div>
        </motion.div>
      </motion.div>
    </>
  );
};

export default Income;
