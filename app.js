require('dotenv').config();

console.log(process.env.NODE_ENV); // production

const express = require('express');
const bodyParser = require('body-parser');
const { celebrate, Joi } = require('celebrate');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const { handleErr } = require('./controllers/errors');
const NotFoundError = require('./middlewares/errors/not-found-err');
const {
  createUser,
  login,
} = require('./controllers/users');

const {
  PORT = 3000,
} = process.env;
const app = express();

const auth = require('./middlewares/auth');
const { requestLogger, errorLogger } = require('./middlewares/logger');

app.use(bodyParser.json()); // для собирания JSON-формата
app.use(bodyParser.urlencoded({ extended: true })); // для приёма веб-страниц внутри POST-запроса

mongoose.connect('mongodb://localhost:27017/bitfilmsdb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});
app.use(requestLogger);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string(),
    password: Joi.string().required().min(2),
    name: Joi.string().min(2).max(20),
  }),
}), createUser);
app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(2),
  }),
}), login);

app.use(auth);
// app.get('/crash-test', () => {
//   setTimeout(() => {
//     throw new Error('Сервер сейчас упадёт');
//   }, 0);
// });
app.use('/users', require('./routes/users'));
app.use('/movies', require('./routes/movies'));

app.use(errors());

app.use(requestLogger, errorLogger);

app.get('*', (req, res) => {
  const err = new NotFoundError('Нет такой страницы');
  handleErr(err, res);
});

app.listen(PORT, () => {
  console.log('Ссылка на сервер');
  // console.log(BASE_PATH);
});
