const express = require('express');
const router = express.Router();
const DeliveryVehicle = require('../models/deliveryvehicle');

// Get all items
router.get('/', async (req, res) => {
    try {
      const vehicles = await DeliveryVehicle.find();
      res.json(vehicles);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  
  // Create a new item
  router.post('/', async (req, res) => {
    const newDeliveryVehicle = new DeliveryVehicle({
      registrationNumber: req.body.registrationNumber,
      vehicleType: req.body.vehicleType,
      city:req.body.city,
    });
  
    try {
      const savedItem = await newDeliveryVehicle.save();
      res.status(201).json(savedItem);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });
  
  //update api for items
  router.put('/:id', async (req, res) => {
      const {  vehicleType,city } = req.body;
      try {
          const updatedDeliveryVehicle = await DeliveryVehicle.findByIdAndUpdate(
              req.params.id,
              { vehicleType, city},
              { new: true } 
          );
      
          if (!updatedDeliveryVehicle) 
          {
              return res.status(404).json({ message: 'Item not found' });
          }
      
          res.json(updatedDeliveryVehicle);
      } 
      catch (err) 
      {
        res.status(400).json({ message: err.message });
      }
    });
  
  
  
  module.exports = router;