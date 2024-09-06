# movie_api

# movie_api

# movie_api

# movie_api

# movie_api

This project defines the endpoints and methods for both versions of the myFlix application - one version created with React and the other created with Angular. It also defines the datebase where all user and movie information is stored on MongoDB whereas the methods and endpoints mentioned are uploaded to Heroku. This API is also used to authenticate users.

The methods and endpoints mentioned above include:

/movies - GET a list of all movies.

/users - Allows a user to register an account using the POST method.

/login - allows a user to login to their account using the POST method.

/movies/movieTitle - allows a user to GET information on a single movie by its title.

/movies/director/movieDirectorName - allows a user to GET information on movies by their director.

/movies/genre/movieGenreName - allows a user to GET information on movies by their genre.

/users - allows a user to GET informaion on their profile.

/users/${user.Username}/movies/movieID - allows a user to add a movie to their list of favorites using the PUT method.

/users/${user.Username}/movies/movieID - allows a user to remove a movie from their list of favorites using the DELETE method.

/users/${user.Username} - allows a user to update their information using the PUT method.

/users/${user.Username} - allows a user to DELETE their information.

Techologies used:

- NODE

- body-parser

- cors

- express

- express-validator

* jsonwebtoken

* mongoose

* morgan

* passport

* passport-jwt

* passport-local
