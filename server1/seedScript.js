import 'dotenv/config';
import mongoose from 'mongoose';
import { Category , Product } from './src/models/index.js';
import {categories,products} from './seedData.js';

async function seedDatabase() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI);

        console.log('Connected to MongoDB');

        // Seed Categories
        await Category.deleteMany({});
        await Product.deleteMany({});
        const categoryDocs = await Category.insertMany(categories);
        console.log(`${categoryDocs.length} categories seeded`);

        const categoryMap =categoryDocs.reduce((map, category) => {
            map[category.name] = category._id;
            return map;
        }, {});

        const productsWithCategoryIds = products.map((product) => ({
            ...product,
            category:categoryMap[product.category] ,
        }));

        await Product.insertMany(productsWithCategoryIds);
        console.log('Database seeded with products');

        console.log(`${productsWithCategoryIds.length} products seeded`);

    } catch (error) {
        console.error('Error seeding database:', error);
    } finally {
        mongoose.connection.close();
    }
}

seedDatabase();