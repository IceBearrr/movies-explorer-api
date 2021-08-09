const { celebrate, Joi } = require('celebrate');

const router = require('express').Router();
const {
  getMovies,
  createMovies,
  deleteMovie,
} = require('../controllers/movies');

router.get('/', getMovies);

router.post('/', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required(),
    trailer: Joi.string().required(),
    thumbnail: Joi.string().required(),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
}), createMovies);

router.delete('/:movieId',
  celebrate({
    params: Joi.object().keys({
      movieId: Joi.string().length(24).hex(),
    }),
  }), deleteMovie);

module.exports = router;
