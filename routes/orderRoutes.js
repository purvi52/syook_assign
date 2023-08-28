const express = require('express');
const router = express.Router();
const Order = require('../models/order');
const DeliveryVehicle = require('../models/deliveryvehicle');
const Customer = require('../models/customer');
const Item=require('../models/item')

// Create an order and assign a delivery vehicle
router.post('/', async (req, res) => {
  const { itemId, customerName,customerCity,vehicleRegistraionNumber } = req.body;

  try {
    // get customer city
    const customer=await Customer.findOne({name: customerName});
    if(!customer)
    {
        customer= new Customer({
            name: customerName,
            city: customerCity,
        })
        await customer.save();
    }

    //finding suitable delivery vehicle 
    const avldeliveryVehicle=await DeliveryVehicle.find({
        city:customerCity,
        activeOrdersCount:{$lt:2},
        vehicleType:"truck",
    })
    if(avldeliveryVehicle.length===0)
    {
        return res.status(400).json({message:"No suitable delivery vehicle available"});
    }

    //order no increment
    const lastOrder=await Order.findOne({},{},{sort:{'orderNumber':-1}});
    const orderNumber=lastOrder?lastOrder.orderNumber+1:1;


    const deliveryVehicle = avldeliveryVehicle.find(vehicle=>vehicle.registrationNumber===vehicleRegistraionNumber);
    if (!deliveryVehicle) {
      return res.status(400).json({ message: 'No suitable delivery vehicle available with given registration number' });
    }

    const item= await Item.findById(itemId);
    if(!item)
    {
        return res.status(404).json({message:"Item not found"});
    }
    const itemPrice=item.price;
    const newItem = new Order({
      orderNumber,
      itemId,
      customerId:customer._id,
      deliveryVehicleId: deliveryVehicle._id,
      price: itemPrice, 
      deliveryLocation: customerCity,

    });

    deliveryVehicle.activeOrdersCount++; // Increment the active orders count
    await Promise.all([newItem.save(), deliveryVehicle.save()]);
    res.status(201).json(newItem);
  } 
  catch (err) {
        res.status(400).json({ message: err.message });
  }
});


router.put('/:orderId/delivered',
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