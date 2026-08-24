import 'dotenv/config';
import express from 'express';
import pool from './config/database.js';
import router from './routes/index.js';

const app = express();

app.use(express.json());

app.use("/api/v1", router);

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});