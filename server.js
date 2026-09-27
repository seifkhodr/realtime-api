import app from './app.js';
import getEnv from './src/config/env.config.js';
import DbConfig from './src/config/db.config.js';
import mongoose from 'mongoose';

const port = getEnv('PORT' , null);


const StartServer = async ()=>{
    try {
        const DbConnection = new DbConfig(); 
        await DbConnection.connect();
        app.listen(port , ()=>{
            console.log(`server started at http://localhost:${port}`);
        });
    } catch (error) {
        
    }
}


mongoose.connection.on('connected' ,()=>{
    console.log('Db connection establish');
});




StartServer();