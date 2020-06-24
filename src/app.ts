import express from 'express';
import cors from 'cors';

import { contactRouter } from './routes';


const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1/contact', contactRouter);

export default app; 