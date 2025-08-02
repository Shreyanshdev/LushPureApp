import mongoose from "mongoose";
import Counter from "./counter.js";

const subscriptionSchema = new mongoose.Schema({
    subscriptionId: {
        type: String,
        unique: true,
    },
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Customer",
        required: true,
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    milkType: {
        type: String,
        enum: ["full tonned", "butter milk"],
        required: true,
    },
    slot: {
        type: String,
        enum: ["Day", "Evening"],
        required: true,
    },
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
        required: true,
    },
    cancellationCutoff: {
        type: Number, // in hours
        default: 2,
    },
    price: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ["Active", "Paused", "Cancelled", "Expired"],
        default: "Active",
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

async function generateSubscriptionId() {
    const counter = await Counter.findOneAndUpdate(
        { name: "subscriptionId" },
        { $inc: { sequenceValue: 1 } },
        { new: true, upsert: true }
    );
    return `SUB-${counter.sequenceValue.toString().padStart(5, '0')}`;
}

subscriptionSchema.pre("save", async function (next) {
    if (this.isNew) {
        this.subscriptionId = await generateSubscriptionId();
    }
    this.updatedAt = Date.now();
    next();
});

const Subscription = mongoose.model("Subscription", subscriptionSchema);
export default Subscription;