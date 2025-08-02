import jwt from "jsonwebtoken";


export const verifyToken = async (request, reply) => {
  try {
    const authHeader = request.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      reply.status(401).send({ message: "Unauthorized" });
      return false;
    }


    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);


    if (!decoded) {
      reply.status(401).send({ message: "Invalid token" });
      return false;
    }


    // Map userId to _id for consistency with controllers
    request.user = {
      _id: decoded.userId,
      role: decoded.role,
    };


    return true;
  } catch (error) {
    console.error("Token verification error:", error);
    reply.status(401).send({ message: "Unauthorized" });
    return false;
  }
};