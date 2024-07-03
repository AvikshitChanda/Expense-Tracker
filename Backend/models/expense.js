const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50
    },
    amount: {
        type: Number,
        required: true,
        trim: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    description: {
        type: String,
        trim: true
    },
    category: {
        type: String,
        enum: ['Food', 'Transport', 'Rent', 'Utilities', 'Entertainment', 'Healthcare', 'Other'],
        default: 'Other'
    }
}, { timestamps: true });

module.exports = mongoose.model("Expense", ExpenseSchema);
