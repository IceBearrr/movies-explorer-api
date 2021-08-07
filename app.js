console.log(process.env.NODE_ENV); // production

const express = require('express');
const bodyParser = require('body-parser');
const { celebrate, Joi } = require('celebrate');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const helmet = require('helmet');
const cors = require('cors');
const limiter = require('./utils/limiter');
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
const { BASE_URL } = require('./config');

app.use(bodyParser.json()); // для собирания JSON-формата
app.use(bodyParser.urlencoded({ extended: true })); // для приёма веб-страниц внутри POST-запроса

mongoose.connect(BASE_URL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});
app.use(requestLogger);
app.use(limiter);
app.use(helmet());
app.options('*', cors());
app.use(errorLogger);

const allowedCors = [
  'https://icebear-movies.nomoredomains.club',
  'http://icebear-movies.nomoredomains.club',
];

app.use(cors());

app.use((req, res, next) => {
  const { origin } = req.headers;

  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }

  next();
});

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

app.get('*', (req, res) => {
  const err = new NotFoundError('Нет такой страницы');
  handleErr(err, res);
});

app.listen(PORT, () => {
  console.log('Ссылка на сервер');
});
