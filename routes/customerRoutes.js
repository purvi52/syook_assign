const express = require('express');
const router = express.Router();
const Customer = require('../models/customer');

router.get('/', async (req, res) => {
    try {
      const customers = await Customer.find();
      res.json(customers);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  
  // Adding new customer
  router.post('/', async (req, res) => {
    const newCustomer = new Customer({
      name: req.body.name,
      city: req.body.item,
    });
  
    try {
      const savedItem = await newCustomer.save();
      res.status(201).json(savedItem);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });

  module.exports=router;
  