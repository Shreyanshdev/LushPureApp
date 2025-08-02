import {
    getUserProfile,
    updateUserProfile,
  } from "../controllers/userController.js";
  
  import { verifyToken } from "../middleware/auth.js";
  
  export const profileRoutes = async (fastify, options) => {
    // Apply authentication globally to all routes in this file
    fastify.addHook("preHandler", async (request, reply) => {
      try {
        await verifyToken(request, reply);
      } catch (error) {
        reply.status(401).send({ message: error.message });
      }
    });
  
    // Routes
    fastify.get("/user/profile", getUserProfile);
    fastify.put("/user/profile", updateUserProfile);
  };
  
export default profileRoutes;