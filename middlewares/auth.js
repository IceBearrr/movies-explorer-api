const jwt = require('jsonwebtoken');

const { NODE_ENV } = process.env;
const { JWT_SECRET } = require('../config');
const { handleErr } = require('../controllers/errors');
const AuthError = require('./errors/auth-err');

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    const err = new AuthError('ValidationError');
    handleErr(err, res);
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch {
    const err = new AuthError('ValidationError');
    handleErr(err, res);
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  next(); // пропускаем запрос дальше
};
