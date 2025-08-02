import mongoose from "mongoose";
import Counter from "./counter.js";

const orderSchema = new mongoose.Schema({
    orderId:{
        type: String,
        unique:true,
    },
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Customer",
        required: true,
    },
    deliveryPartner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "DeliveryPartner",
    },
    branch: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Branch",
        required: true,
    },
    items: [{
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        },
        item: {
            type: String,
            ref: "Product",
            required: true,
        },
        count : {
            type: Number,
            required: true,
        },
    }],
    deliveryLocation: {
        latitude: { type: Number, required: true },
        longitude: { type: Number, required: true },
        address: {
            type: String,
            required: true,
        },
    },
    pickupLocation: {
        latitude: { type: Number, required: true },
        longitude: { type: Number, required: true },
        address: {
            type: String,
            required: true,
        },
    },
    deliveryPersonLocation: {
        latitude: { type: Number},
        longitude: { type: Number },
        address: {
            type: String,
            required: true,
        },
    },
    status: {
        type: String,
        enum: ["Pending", "Accepted", "In Transit", "Delivered", "Cancelled"],
        default: "Pending",
    },
    totalPrice: {
        type: Number,
        required: true,
    },
    deliveryFee: {
        type: Number,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },


});

async function generateOrderId() {
    const counter = await Counter.findOneAndUpdate(
        { name: "orderId" },
        { $inc: { sequenceValue: 1 } },
        { new: true, upsert: true }
    );
    return `ORD-${counter.sequenceValue.toString().padStart(5, '0')}`;
}

orderSchema.pre("save", async function (next) {
    if (this.isNew) {
        this.orderId = await generateOrderId();
    }
    this.updatedAt = Date.now();
    next();
});

const Order = mongoose.model("Order", orderSchema);
export default Order;