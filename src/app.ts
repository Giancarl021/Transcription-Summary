import express from 'express';
import cors from 'express';
import routes from './routes';

const app = express();

app.use(cors());
app.use(express.json());

app.use(routes);

export default app;
