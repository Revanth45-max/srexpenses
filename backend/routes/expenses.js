const express = require('express');
const router = express.Router();
const fs = require('fs');

const dataPath = './data/expenses.json';

// Read expenses
router.get('/', (req, res) => {
    fs.readFile(dataPath, 'utf8', (err, data) => {
        if (err) return res.status(500).json({ message: 'Error reading data' });
        res.json(JSON.parse(data));
    });
});

// Add expense
router.post('/', (req, res) => {
    const newExpense = req.body;
    fs.readFile(dataPath, 'utf8', (err, data) => {
        if (err) return res.status(500).json({ message: 'Error reading data' });
        const expenses = JSON.parse(data);
        newExpense.id = expenses.length ? expenses[expenses.length - 1].id + 1 : 1;
        expenses.push(newExpense);
        fs.writeFile(dataPath, JSON.stringify(expenses, null, 2), (err) => {
            if (err) return res.status(500).json({ message: 'Error writing data' });
            res.json(newExpense);
        });
    });
});

// Delete expense
router.delete('/:id', (req, res) => {
    const id = parseInt(req.params.id);
    fs.readFile(dataPath, 'utf8', (err, data) => {
        if (err) return res.status(500).json({ message: 'Error reading data' });
        let expenses = JSON.parse(data);
        expenses = expenses.filter(exp => exp.id !== id);
        fs.writeFile(dataPath, JSON.stringify(expenses, null, 2), (err) => {
            if (err) return res.status(500).json({ message: 'Error writing data' });
            res.json({ message: 'Expense deleted' });
        });
    });
});

module.exports = router; // ✅ Export router only
