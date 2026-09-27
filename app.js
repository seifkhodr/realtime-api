import express from 'express';

const app = express();
const port = 3000;

app.get('/health' , (req,res,next)=>{
    res.send('ok');
});

export default app;