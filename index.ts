import 'dotenv/config';
import app from './src/app';

const port = Number(process.env.PORT) || 80;

app.listen(port, () => console.log(`Server running on port ${port}`));
