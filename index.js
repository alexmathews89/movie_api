const express = require("express"),
  bodyParser = require("body-parser"),
  morgan = require("morgan");
const app = express();

app.use(bodyParser.json());

let topMovies = [
  {
    title: "Avatar",
    director: "James Cameron",
    genre: "Science Fiction",
  },
  {
    title: "Lord of the Rings",
    director: "Peter Jackson",
    genre: "Fantasy",
  },
  {
    title: "Star Wars",
    director: "George Lucas",
    genre: "Science Fiction",
  },
  {
    title: "Indiana Jones",
    director: "Steven Spielberg",
    genre: "Action",
  },
  {
    title: "I Love You, Man",
    director: "John Hamburg",
    genre: "Comedy",
  },
  {
    title: "The Mask of Zorro",
    director: "Martin Campbell",
    genre: "Action",
  },
  {
    title: "Aliens",
    director: "James Cameron",
    genre: "Science Fiction",
  },
  {
    title: "The Dark Kight",
    director: "Christopher Nolan",
    genre: "Action",
  },
  {
    title: "Good Will Hunting",
    director: "Gus Vant Sant",
    genre: "Drama",
  },
  {
    title: "Jurassic Park",
    director: "Steven Spielberg",
    genre: "Action",
  },
];

app.use(morgan("common"));

app.get("/movies", (req, res) => {
  res.json(topMovies);
});

app.get("/", (req, res) => {
  res.send("Welcome to myFlix app!");
});

app.get("/movies/:Title", (req, res) => {
  const Title = req.params.Title;
  const movie = topMovies.find((movie) => movie.title === Title);

  if (movie) {
    res.status(200).json(movie);
  } else {
    res.status(400).send("no such movie");
  }
});

app.get("/movies/genre/:genreName", (req, res) => {
  const genreName = req.params.genreName;
  const genre = topMovies.find((movie) => movie.genre === genreName);

  if (genre) {
    res.status(200).json(genre);
  } else {
    res.status(400).send("no such genre");
  }
});

app.get("/movies/director/:directorName", (req, res) => {
  const directorName = req.params.directorName;
  res.send("Will send info on " + directorName + " as a director");
});

app.post("/users", (req, res) => {
  res.send("User Registration Page");
});

app.put("/users/:username", (req, res) => {
  const username = req.params.username;
  res.send("Will allow " + username + " to updated their information");
});

app.put("/users/:username/movies/:movieID", (req, res) => {
  const username = req.params.username;
  const movie = req.params.movieID;
  res.send(
    "Will allow " + username + " to add a " + movie + "to their favorites"
  );
});

app.delete("/users/:username/movies/:movieID", (req, res) => {
  const username = req.params.username;
  const movie = req.params.movieID;
  res.send(
    "Will allow " + username + " to remove a " + movie + " from their favorites"
  );
});

app.delete("/users/:username", (req, res) => {
  const username = req.params.username;
  res.send("Will allow " + username + " to remove their information");
});

app.use(express.static("public"));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something Broke!");
});

app.listen(8080, () => {
  console.log("Your app is listening on port 8080.");
});
