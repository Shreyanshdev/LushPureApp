import  Category  from "../../models/category.js";

export const getAllCategories = async (req, reply) => {
    try {
        const categories = await Category.find();
        return reply.status(200).send(categories);
    } catch (error) {
        console.error("Error fetching categories:", error);
        return reply.status(500).send({ message: "Internal server error" });
    }
}