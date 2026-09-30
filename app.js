import express from 'express';
import authRoutes from './src/routes/auth.route.js';
import globalErrorHandler from './src/middleware/globalErrorHandler.middleware.js';
import friendsListRoutes from './src/routes/friendsList.route.js';

const app = express();

app.use(express.json());

app.get('/health' , (req,res,next)=>{
    res.send('ok');
});

app.use('/api/v1/auth',authRoutes);
app.use('/api/v1/friends',friendsListRoutes);

app.use((req,res,next)=>{
    const error = new Error('resouce not found');
    error.status = 404;
    next(error); // pass to the global error handler 
});

app.use(globalErrorHandler);

export default app;