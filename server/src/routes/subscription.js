import {
    createSubscription,
    getSubscription,
    updateSubscription,
    cancelSubscription,
} from "../controllers/subscription/subscription.js";

const subscriptionRoutes = async (fastify, options) => {
    fastify.post("/subscriptions", createSubscription);
    fastify.get("/subscriptions/:id", getSubscription);
    fastify.put("/subscriptions/:id", updateSubscription);
    fastify.patch("/subscriptions/:id/cancel", cancelSubscription);
};

export default subscriptionRoutes;