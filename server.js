const app = require('./app');
const getEnv = require('./src/config/env.config');
const DbConfig = require('./src/config/db.config');
const mongoose = require('mongoose');

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