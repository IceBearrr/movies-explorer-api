const { celebrate, Joi } = require('celebrate');

const router = require('express').Router();
const {
  getCurrentUsers,
  updateUser,
} = require('../controllers/users');

router.get('/me',
  celebrate({
    params: Joi.object().keys({
      userId: Joi.string().length(24),
    }),
  }), getCurrentUsers);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    password: Joi.string().min(2),
    name: Joi.string().required().min(2).max(20),
  }),
}), updateUser);

module.exports = router;
