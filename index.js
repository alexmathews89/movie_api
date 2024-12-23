/**
 * Express is used to create and maintain web servers as well as manage HTTP requests.
 * Express is what will handle the HTTP requests: GET, POST, PUT, DELETE.
 */

const express = require("express"),
  bodyParser = require("body-parser"),
  morgan = require("morgan");
const app = express();

const mongoose = require("mongoose");
const Models = require("./models.js");

const cors = require("cors");
app.use(cors());

const { check, validationResult } = require("express-validator");

const Movies = Models.Movie;
const Users = Models.User;

mongoose.connect(
  process.env.CONNECTION_URI || "mongodb://localhost:27017/cfDB",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

app.use(bodyParser.json());

let auth = require("./auth")(app);

const passport = require("passport");
require("./passport");

// Cloud Computing additional imports
const {
  S3Client,
  ListObjectsV2Command,
  PutObjectCommand,
} = require("@aws-sdk/client-s3");

const s3Client = new S3Client({
  region: "us-west-2",
  endpoint: "http://localhost:4566",
  forcePathStyle: true,
});

const listObjectsParams = {
  Bucket: "my-cool-local-bucket",
};

app.get("/images", (req, res) => {
  listObjectsParams = {
    Bucket: IMAGES_BUCKET,
  };
  s3Client
    .send(new ListObjectsV2Command(listObjectsParams))
    .then((listObjectsResponse) => {
      res.send(listObjectsResponse);
    });
});

const fs = require("fs");
const fileUpload = require("express-fileupload");

app.post("/images", (req, res) => {
  const file = req.files.image;
  const fileName = req.files.image.name;
  const tempPath = `${UPLOAD_TEMP_PATH}/${fileName}`;
  file.mv(tempPath, (err) => {
    res.status(500);
  });
});

// Cloud Computing additional imports end here

app.use(morgan("common"));

app.get("/", (req, res) => {
  res.send("Welcome to myFlix app!");
});

app.get(
  "/movies",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Movies.find()
      .then((movies) => {
        res.status(201).json(movies);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

app.get(
  "/users",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Users.find()
      .then((users) => {
        res.status(201).json(users);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

app.get(
  "/movies/:Title",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Movies.findOne({ Title: req.params.Title })
      .then((movie) => {
        res.json(movie);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

app.get(
  "/movies/director/:directorName",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Movies.findOne({ "Director.Name": req.params.directorName })
      .then((movie) => {
        res.json(movie.Director);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

app.get(
  "/movies/genre/:genreName",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Movies.findOne({ "Genre.Name": req.params.genreName })
      .then((movie) => {
        res.json(movie.Genre);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

app.get(
  "/users/:Username",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Users.findOne({ Username: req.params.Username })
      .then((user) => {
        res.json(user);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

/**
 * check is a previously defined variable given the value of express-validator
 * express-validator is used here when a user registers an account, it checks if the user's updates
 * meet the app criteria and alerts the user if not.
 * @param {string}
 * @param {string}
 * @returns {string}
 */

app.post(
  "/users",
  [
    check("Username", "Username is requiered").isLength({ min: 5 }),
    check(
      "Username",
      "Username contains non alphanumeric characters - not allowed"
    ).isAlphanumeric(),
    check("Password", "Password is required").not().isEmpty(),
    check("Email", "Email does not appear to be valid").isEmail(),
  ],
  (req, res) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    let hashedPassword = Users.hashPassword(req.body.Password);
    Users.findOne({ Username: req.body.Username })
      .then((user) => {
        if (user) {
          return res.status(400).send(req.body.Username + "already exists");
        } else {
          Users.create({
            Username: req.body.Username,
            Email: req.body.Email,
            Password: hashedPassword,
            Birthday: req.body.Birthday,
          })
            .then((user) => {
              res.status(201).json(user);
            })
            .catch((error) => {
              console.error(error);
              res.status(500).send("Error: " + error);
            });
        }
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send("Error: " + error);
      });
  }
);

app.put(
  "/users/:Username",
  [
    check("Username", "Username is requiered").isLength({ min: 5 }),
    check(
      "Username",
      "Username contains non alphanumeric characters - not allowed"
    ).isAlphanumeric(),
    check("Password", "Password is required").not().isEmpty(),
    check("Email", "Email does not appear to be valid").isEmail(),
  ],
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    let hashedPassword = Users.hashPassword(req.body.Password);
    Users.findOneAndUpdate(
      { Username: req.params.Username },
      {
        $set: {
          Username: req.body.Username,
          Email: req.body.Email,
          Password: hashedPassword,
          Birthday: req.body.Birthday,
        },
      },
      { new: true }
    )
      .then((updatedUser) => {
        res.json(updatedUser);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

//app.post("/users/:Username/movies/:_id", (req, res) => {
//Users.findOneAndUpdate(
//{ Username: req.params.Username },
//{
//$addToSet: { FavoriteMovies: req.params._id },
//},
//{ new: true }
//)
//.then((updatedUser) => {
//res.json(updatedUser);
//})
//.catch((err) => {
//console.error(err);
//res.status(500).send("Error: " + err);
//});
//});

app.put(
  "/users/:Username/movies/:movieID",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Users.findOneAndUpdate(
      { Username: req.params.Username },
      { $push: { FavoriteMovies: req.params.movieID } },
      { new: true }
    ).then((user) => {
      res.status(201).json(user);
    });
  }
);

app.delete(
  "/users/:Username/movies/:movieID",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Users.findOneAndUpdate(
      { Username: req.params.Username },
      { $pull: { FavoriteMovies: req.params.movieID } },
      { new: true }
    ).then((user) => {
      res.status(201).json(user);
    });
  }
);

app.delete(
  "/users/:Username",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Users.findOneAndDelete({ Username: req.params.Username })
      .then((user) => {
        if (!user) {
          res.status(400).send(req.params.Username + " was not found");
        } else {
          res.status(200).send(req.params.Username + " was deleted.");
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

app.use(express.static("public"));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something Broke!");
});

const port = process.env.PORT || 8080;
app.listen(port, "0.0.0.0", () => {
  console.log("Your app is listening on Port " + port);
});
