const app = require('./app');
const port = 3000;

const StartServer = ()=>{
    app.listen(port , ()=>{
        console.log(`server started at http://localhost:${port}`);
    });
}

StartServer();