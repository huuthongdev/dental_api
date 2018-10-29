import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { json } from 'body-parser';
import { onError } from './refs';
export const app = express();

app.use(cors());
app.use(json());
app.use(onError);

// if (!process.env.NODE_ENV) app.use((req, res, next) => setTimeout(next, 500));
app.get('/', (req, res) => res.send({ success: true }));

app.use((req, res) => res.status(404).send({ success: false, message: 'INVALID_ROUTE' }));

app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(error.stack)
    res.status(500).send({ success: false, message: 'INTERNAL_SERVER_ERROR' });
});
