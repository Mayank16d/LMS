import cookieParser from 'cookie-parser';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import userRoutes from './routes/user.routes.js'
import courseRoutes from './routes/course.routes.js'
import errorMiddleware from './middlewares/error.middleware.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(cors({
    origin: [process.env.FRONTEND_URL],
    credentials: true 
}))

app.use(cookieParser());
app.use(morgan('dev'));

app.use('/ping', function(req, res){
    res.send('pong'); 
});

app.use('/api/v1/user',userRoutes);
app.use('/api/v1/courses',courseRoutes)

app.all('*',(req, res)=>{
    res.status(404).send('OPPS!! 404 page not found');
});

app.use(errorMiddleware);

export default app;