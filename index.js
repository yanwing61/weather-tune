//import required modules
const express = require("express");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config();
const weather = require("./modules/api");
const music = require("./modules/api");
const { request } = require("http");

//set up Express app
const app = express();
const port = process.env.PORT || 3000;

//define important folders
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
//setup public folder
app.use(express.static(path.join(__dirname, "public")));

//PAGE ROUTES
app.get("/", async (request, response) => {
  response.render("index", { title: "Welcome" });
});

let weatherData = null;

app.get("/weather", async (request, response) => {
  const city = request.query.city;
  weatherData = await weather.getWeather(city);
  console.log(weatherData);
  response.render("weather", { title: "weather", weather: weatherData });
});

app.get("/music", async (request, response) => {
  let musicData = await music.getMusic(weatherData);
  //console.log(musicData);
  response.render("music", { title: "music", music: musicData });
});


//set up server listening
app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});


