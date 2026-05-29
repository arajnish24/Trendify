const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUserProfile, getAllUsers, updateAddress, addAddress, editAddress, deleteAddress, addCard, deleteCard } = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getUserProfile);
router.put('/address', protect, updateAddress);
router.post('/addresses', protect, addAddress);
router.put('/addresses/:addressId', protect, editAddress);
router.delete('/addresses/:addressId', protect, deleteAddress);
router.post('/cards', protect, addCard);
router.delete('/cards/:cardId', protect, deleteCard);
router.get('/', protect, admin, getAllUsers);

module.exports = router;
