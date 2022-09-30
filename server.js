const path = require('path')
const express = require('express')
const cors = require('cors')
const mongoose = require("mongoose");
const passport = require("passport");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const methodOverride = require("method-override");
const flash = require("express-flash");
const logger = require("morgan");
const connectDB = require("./config/database");
const mainRoutes = require("./routes/main");
const postRoutes = require("./routes/posts");
const commentRoutes = require("./routes/comments");


const app = express()

//load env variables
require("dotenv").config({ path: './config/config.env' });

// Passport config
require("./config/passport")(passport);

//Connect To Database
connectDB();

//Using EJS for views
app.set("view engine", "ejs");

//Static Folder
app.use(express.static("public"));

//Logging
app.use(logger("dev"));

//body parser
app.use(express.urlencoded({ extended: true }));
app.use(express.json())

//enable cors
app.use(cors())

//Use forms for put / delete
app.use(methodOverride("_method"));

// Setup Sessions - stored in MongoDB
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.DB_STRING }),
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

//Use flash messages for errors, info, ect...
app.use(flash());


// Routes
app.use("/", mainRoutes);
app.use("/post", postRoutes);
app.use("/comment", commentRoutes);
app.use('/api/v1/stores', require('./routes/stores'));

const PORT = process.env.PORT || 5000

app.listen(PORT, ()=> console.log(`server running in ${process.env.NODE_ENV} mode on port ${PORT}`))