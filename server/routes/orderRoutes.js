const express = require('express');
const router = express.Router();
const { addOrderItems, getMyOrders, getAllOrders, updateOrderStatus } = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/', protect, addOrderItems);
router.get('/myorders', protect, getMyOrders);
router.get('/', protect, admin, getAllOrders);
router.put('/:id', protect, admin, updateOrderStatus);

module.exports = router;
