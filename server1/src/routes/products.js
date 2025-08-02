import { getAllCategories } from "../controllers/product/category.js";
import { getProductByCategoryId, getAllProducts , getProductById } from "../controllers/product/product.js";

const productRoutes = async (fastify, options) => {
    fastify.get("/products", getAllProducts); // New route to get all products
    fastify.get("/products/:categoryId", getProductByCategoryId);
    fastify.get("/product/:productId", getProductById);
    fastify.get("/categories", getAllCategories);
}

export default productRoutes;