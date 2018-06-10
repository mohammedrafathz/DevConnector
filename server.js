const express = require("express");
const mongoose = require("mongoose");
const bodyparser = require("body-parser");
const passport = require("passport");

const users = require("./routes/api/users");
const profile = require("./routes/api/profile");
const posts = require("./routes/api/posts");

const db = require("./config/keys").mongoURI;

const app = express();

//Body parser middleware
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());

//Using mongoose to connect to db
app.use;
mongoose
  .connect(db)
  .then(() => console.log("db connected successfully"))
  .catch(err => console.log(err));

//Init passport
app.use(passport.initialize());

//Configure passport
require("./config/passport")(passport);

//api routes
app.use("/api/users", users);
app.use("/api/profile", profile);
app.use("/api/posts", posts);

//Port Init
const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`server started at port ${port}`));
