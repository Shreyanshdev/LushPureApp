import {
    confirmOrder,
    createOrder,
    getOrders,
    getOrderById,
    updateOrderStatus
} from "../controllers/order/order.js";

import { verifyToken } from "../middleware/auth.js";

export const orderRoutes = async (fastify, options) => {
    fastify.addHook("preHandler", async (request, reply) => {
        const isAuthenticated = await verifyToken(request, reply);
        if (!isAuthenticated) {
            return reply.status(401).send({ message: "Unauthorized" });
        }
    });

    fastify.post("/order", createOrder);
    fastify.get("/order", getOrders);
    fastify.get("/order/:orderId", getOrderById);
    fastify.post("/order/:orderId/confirm", { preHandler: [verifyToken] }, confirmOrder);
    fastify.patch("/order/:orderId/status", { preHandler: [verifyToken] }, updateOrderStatus);
}

export default orderRoutes;