const Razorpay = require('razorpay');
const crypto = require('crypto');
const dotenv = require('dotenv');

dotenv.config();

// Razorpay Instance
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

// ===============================
// @desc    Create Razorpay Order
// @route   POST /api/payment/order
// @access  Private
// ===============================
exports.createOrder = async (req, res) => {

    const { amount } = req.body;

    try {

        const options = {
            amount: Math.round(amount * 100), // paise
            currency: 'INR',
            receipt: `receipt_${Date.now()}`
        };

        // Create Razorpay Order
        const order = await razorpay.orders.create(options);

        // Send complete response for frontend
        res.status(200).json({
            success: true,
            order
        });

    } catch (error) {

        console.error('Razorpay Order Error:', error);

        res.status(500).json({
            success: false,
            message: 'Could not create order'
        });
    }
};

// ===============================
// @desc    Verify Razorpay Payment
// @route   POST /api/payment/verify
// @access  Private
// ===============================
exports.verifyPayment = async (req, res) => {

    const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature
    } = req.body;

    try {

        const body =
            razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac(
                'sha256',
                process.env.RAZORPAY_KEY_SECRET
            )
            .update(body.toString())
            .digest('hex');

        const isAuthentic =
            expectedSignature === razorpay_signature;

        if (isAuthentic) {

            // Payment Verified
            return res.status(200).json({
                success: true,
                message: 'Payment verified successfully'
            });

        } else {

            return res.status(400).json({
                success: false,
                message: 'Invalid signature'
            });
        }

    } catch (error) {

        console.error('Verification Error:', error);

        res.status(500).json({
            success: false,
            message: 'Payment verification failed'
        });
    }
};