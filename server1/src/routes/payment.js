import { createOrder, verifyPayment } from '../controllers/payment.js';

const paymentRoutes = async (fastify, options) => {
    fastify.post('/create-order', createOrder);
    fastify.post('/verify-payment', verifyPayment);
};

export default paymentRoutes;