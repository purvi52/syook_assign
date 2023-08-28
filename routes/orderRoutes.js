const express = require('express');
const router = express.Router();
const Order = require('../models/order');
const DeliveryVehicle = require('../models/deliveryvehicle');
const Customer = require('../models/customer');
const Item=require('../models/item')

// Create an order and assign a delivery vehicle
router.post('/', async (req, res) => {
  const { itemId, customerId } = req.body;

  try {
    // get customer city
    const customer=await Customer.findById(customerId);
    if(!customer)
    {
        return res.status(404).json({message:"customer not found"});
    }
    const customerCity=customer.city;

    //finding suitable delivery vehicle 
    const deliveryVehicle = await DeliveryVehicle.findOne({ city: customerCity, activeOrdersCount: { $lt: 2 }, vehicleType:"truck" });
    if (!deliveryVehicle) {
      return res.status(400).json({ message: 'No suitable delivery vehicle available' });
    }

    const item= await Item.findById(itemId);
    if(!item)
    {
        return res.status(404).json({message:"Item not found"});
    }
    const itemPrice=item.price;

    const newItem = new Order({
      itemId,
      customerId,
      deliveryVehicleId: deliveryVehicle._id,
      price: itemPrice, // Calculate the price based on item
    });

    deliveryVehicle.activeOrdersCount++; // Increment the active orders count
    await Promise.all([newItem.save(), deliveryVehicle.save()]);

    res.status(201).json(newItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


router.put(':orderId/delivered',
async(req,res)=>{
    try{
        const order=await Order.findById(req.params.orderId);
        if(!order)
        {
            return res.status(404).json({message:'order not found'});
        }

        if(order.isDelivered)
        {
            return res.status(400).json({message:"order is already delivered."});
        }

        const deliveryVehicle=await DeliveryVehicle.findById(order.deliveryVehicleId);
        if(!deliveryVehicle)
        {
            return res.status(404).json({message:"Delivery vehicle not found"});
        }
        order.isDelivered=true;

        if(deliveryVehicle.activeOrdersCount>0)
        {
        deliveryVehicle.activeOrdersCount--; 
        }
        await Promise.all([order.save(), deliveryVehicle.save()]);
    
        res.json({message: 'order marked as delivered'});
        } catch (err) {
        res.status(400).json({ message: err.message });
        }
    })

module.exports = router;