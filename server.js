import express from 'express';
import connection from './Database/db.js';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import router from './routes/route.js';

const app = express();
const PORT = process.env.PORT || 8000;

dotenv.config();

app.use(bodyParser.json({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use('/', router); // Assuming API endpoints start with /api

// Connect to database
const userName = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;

const URL = process.env.MONGODB_URI || `mongodb+srv://${userName}:${password}@construction.1lh6mmr.mongodb.net/?retryWrites=true&w=majority`;

connection(URL);

if(process.env.NODE_ENV === 'production'){
    app.use(express.static('client/build'));
}   

app.listen(PORT, () => console.log(`Server is successfully running on Port ${PORT}`));
