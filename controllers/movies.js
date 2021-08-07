const { handleErr } = require('./errors');

const Movie = require('../models/movie');
const AuthError = require('../middlewares/errors/auth-err');

module.exports.getMovies = (req, res) => {
  Movie.find({})
    .then((movies) => res.send({ data: movies }))
    .catch((err) => {
      handleErr(err, res);
    });
};

module.exports.createMovies = (req, res) => {
  const {
    country, director, duration, year, description, image, trailer, thumbnail,
    movieId, nameRU, nameEN,
  } = req.body;
  const owner = req.user._id;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
    owner,
  })
    .then((movie) => res.send({ data: movie }))
    .catch((err) => {
      handleErr(err, res);
    });
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .orFail(new Error('NotValidId'))
    .then((movie) => {
      if (movie.owner._id.toString() !== req.user._id) {
        Error('ForbiddenError');
      }
      return movie;
    })
    .then((movie) => {
      Movie.findOneAndRemove({ _id: movie._id })
        .then(() => {
          res.send({ message: 'Фильм удален' });
        })
        .catch(next);
    })
    .catch(() => {
      const error = new AuthError('ValidationError');
      handleErr(error, res);
    });
};
