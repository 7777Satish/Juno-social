import express from "express";
import http from 'http';
import path from "path";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url); 
const __dirname = path.dirname(__filename);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(__dirname + '/public'));
app.set('view engine','ejs');
app.set('views', path.join(__dirname, 'views'));

import mainRoute from './routes/mainRoute.js';
import loginRoute from './routes/loginRoute.js';
import logoutRoute from './routes/logoutRoute.js';
import signupRoute from './routes/signupRoute.js';
import profileRoute from './routes/profileRoute.js';
import notificationsRoute from './routes/notificationsRoute.js';
import api from './routes/api/api.js';

app.use('/', mainRoute);
app.use('/p', profileRoute);
app.use('/login', loginRoute);
app.use('/logout', logoutRoute);
app.use('/signup', signupRoute);
app.use('/notifications', notificationsRoute);
app.use('/api', api);
app.use('/:others', (req, res) => {
    res.status(404).send('404 Not Found');
})

const server = http.createServer(app);

server.listen(process.env.PORT||8000, ()=>{console.log('Server listening at port', process.env.PORT)})