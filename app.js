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
import helmet from 'helmet';
import cors from 'cors';
import {rateLimit} from 'express-rate-limit';

const __dirname = dirname(fileURLToPath(import.meta.url));
const AuthLimiter = rateLimit(
    {
        windowMs : 15 * 60 * 1000,
        limit : 5 ,
        message : {error : 'Too many request , please try again later .'},
        statusCode : 429,
        handler : (req,res,next,options) =>{
            res.status(options.statusCode).json(options.message)
        },
        standardHeaders : true,
        legacyHeaders : false
    }
);

const app = express();

app.use(helmet({
    crossOriginResourcePolicy : {
        policy : 'cross-origin'
    },
    contentSecurityPolicy : {
        directives : {
            scriptSrc : ["'self'", 'https://code.jquery.com']
        }
    }
}));
app.use(cors({
    origin : 'http://localhost:5173',
    credentials : true
}));
app.use(express.urlencoded(
    {
        extended : true,
        limit : '10kb'
    }
));

app.use(express.json(
    {
        limit : '10kb'
    }
));
app.use(cookieParser());

app.use(express.static(join(__dirname, 'public')));

app.get('/health' , (req,res,next)=>{
    res.send('ok');
});

app.get('/' , (req,res)=>{
    res.sendFile(join(__dirname,'public/index.html'));
}); 

app.use('/api/v1/auth',AuthLimiter,authRoutes);
app.use('/api/v1/friends',friendsListRoutes);
app.use('/api/v1/conversations',conversationRoutes);
app.use('/api/v1/messages',messageRoutes);
app.use('/api/v1/users',userRoutes);


app.use((req,res,next)=>{
    const error = new NotFoundError('Resource not found');
    next(error);
});

app.use(globalErrorHandler);

export default app;