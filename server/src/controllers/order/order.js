import { Customer, DeliveryPartner } from "../../models/user.js";
import  Branch from "../../models/branch.js";
import Order from "../../models/order.js";

export const createOrder = async (req, reply) => {
    try{
        const {userId} = req.user;
        const { items,branch, totalPrice} = req.body;

        const constumerData = await Customer.findById(userId);
        const branchData = await Branch.findById(branch);

        if (!constumerData) {
            return reply.status(404).send({ message: "Customer not found" });
        }

        const newOrder = new Order({
            customer: userId,
            items:items.map((item)=> ({
                id: item.id,
                item: item.item,
                count : item.count,
            })),
            branch,
            totalPrice,
            deliveryLocation:{
                latitude: constumerData.liveLocation.latitude,
                longitude: constumerData.liveLocation.longitude,
                address: constumerData.address || "Not provided",
            },
            pickupLocation: {
                latitude: branchData.location.latitude,
                longitude: branchData.location.longitude,
                address: branchData.address || "Not provided",
            }
        });

        const savedOrder = await newOrder.save();
        return reply.status(201).send({
            message: "Order created successfully",
            order: savedOrder
        });
    }
    catch(error) {
        console.error("Create order error:", error);
        return reply.status(500).send({ message: "Internal server error" });
    }
}

export const confirmOrder = async (req, reply) => {
    try{
        const { orderId } = req.params;
        const { userId } = req.user;
        const {deliveryPersonLocation} = req.body;  

        const deliveryLocation = await DeliveryPartner.findById(userId);
        if (!deliveryLocation) {
            return reply.status(404).send({ message: "Delivery Partner not found" });
        }

        const order = await Order.findById(orderId);
        if (!order) {
            return reply.status(404).send({ message: "Order not found" });
        }

        if (order.status !== "Pending") {
            return reply.status(400).send({ message: "Order cannot be confirmed" });
        }
        
        order.status = "Accepted";
        
        order.deliveryPartner = userId;
        order.deliveryPersonLocation = {
            latitude: deliveryPersonLocation.latitude,
            longitude: deliveryPersonLocation.longitude,
            address: deliveryPersonLocation.address || "Not provided",
        };

        req.server.io.to(orderId).emit("orderConfirmed", order);
        await order.save();

        return reply.status(200).send({
            message: "Order confirmed successfully",
            order:order
        });
    }
    catch(error){
        console.error("Confirm order error:", error);
        return reply.status(500).send({ message: "Internal server error" });
    }
}

export const updateOrderStatus = async (req, reply) => {    
    try{
        const {orderId }= req.params;
        const {status , deliveryPersonLocation} = req.body;
        const { userId } = req.user;

        const deliveryPerson =await DeliveryPartner.findById(userId);
        if (!deliveryPerson) {
            return reply.status(404).send({ message: "Delivery Partner not found" });
        }

        const order = await Order.findById(orderId);
        if( !order) {
            return reply.status(404).send({ message: "Order not found" });
        }

        if(["Delivered", "Cancelled"].includes(order.status)) {
            return reply.status(400).send({ message: "Order cannot be updated" });
        }

        if(order.deliveryPartner.toString() !== userId) {
            return reply.status(403).send({ message: "You are not authorized to update this order" });
        }

        order.status = status;
        order.deliveryPersonLocation = deliveryPersonLocation;
        await order.save();

        req.server.io.to(orderId).emit("orderStatusUpdated", order);

        return reply.status(200).send({
            message: "Order status updated successfully",
            order: order
        });
    }
    catch(error) {
        console.error("Update order status error:", error);
        return reply.status(500).send({ message: "Internal server error" });
    }
}

// for all order
export const getOrders = async (req, reply) => {
    try{
        const {status , constumerId, deliveryPartnerId ,branchId} = req.query;
        let query = {};

        if(status) {
            query.status = status;
        }
        if(constumerId) {
            query.customer = constumerId;
        }
        if(deliveryPartnerId) {
            query.deliveryPartner = deliveryPartnerId;
        }
        if(branchId) {
            query.branch = branchId;
        }

        const orders = await Order.find(query).populate(
            "customer branch items.item deliveryPartner"
        )

        return reply.status(200).send({
            message: "Orders fetched successfully",
            orders: orders
        });

    }

    catch(error) {
        console.error("Get order error:", error);
        return reply.status(500).send({ message: "Internal server error" });
    }
}

//for one order
export const getOrderById = async (req, reply) => {
    try{
        const { orderId } = req.params;

        const order = await Order.findById(orderId).populate(
            "customer branch items.item",
            { path: 'deliveryPartner', select: 'phone' }
        );

        if (!order) {
            return reply.status(404).send({ message: "Order not found" });
        }

        return reply.status(200).send({
            message: "Order fetched successfully",
            order: order
        });
    }
    catch(error) {
        console.error("Get order by ID error:", error);
        return reply.status(500).send({ message: "Internal server error" });
    }
}