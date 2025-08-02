import  Product  from "../../models/product.js";

export const getProductByCategoryId = async (req, reply) => {
    const{categoryId} = req.params;

    try {
        const product = await Product.find({ category : categoryId })
            .select("-category")
            .exec();
        
        return reply.status(200).send(product);
    }
    catch (error) {
        console.error("Error fetching products by category ID:", error);
        return reply.status(500).send({ message: "Internal server error" });
    }
}

export const getAllProducts = async (req, reply) => {
    try {
        const products = await Product.find({});
        return reply.status(200).send(products);
    } catch (error) {
        console.error("Error fetching all products:", error);
        return reply.status(500).send({ message: "Internal server error" });
    }
};

export const getProductById = async (req, reply) => {
    const { productId } = req.params;
    try {
        const product = await Product.findById(productId);
        if (!product) {
            return reply.status(404).send({ message: "Product not found" });
        }
        return reply.status(200).send(product);
    } catch (error) {
        console.error("Error fetching product by ID:", error);
        return reply.status(500).send({ message: "Internal server error" });
    }
};