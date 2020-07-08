// configuring env
const dotenv = require("dotenv");
dotenv.config();
console.log(process.env.USERNAME);

// Setup empty JS object to act as endpoint for all routes
projectData = {};

// Require Express to run server and routes
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios").default;
var URL = require("url").URL;
var URLSearchParams = require("url-search-params-polyfill");

// Start up an instance of app
const app = express();

/* Middleware*/
//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Cors for cross origin allowance
app.use(cors());

// Initialize the main project folder
app.use(express.static("dist"));

// Setup Server
app.get("/", function (req, res) {
  res.sendFile("dist/index.html");
  res.send(projectData);
});

app.post("/", function (req, res) {
  console.log(req.body);
  res.render("dist/index");
});

// using geoname API to fetch lat and lang coordinate
app.get("/getLatLang", (req, res) => {
  const url = `http://api.geonames.org/searchJSON?maxRows=10&operator=OR&q=${req.query.city}&name=${req.query.city}&username=${process.env.USERNAME}`;
  axios
    .get(url)
    .then((resp) => {
      res.send(JSON.stringify(resp.data.geonames[0]));
    })
    .catch((err) => {
      res.end(JSON.stringify({ err: "There was some error" }));
    });
});

// using weatherbit API to get the weather details of the place
app.get("/getWeather", (req, res) => {
  const url = `http://api.weatherbit.io/v2.0/current?lat=${req.query.lat}&lon=${req.query.long}&key=${process.env.WEATHERAPI}`;
  axios
    .get(url)
    .then((resp) => {
      res.send(JSON.stringify(resp.data));
    })
    .catch((err) => {
      res.end(JSON.stringify({ err: "There was some error" }));
    });
});

// using pixabay API to get image related to trip
app.get("/getCityPics", (req, res) => {
  const url = `http://pixabay.com/api/?key=${process.env.PIXABAYAPI}&q=${req.query.q}&image_type=photo`;
  axios
    .get(url)
    .then((resp) => {
      res.send(JSON.stringify(resp.data.hits[0]));
    })
    .catch((err) => {
      res.end(JSON.stringify({ err: "There was some error" }));
    });
});

app.listen(3001, function () {
  console.log("Example app listening on port 3001!");
});
