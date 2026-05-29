const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (user) => {
    return jwt.sign({ 
        id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin
    }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

exports.registerUser = async (req, res, next) => {
    const { name, email, mobile, password } = req.body;
    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = new User({
            name,
            email,
            mobile,
            password
        });

        const createdUser = await user.save();

        res.status(201).json({
            _id: createdUser._id,
            name: createdUser.name,
            email: createdUser.email,
            isAdmin: createdUser.isAdmin,
            address: createdUser.address,
            addresses: createdUser.addresses,
            cards: createdUser.cards,
            token: generateToken(createdUser)
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        // Find user by email OR mobile
        const user = await User.findOne({
            $or: [
                { email: email },
                { mobile: email }
            ]
        });
        
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const isMatch = await user.comparePassword(password);

        if (isMatch) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                address: user.address,
                addresses: user.addresses,
                cards: user.cards,
                token: generateToken(user)
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: error.message });
    }
};

exports.getUserProfile = async (req, res) => {
    const user = await User.findById(req.user.id);
    if (user) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            address: user.address,
            addresses: user.addresses,
            cards: user.cards
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

exports.addAddress = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (user) {
            const newAddress = {
                name: req.body.name,
                mobile: req.body.mobile,
                area: req.body.area,
                landmark: req.body.landmark,
                city: req.body.city,
                district: req.body.district,
                state: req.body.state,
                pincode: req.body.pincode
            };
            
            user.addresses.push(newAddress);
            // Also set as primary if it's the first one
            if (!user.address) {
                user.address = newAddress;
            }
            
            const updatedUser = await user.save();
            res.status(201).json(updatedUser.addresses);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteAddress = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (user) {
            user.addresses = user.addresses.filter(addr => addr._id.toString() !== req.params.addressId);
            await user.save();
            res.json({ message: 'Address removed' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.editAddress = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (user) {
            const address = user.addresses.id(req.params.addressId);
            if (address) {
                address.name = req.body.name || address.name;
                address.mobile = req.body.mobile || address.mobile;
                address.area = req.body.area || address.area;
                address.landmark = req.body.landmark || address.landmark;
                address.city = req.body.city || address.city;
                address.district = req.body.district || address.district;
                address.state = req.body.state || address.state;
                address.pincode = req.body.pincode || address.pincode;
                
                await user.save();
                res.json(user.addresses);
            } else {
                res.status(404).json({ message: 'Address not found' });
            }
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateAddress = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (user) {
            // This is now used to set the PRIMARY address for the current session/order
            user.address = {
                name: req.body.name,
                mobile: req.body.mobile,
                area: req.body.area,
                landmark: req.body.landmark,
                city: req.body.city,
                district: req.body.district,
                state: req.body.state,
                pincode: req.body.pincode
            };
            const updatedUser = await user.save();
            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                isAdmin: updatedUser.isAdmin,
                address: updatedUser.address,
                addresses: updatedUser.addresses,
                cards: updatedUser.cards
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.addCard = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (user) {
            const { cardHolderName, cardNumber, expiryDate, cardType } = req.body;
            // Mask card number for security before saving
            const maskedNumber = `**** **** **** ${cardNumber.slice(-4)}`;
            
            user.cards.push({
                cardHolderName,
                cardNumber: maskedNumber,
                expiryDate,
                cardType
            });
            
            const updatedUser = await user.save();
            res.status(201).json(updatedUser.cards);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteCard = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (user) {
            user.cards = user.cards.filter(card => card._id.toString() !== req.params.cardId);
            await user.save();
            res.json({ message: 'Card removed' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
