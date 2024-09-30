// Budget API

const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

// Enable CORS for all routes
app.use(cors());

// Sample budget data
const budget = {
    myBudget: [
        {
            title: 'Eat out',
            budget: 25
        },
        {
            title: 'Rent',
            budget: 275
        },
        {
            title: 'Grocery',
            budget: 110
        },
        {
            title: 'Transport',
            budget: 90
        },
    ]
};

// Define the /budget endpoint to return the budget data
app.get('/budget', (req, res) => {
    res.json(budget);
});

// Start the server
app.listen(port, () => {
    console.log(`API served at http://localhost:${port}`);
});
