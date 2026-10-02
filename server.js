import app from './app.js';
import getEnv from './src/config/env.config.js';
import DbConfig from './src/config/db.config.js';
import mongoose from 'mongoose';
import http from 'http';
import initSocket from './src/socket/socketServer.js';


const port = getEnv('PORT', '3000');
const httpServer = http.createServer(app);


const StartServer = async ()=>{
    try {
        initSocket(httpServer);

        const DbConnection = new DbConfig(); 
        await DbConnection.connect();

        httpServer.listen(port , ()=>{
            console.log(`server started at http://localhost:${port}`);
        });
        
    } catch (error) {
        console.log('Error while starting server : ' , error);
        process.exit(1);
    }
}


mongoose.connection.on('connected' ,()=>{
    console.log('Db connection establish');
});




StartServer();