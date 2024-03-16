const mongoose = require("mongoose");

let movieSchema = mongoose.Schema({
  Title: { type: String, required: true },
  Director: {
    Name: String,
    Birth: String,
    Bio: String,
  },
  Genre: {
    Name: String,
    Description: String,
  },
  Description: { type: String },
});

let userSchema = mongoose.Schema({
  Username: { type: String, requiered: true },
  Email: { type: String, required: true },
  Birthday: { type: String },
  FavoriteMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Movie" }],
});

let Movie = mongoose.model("Movie", movieSchema);
let User = mongoose.model("User", userSchema);

module.exports.Movie = Movie;
module.exports.User = User;
