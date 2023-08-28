const express = require('express');
const router = express.Router();
const Item = require('../models/item');

// Get all items
router.get('/', async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new item
router.post('/', async (req, res) => {
  const newItem = new Item({
    name: req.body.name,
    price: req.body.price,
  });

  try {
    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

//update api for items
router.put('/:id', async (req, res) => {
    const { name, price } = req.body;
    try {
        const updatedItem = await Item.findByIdAndUpdate(
            req.params.id,
            { name, price },
            { new: true } 
        );
    
        if (!updatedItem) 
        {
            return res.status(404).json({ message: 'Item not found' });
        }
    
        res.json(updatedItem);
    } 
    catch (err) 
    {
      res.status(400).json({ message: err.message });
    }
  });



module.exports = router;