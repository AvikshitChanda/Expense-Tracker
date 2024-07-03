import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../navbar/Navbar';
import './Dashboard.css';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartLine, faClock, faWallet } from '@fortawesome/free-solid-svg-icons';
import api from '../../utils/api';
import { motion } from 'framer-motion'; 


ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = ({ token }) => {
  const chartRef = useRef(null);
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Expenses',
        data: [],
        fill: false,
        backgroundColor: 'rgba(244, 67, 54, 0.2)',
        borderColor: 'rgba(244, 67, 54, 1)',
        borderWidth: 1,
        pointBackgroundColor: 'rgba(244, 67, 54, 1)',
        pointBorderColor: '#fff',
        pointRadius: 5,
        pointHoverRadius: 7,
      },
      {
        label: 'Incomes',
        data: [],
        fill: false,
        backgroundColor: 'rgba(76, 175, 80, 0.2)',
        borderColor: 'rgba(76, 175, 80, 1)',
        borderWidth: 1,
        pointBackgroundColor: 'rgba(76, 175, 80, 1)',
        pointBorderColor: '#fff',
        pointRadius: 5,
        pointHoverRadius: 7,
      },
    ],
  });

  const [recentTransactions, setRecentTransactions] = useState([]);
  const [stats, setStats] = useState({ totalIncome: 0, totalExpense: 0 });

  useEffect(() => {
    if (token) {
      fetchChartData();
      fetchRecentTransactions();
      fetchTotalExpense();
      fetchTotalIncome(); 
    }

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [token]);

  const fetchChartData = async () => {
    try {
      const expensesResponse = await api.get('/transactions/get-expenses', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const incomesResponse = await api.get('/transactions/get-incomes', {
        headers: { Authorization: `Bearer ${token}` }
      });

      const expenses = processDataByDate(expensesResponse.data);
      const incomes = processDataByDate(incomesResponse.data);

      const labels = Array.from(new Set([...Object.keys(expenses), ...Object.keys(incomes)])).sort();

      setChartData(prevState => ({
        ...prevState,
        labels,
        datasets: [
          {
            ...prevState.datasets[0],
            data: labels.map(label => expenses[label] || 0),
          },
          {
            ...prevState.datasets[1],
            data: labels.map(label => incomes[label] || 0),
          },
        ],
      }));
    } catch (error) {
      console.error('Error fetching chart data:', error);
    }
  };

  const fetchRecentTransactions = async () => {
    try {
      const expensesResponse = await api.get('/transactions/get-expenses', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const incomesResponse = await api.get('/transactions/get-incomes', {
        headers: { Authorization: `Bearer ${token}` }
      });

      const allTransactions = [
        ...expensesResponse.data.map(transaction => ({ ...transaction, type: 'expense' })),
        ...incomesResponse.data.map(transaction => ({ ...transaction, type: 'income' })),
      ];

      allTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));

      setRecentTransactions(allTransactions.slice(0, 3));
    } catch (error) {
      console.error('Error fetching recent transactions:', error);
    }
  };

  const fetchTotalExpense = async () => {
    try {
      const response = await api.get('/transactions/total-expense', {
        headers: { Authorization: `Bearer ${token}` }
      });

      setStats(prevStats => ({
        ...prevStats,
        totalExpense: response.data.totalExpense
      }));
    } catch (error) {
      console.error('Error fetching total expense:', error);
    }
  };

  const fetchTotalIncome = async () => {
    try {
      const response = await api.get('/transactions/total-income', {
        headers: { Authorization: `Bearer ${token}` }
      });

      setStats(prevStats => ({
        ...prevStats,
        totalIncome: response.data.totalIncome
      }));
    } catch (error) {
      console.error('Error fetching total income:', error);
    }
  };

  const processDataByDate = (data) => {
    const processedData = {};

    data.forEach(item => {
      const date = new Date(item.date);
      const formattedDate = date.toISOString().split('T')[0];

      if (processedData[formattedDate]) {
        processedData[formattedDate] += item.amount;
      } else {
        processedData[formattedDate] = item.amount;
      }
    });

    return processedData;
  };

  const calculateBalance = () => {
    return stats.totalIncome - stats.totalExpense;
  };

  const getBalanceColor = () => {
    const balance = calculateBalance();
    if (balance > 1000) {
      return 'green';
    } else {
      return 'red';
    }
  };

  const formattedBalance = () => {
    const balance = calculateBalance();
    return Math.max(0, balance).toFixed(2); 
  };

  return (
    <>
      <Navbar />
      <motion.div className="dashboard-container" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <div className="dashboard">
          <motion.div className="left" initial={{ x: -100 }} animate={{ x: 0 }} transition={{ duration: 0.5 }}>
            <div className="transactionChart">
              <p className="catchy-heading">Track Your Financial Journey!</p>
              <Line
                ref={chartRef}
                data={chartData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: 'top',
                    },
                    title: {
                      display: true,
                      text: 'Income and Expenses Over Time',
                    },
                  },
                  scales: {
                    x: {
                      title: {
                        display: true,
                        text: 'Date',
                      },
                      type: 'category',
                      labels: chartData.labels,
                    },
                    y: {
                      title: {
                        display: true,
                        text: 'Amount',
                      },
                    },
                  },
                }}
              />
            </div>
          </motion.div>
          <motion.div className="right" initial={{ x: 100 }} animate={{ x: 0 }} transition={{ duration: 0.5 }}>
            <div className="recent">
              <FontAwesomeIcon icon={faClock} className="icon" />
              <h2>Recent Transactions</h2>
              <ul>
                {recentTransactions.map((transaction, index) => (
                  <motion.li key={index} className={transaction.type} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: index * 0.1 }}>
                    <span className="transaction-title">{transaction.title}</span>
                    <span className="transaction-amount">
                      {transaction.type === 'income' ? '+' : '-'}
                      ₹{transaction.amount.toFixed(2)}
                    </span>
                  </motion.li>
                ))}
              </ul>
            </div>
            <div className="stats">
              <FontAwesomeIcon icon={faWallet} className="icon" />
              <h2>Statistics</h2>
              <div className='total-income'>Total Income: ₹{stats.totalIncome.toFixed(2)}</div>
              <div className='total-expense'>Total Expense: ₹{stats.totalExpense.toFixed(2)}</div>
              <motion.div className='balance' style={{ color: getBalanceColor() }} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 20 }}>
                Balance: ₹{formattedBalance()}
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </>
  );
};

export default Dashboard;
