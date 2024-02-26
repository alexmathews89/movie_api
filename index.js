const express = require("express"),
  morgan = require("morgan");
const app = express();

let topMovies = [
  {
    title: "Avatar",
    director: "James Cameron",
  },
  {
    title: "Lord of the Rings",
    director: "Peter Jackson",
  },
  {
    title: "Star Wars",
    director: "George Lucas",
  },
  {
    title: "Indiana Jones",
    director: "Steven Spielberg",
  },
  {
    title: "I Love You, Man",
    director: "John Hamburg",
  },
  {
    title: "The Mask of Zorro",
    director: "Martin Campbell",
  },
  {
    title: "Aliens",
    director: "James Cameron",
  },
  {
    title: "The Dark Kight",
    director: "Christopher Nolan",
  },
  {
    title: "Good Will Hunting",
    director: "Gus Vant Sant",
  },
  {
    title: "Jurassic Park",
    director: "Steven Spielberg",
  },
];

app.use(morgan("common"));

app.get("/movies", (req, res) => {
  res.json(topMovies);
});

app.get("/", (req, res) => {
  res.send("Welcome to myFlix app!");
});

app.use(express.static("public"));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something Broke!");
});

app.listen(8080, () => {
  console.log("Your app is listening on port 8080.");
});
