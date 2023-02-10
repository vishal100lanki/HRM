import express from "express";
import Routes from "./routes/api.js";
import db from "./database/db.js";
import 'dotenv/config'
import cors from "./config/cors.js";
import bodyParser from 'body-parser';

import { fileURLToPath } from 'url';
import path from 'path';


const app = express();

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

app.use(cors);

// app.use(expressValidator())
app.use(express.json());
app.use(Routes);

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

// app.use(express.static('uploads'));
// app.use(express.static('files'));
const port = 3000;

app.get('/', (req, res) => {
  res.send('WELCOME TO The TEQO FAMILY');
});

app.get("/uploads/:path", (req, res) => {
  res.sendFile(__dirname + '/uploads/' + req.params.path);
});

  //.env
console.log(process.env.API_KEY, "i m here");

// listening PORT
app.listen(port, () => {
  console.log('app listening at http://192.168.11.127' , {port});
});
