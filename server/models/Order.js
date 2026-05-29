const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', required: true
    },
    orderItems: [{
        name: {
            type: String,
            required: true
        },
        qty: {
            type: Number,
            required: true
        },
        image: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product', required: true
        }
    }],
    shippingAddress: {
        address: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        phone: {
            type: String,
            required: true
        }
    },
    totalPrice: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: [
            'pending', 'processing', 'shipped', 'out for delivery', 'delivered', 
            'return requested', 'return accepted', 'return rejected', 
            'replacement requested', 'replacement accepted', 'replacement rejected',
            'picked up', 'refunded', 'replacement shipped', 'replacement delivered', 'cancelled'
        ],
        default: 'pending'
    },
    paymentMethod: {
        type: String,
        required: true,
        enum: ['online', 'cod']
    },
    isPaid: {
        type: Boolean,
        default: false
    },
    paidAt: {
        type: Date
    },
    shippedAt: {
        type: Date
    },
    deliveredAt: {
        type: Date
    },
    expectedDeliveryDate: {
        type: Date
    },
    returnReplaceReason: {
        type: String
    }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
