const { handleErr } = require('./errors');

const Movie = require('../models/movie');

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

module.exports.deleteMovie = (req, res) => {
  Movie.findById(req.params.movieId)
    .orFail(new Error('NotValidId'))
    .then((movie) => {
      if (movie.owner._id.toString() !== req.user._id) {
        Error('ForbiddenError');
      } else {
        movie.remove();
        res.status().send({ message: 'Фильм удален' });
      }
    })
    .catch((err) => {
      handleErr(err, res);
    });
};
