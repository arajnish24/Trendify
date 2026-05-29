const Order = require('../models/Order');
const Product = require('../models/Product');

exports.addOrderItems = async (req, res) => {
    const { orderItems, shippingAddress, totalPrice, paymentMethod, isPaid, paidAt } = req.body;

    if (orderItems && orderItems.length === 0) {
        return res.status(400).json({ message: 'No order items' });
    } else {
        // Check stock before proceeding
        for (const item of orderItems) {
            const product = await Product.findById(item.product);
            if (!product || product.countInStock < item.qty) {
                return res.status(400).json({ message: `Insufficient stock for ${item.name}` });
            }
        }

        const order = new Order({
            user: req.user.id,
            orderItems,
            shippingAddress,
            totalPrice,
            paymentMethod,
            isPaid: isPaid || false,
            paidAt: paidAt || null,
            status: 'pending'
        });

        // Set default expected delivery date (e.g., 7 days from now)
        const expectedDate = new Date();
        expectedDate.setDate(expectedDate.getDate() + 7);
        order.expectedDeliveryDate = expectedDate;

        const createdOrder = await order.save();

        // Update stock
        for (const item of orderItems) {
            await Product.findByIdAndUpdate(item.product, {
                $inc: { countInStock: -item.qty }
            });
        }

        res.status(201).json(createdOrder);
    }
};

exports.getMyOrders = async (req, res) => {
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(orders);
};

exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find({}).populate('user', 'id name email').sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateOrderStatus = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (order) {
            const { status, expectedDeliveryDate, returnReplaceReason } = req.body;
            
            order.status = status || order.status;
            
            if (status === 'shipped') {
                order.shippedAt = Date.now();
            } else if (status === 'delivered') {
                order.deliveredAt = Date.now();
                if (order.paymentMethod === 'cod') {
                    order.isPaid = true;
                    order.paidAt = Date.now();
                }
            }
            
            if (expectedDeliveryDate) {
                order.expectedDeliveryDate = expectedDeliveryDate;
            }

            if (returnReplaceReason) {
                order.returnReplaceReason = returnReplaceReason;
            }

            const updatedOrder = await order.save();
            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
