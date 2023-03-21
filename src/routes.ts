import { Router } from 'express';
import multer from 'multer';
import multerOptions from './config/multer';
import summarize from './controllers/summarize';

const routes = Router();
const upload = multer(multerOptions);

routes.post('/summarize', upload.single('audio-file'), summarize);

export default routes;
