import { Customer , DeliveryPartner } from "../../models/user.js";
import jwt from "jsonwebtoken";

const generateToken = (user) => {
    const accessToken = jwt.sign(
        {
            userId: user._id,
            role: user.role,
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "1d" }
    );
    const refreshToken = jwt.sign(
        {
            userId: user._id,
            role: user.role,
        },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "7d" }
    );
    return { accessToken, refreshToken };
}

export const loginCustomer = async (req, reply) => {
    try{
        const {phone} =req.body;
        let customer =await Customer.findOne({ phone });

        if (!customer) {
            customer = new Customer({ 
                phone,role: 'Customer',isActivated: true
            });
            await customer.save();
        }

        const { accessToken, refreshToken } = generateToken(customer);

        return reply.status(200).send({
            message: "Login successful",
            accessToken,
            refreshToken,
            customer
        });

    }
    catch (error) {
        console.error("Login error:", error);
        reply.status(500).send({ message: "Internal server error" });
    }
}

export const loginDeliveryPartner = async (req, reply) => {
    try{

        const {email , password} = req.body;
        const deliveryPartner =await DeliveryPartner.findOne({ email });

        if (!deliveryPartner) {
            return reply.status(404).send({ message: "Delivery Partner not found" });
        }

        if (deliveryPartner.password !== password) {
            return reply.status(401).send({ message: "Invalid credentials" });
        }
        
        const { accessToken, refreshToken } = generateToken(deliveryPartner);

        return reply.status(200).send({
            message: "Login successful",
            accessToken,
            refreshToken,
            deliveryPartner
        });
    }
    
    catch(error){
        console.error("Login error:", error);
        reply.status(500).send({ message: "Internal server error" });
    }
};

export const refreshToken = async (req, reply) => {
    const { refreshToken } = req.body;

    if(!refreshToken) {
        return reply.status(401).send({ message: "Refresh token is required" });
    }

    try{
        const decoded= jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        let user;

        if(decoded.role === 'Customer') {
            user = await Customer.findById(decoded.userId);
        }
        else if(decoded.role === 'DeliveryPartner') {
            user = await DeliveryPartner.findById(decoded.userId);
        }else {
            return reply.status(401).send({ message: "Invalid token" });
        }

        if (!user) {
            return reply.status(404).send({ message: "User not found" });
        }

        const { accessToken, refreshToken: newRefreshToken } = generateToken(user);

        return reply.status(200).send({
            message: "Tokens refreshed successfully",
            accessToken,
            refreshToken: newRefreshToken,
            user
        });
    }
    catch(error) {
        console.error("Refresh token error:", error);
        return reply.status(500).send({ message: "Internal server error" });

    }

}

export const fetchUser = async (req, reply) => {
    try{
        const {userId, role} = req.user;
        let user;

        if(role=== 'Customer') {
            user = await Customer.findById(userId);
        }
        else if(role === 'DeliveryPartner') {
            user = await DeliveryPartner.findById(userId);
        }
        else {
            return reply.status(401).send({ message: "Unauthorized" });
        }

        if (!user) {
            return reply.status(404).send({ message: "User not found" });
        }

        return reply.status(200).send({
            message: "User fetched successfully",
            user
        });
    }
    catch(error) {
        console.error("Fetch user error:", error);
        return reply.status(500).send({ message: "Internal server error" });
    }
}

export const logout = async (req, reply) => {
    try {
        // For stateless JWTs, server-side logout is often just a formality.
        // The actual logout happens on the client by removing the token.
        return reply.status(200).send({ message: "Logged out successfully" });
    } catch (error) {
        console.error("Logout error:", error);
        return reply.status(500).send({ message: "Internal server error" });
    }
};