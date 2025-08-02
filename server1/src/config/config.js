import 'dotenv/config';
import fastifySession from '@fastify/session';
import ConnectMongoDBSession from 'connect-mongodb-session';
import {Admin } from '../models/user.js';


export const PORT = process.env.PORT || 3000;
export const COOKIE_PASSWORD = process.env.COOKIE_PASSWORD;
export const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID;
export const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;

const MongoDBStore = ConnectMongoDBSession(fastifySession);

export const sessionStore = new MongoDBStore({
    uri:process.env.MONGO_URI,
    collection:"sessions",
})

sessionStore.on('error', (error) => {
    console.error('Session store error:', error);
});

export const authenticate= async (email , password) => {

    //     if(email==='vasuzx890@gmail.com' && password==='123456789'){
    //         return Promise.resolve({
    //             email: email,
    //             password: password
    //         });
    //     }else{
    //         return Promise.reject(new Error('Invalid credentials'));
    //     }
    // }


        // Manually creating Admin
        const user = await Admin.findOne({ email, password });
        if(!user) {
            reply.status(401).send({ message: 'Invalid credentials' });
            return false;
        }
        if(user.password === password) {
            return Promise.resolve({
                email:email,
                password:password
            });
        }else{
            return Promise.reject(new Error('Invalid credentials'));
        }
    

    }