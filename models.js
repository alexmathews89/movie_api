const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

/**
 * mongoose is a object document mapper which stores the movie and user data
 * @param {object}
 * @returns {object}
 *
 */

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
  Actors: [String],
  ImagePath: String,
  Featured: Boolean,
});

let userSchema = mongoose.Schema({
  Username: { type: String, required: true },
  Password: { type: String, required: true },
  Email: { type: String, required: true },
  Birthday: { type: Date },
  FavoriteMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Movie" }],
});

userSchema.statics.hashPassword = (password) => {
  return bcrypt.hashSync(password, 10);
};

userSchema.methods.validatePassword = function (password) {
  return bcrypt.compareSync(password, this.Password);
};

let Movie = mongoose.model("Movie", movieSchema);
let User = mongoose.model("User", userSchema);

module.exports.Movie = Movie;
module.exports.User = User;
