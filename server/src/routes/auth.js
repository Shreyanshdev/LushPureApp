import { fetchUser, loginCustomer, loginDeliveryPartner, refreshToken, logout } from '../controllers/auth/auth.js';
import { updateUser } from '../controllers/tracking/tracking.js';
import { verifyToken } from '../middleware/auth.js';

export const authRoutes = async (fastify, options) => {
    fastify.post('/customer/login', loginCustomer);
    fastify.post('/delivery/login', loginDeliveryPartner);
    fastify.post('/auth/refresh-token', refreshToken);
    fastify.post('/auth/logout', {preHandler: [verifyToken]}, logout);
    fastify.get('/user', {preHandler: [verifyToken]}, fetchUser);
    fastify.put('/user/', {preHandler: [verifyToken]}, updateUser);
}

export default authRoutes;