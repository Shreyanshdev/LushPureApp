import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
    },
    price: {
        type: Number,
        required: true,
    },
    discountPrice: {
        type: Number,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    quantity: {
        type: String,  // e.g., "500g", "1kg" also we can define type as number and then seprately define unit as string.
    },
    ratings: {
        type: Number,
        default: 0,
    },
    stock: {
        type: Number,
        default: 0,
    },
});

const Product = mongoose.model("Product", productSchema);
export default Product;