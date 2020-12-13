import express from 'express';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config(); // load .env

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get('/', (_req, res) => {
  res.render('index');
});

app.listen(process.env.PORT, () => {
  console.log('Application is listening on port', process.env.PORT);
});
