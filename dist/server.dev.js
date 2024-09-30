"use strict";

// Budget API
var express = require('express');

var cors = require('cors');

var app = express();
var port = 3000;
app.use(cors());
var budget = {
  myBudget: [{
    title: 'Eat out',
    budget: 25
  }, {
    title: 'Rent',
    budget: 275
  }, {
    title: 'Grocery',
    budget: 110
  }, {
    title: 'Transport',
    budget: 90
  }]
};
app.get('/budget', function (req, res) {
  res.json(budget);
});
app.listen(port, function () {
  console.log("API served at http://localhost:".concat(port));
});