import razorpay from '../config/razorpay.js';
import crypto from 'crypto';

export const createOrder = async (req, reply) => {
    const { amount, currency, receipt } = req.body;

    try {
        const options = {
            amount: amount * 100, // amount in the smallest currency unit
            currency,
            receipt,
        };

        const order = await razorpay.orders.create(options);
        reply.send(order);
    } catch (error) {
        reply.code(500).send({ error: error.message });
    }
};

export const verifyPayment = (req, reply) => {
    const { order_id, payment_id, signature } = req.body;

    const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
    hmac.update(`${order_id}|${payment_id}`);
    const generated_signature = hmac.digest('hex');

    if (generated_signature === signature) {
        reply.send({ success: true });
    } else {
        reply.send({ success: false });
    }
};