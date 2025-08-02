import 'dotenv/config';
import { connectDB } from './src/config/connect.js';
import fastify from 'fastify';
import {PORT} from './src/config/config.js';
import { registerRoutes } from './src/routes/index.js';
import fastifySocketIO from 'fastify-socket.io';
import { admin, buildAdminRouter } from './src/config/setup.js';

const start = async () => {

    await connectDB();

    const app=fastify();

    app.register(import('@fastify/cors'), {
        origin: '*' // Allow all origins for development. Restrict in production.
    });

    app.register(fastifySocketIO, {
        cors: {
            origin: '*',
        },
        pingTimeout: 60000,
        pingInterval: 25000,
        transports: ['websocket'],
    });

    await registerRoutes(app);

    await buildAdminRouter(app);


    //for mobile access too add host 0.0.0.0
    app.listen({port:PORT,host:'0.0.0.0'},(err,add)=>{
        if (err) {
            console.error(err);
            process.exit(1);
        }
        console.log(`Lush & Pure is running at http://localhost:${PORT}${admin.options.rootPath}`);
    })

    app.ready().then(() => {
        app.io.on('connection', (socket) => {
            console.log('User Connected YOOOO');

            socket.on("joinRoom", (orderId) => {
                socket.join(orderId);
                console.log(`User joined room: ${orderId}`);
            }); 

            socket.on('disconnect', () => {
                console.log('Client disconnected:', socket.id);
            });
        });
    });
}
start();