# movies-explorer-api

api.icebear-movies.nomoredomains.club - бэк часть 84.201.141.130

API сервиса поиска фильмов

Auth

POST /signup - создание пользователя с переданными данными: name, email, password
POST /signin - проверяет переданные email и password и возвращает JWT-token
man User
GET /users/me - возвращает информацию о пользователе (name и email)
PATCH /users/me - обновляет данные пользователя (name и email)

Movies

GET /movies - возвращает сохраненные пользователем фильмы
POST /movies - создаёт фильм с переданными данными: country, director, duration, year, description, image, trailer, movieId, nameRU, nameEN и thumbnail
DELETE /movies/movieId - удаляет сохранённый фильм по ID


Технологии

Node.js
Express.js
MongoDB
Rest API
nginx
