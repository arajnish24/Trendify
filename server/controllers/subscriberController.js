const Subscriber = require('../models/Subscriber');

exports.subscribe = async (req, res) => {
    const { email } = req.body;
    try {
        const existingSubscriber = await Subscriber.findOne({ email });
        if (existingSubscriber) {
            return res.status(400).json({ message: 'You are already subscribed!' });
        }

        const subscriber = await Subscriber.create({ email });
        res.status(201).json({ message: 'Subscribed successfully!', subscriber });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
