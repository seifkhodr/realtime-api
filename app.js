import express from 'express';
import authRoutes from './src/routes/auth.route.js';
import globalErrorHandler from './src/middleware/globalErrorHandler.middleware.js';
import friendsListRoutes from './src/routes/friendsList.route.js';
import conversationRoutes from './src/routes/conversation.route.js';
import messageRoutes from './src/routes/message.route.js';
import userRoutes from './src/routes/user.route.js';
import { NotFoundError } from './src/utils/AppError.js';
import cookieParser from 'cookie-parser';
import {dirname ,join} from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(express.static(join(__dirname, 'public')));

app.get('/health' , (req,res,next)=>{
    res.send('ok');
});

app.get('/' , (req,res)=>{
    res.sendFile(join(__dirname,'public/index.html'));
}); 

app.use('/api/v1/auth',authRoutes);
app.use('/api/v1/friends',friendsListRoutes);
app.use('/api/v1/conversations',conversationRoutes);
app.use('/api/v1/messages',messageRoutes);
app.use('/api/v1/users',userRoutes);


app.use((req,res,next)=>{
    const error = new NotFoundError('Resource not found');
    next(error); // pass to the global error handler 
});

app.use(globalErrorHandler);

export default app;