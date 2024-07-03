const mongoose=require('mongoose');

const IncomeSchema = new mongoose.Schema({
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
        maxLength: 20,
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
        enum: ['Salary', 'Gift', 'Investment', 'Other'],
        default: 'Other'
    }
}, { timestamps: true });



module.exports=mongoose.model("Income",IncomeSchema);