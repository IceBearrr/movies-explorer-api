const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { handleErr } = require('./errors');

const { NODE_ENV, JWT_SECRET } = process.env;
const User = require('../models/user');

module.exports.getCurrentUsers = (req, res) => {
  console.log(req.user._id);
  User.findById(req.user._id)
    .orFail(() => new Error('NotValidId'))
    .then((users) => res.send({ data: users }))
    .catch((err) => {
      handleErr(err, res);
    });
};

module.exports.createUser = (req, res) => {
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      email: req.body.email,
      password: hash, // записываем хеш в базу
      name: req.body.name,
    }))
    .then(() => res.send({
      message: 'Успешный логин',
    }))
    .catch((err) => handleErr(err, res));
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then(() => {
      // создадим токен
      const token = jwt.sign({ _id: '610988832c854f0f68058a28' },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' });

      // вернём токен
      res.send({ token });
    })
    .catch((err) => {
      handleErr(err, res);
    });
};

module.exports.updateUser = (req, res) => {
  User.findByIdAndUpdate(req.user._id, { name: 'IceBear', about: 'Cool' }, { new: true, runValidators: true })
    .orFail(new Error('NotValidId'))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      handleErr(err, res);
    });
};
