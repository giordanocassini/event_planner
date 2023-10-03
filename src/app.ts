import express from 'express';
import 'reflect-metadata';
import * as bodyParser from 'body-parser';
import routes from './routes';
import cors from 'cors';
import helmet from 'helmet';

const app = express();
app.use(cors());
app.use(helmet());
app.use(bodyParser.json());
app.use(routes);

export default app;
