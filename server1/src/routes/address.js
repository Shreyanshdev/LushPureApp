import {
    addAddress,
    getAddresses,
    updateAddress,
    deleteAddress,
} from '../controllers/address.js';
import { verifyToken } from '../middleware/auth.js';

const addressRoutes = async (fastify, options) => {
    fastify.addHook("preHandler", async (request, reply) => {
        const isAuthenticated = await verifyToken(request, reply);
        if (!isAuthenticated) {
            return reply.status(401).send({ message: "Unauthorized" });
        }
    });

    fastify.post('/addresses', addAddress);
    fastify.get('/addresses', getAddresses);
    fastify.put('/addresses/:addressId', updateAddress);
    fastify.delete('/addresses/:addressId', deleteAddress);
};

export default addressRoutes;