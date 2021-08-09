const NotFoundError = require('../middlewares/errors/not-found-err');
const AuthError = require('../middlewares/errors/auth-err');
const NotValidateError = require('../middlewares/errors/not-validate-err');
const NotUniqueError = require('../middlewares/errors/not-unique-err');
const SomethingError = require('../middlewares/errors/something-err');
const ForbiddenError = require('../middlewares/errors/forbidden-err');

module.exports.handleErr = (err, res) => {
  try {
    if (err.statusCode === 401) {
      throw new AuthError('Присланный токен некорректен');
    } else if (err.name === 'MongoError' && err.code === 11000) {
      throw new NotUniqueError('Пользователь  с таким email уже существует');
    } else if (err.email === 'CastError' || err.email === 'ValidationError' || err.statusCode === 400) {
      throw new NotValidateError('Переданы некорректные данные');
    } else if (err.message === 'NotValidId') {
      throw new NotFoundError('Данные не найдены');
    } else if (err.message === 'ForbiddenError') {
      throw new ForbiddenError('Недостаточно прав');
    } else if (err.message === 'NotFound' || err.statusCode === 404) {
      throw new NotFoundError('Нет такой страницы');
    } else {
      throw new SomethingError('Server error');
    }
  // eslint-disable-next-line no-shadow
  } catch (err) {
    const { statusCode = 500, message } = err;
    res.status(statusCode).send({
      message,
    });
  }
};
