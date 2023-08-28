const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
orderNumber: 
{ 
    type: String, 
    unique: true 
},
itemId: 
{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Item' 
},
price: Number,
customerId: 
{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Customer' 
},
deliveryVehicleId: 
{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'DeliveryVehicle' 
},
isDelivered: 
{ 
    type: Boolean, 
    default: false 
},
});

orderSchema.pre('save', async function (next) {
    if (!this.orderNumber) {
      const lastOrder = await this.constructor.findOne({}, { orderNumber: 1 }, { sort: { orderNumber: -1 } });
      const lastOrderNumber = lastOrder ? parseInt(lastOrder.orderNumber, 10) : 0;
      this.orderNumber = (lastOrderNumber + 1).toString().padStart(4, '0');
    }
    next();
});

orderSchema.post('save', async function () {
    if (this.isModified('deliveryVehicleId')) {
      await this.constructor.populate(this, 'deliveryVehicleId');
      if (this.deliveryVehicleId) {
        this.deliveryVehicleId.activeOrdersCount += 1;
        await this.deliveryVehicleId.save();
      }
    }
  });

module.exports = mongoose.model('Order', orderSchema);
