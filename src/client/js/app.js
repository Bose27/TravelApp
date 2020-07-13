// will be storing all the UI related data
let allData = {};
const fetch = require("node-fetch");

var el = document.querySelector("#form-submit");
document.addEventListener("DOMContentLoaded", function () {
  el.addEventListener("submit", getTripData, false);
});

// to validate the form values and process accordingly
async function getTripData(e) {
  event.preventDefault();
  const destination = document.querySelector("#destination").value;
  const start = document.querySelector("#start").value;
  const end = document.querySelector("#end").value;
  const startDate = new Date(start);
  const endDate = new Date(end);

  if (
    start.length !== 0 &&
    end.length !== 0 &&
    destination.length !== 0 &&
    endDate - startDate >= 0
  ) {
    document.querySelector("#form-submit").innerHTML = "Loading data...";
    const city = document.querySelector("#destination").value;
    // getting the lat and lang for the input city value
    await fetch(`http://localhost:3001/getLatLang?city=${city}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
    })
      .then((res) => res.json())
      .then(async function (res) {
        allData.country = res.countryName;
        allData.city = res.name;
        allData.population = res.population;
        await getWeather(
          `http://localhost:3001/getWeather?lat=${res.lat}&lng=${res.lng}`
        );
      })
      .catch((err) => {
        console.log(err);
      });

    allData.remainingDaysToTrip = getRemainingDaysOfTrip();
    allData.durationOfTrip = getDurationOfTrip();
    document.querySelector("#form-submit").innerHTML = "Submit";
    updateUI();
  } else {
    document.querySelector("#status").innerHTML = "Please enter correct values";
    setTimeout(() => {
      document.querySelector("#status").innerHTML = "";
    }, 2500);
  }
}

// to get weather using the lat and lang values
const getWeather = async (url) => {
  await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
  })
    .then((res) => res.json())
    .then(async (res) => {
      allData.temperature = res.data[0].temp + " degree celsius";
      allData.weatherDesc = res.data[0].weather.description;
      await getCityPics(`http://localhost:3001/getCityPics?q=${allData.city}`);
    })
    .catch((err) => {
      console.log(err);
    });
};

// to get the pics related to city name entered
const getCityPics = async (url) => {
  await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
  })
    .then((res) => res.json())
    .then((res) => {
      allData.img = res.webformatURL;
    })
    .catch((err) => {
      console.log(err);
    });
};

const updateUI = () => {
  try {
    document.querySelector("#city-img").setAttribute("src", allData.img);
    document.querySelector("#result-city").innerHTML = allData.city;
    document.querySelector("#result-temp").innerHTML = allData.temperature;
    document.querySelector("#result-weather").innerHTML = allData.weatherDesc;
    document.querySelector("#result-population").innerHTML = allData.population;
    document.querySelector("#result-timeRemaining").innerHTML =
      allData.remainingDaysToTrip;
    document.querySelector("#result-tripLength").innerHTML =
      allData.durationOfTrip;
  } catch (error) {
    console.log("error", error);
  }
};

// get the number of days remaing for the trip
const getRemainingDaysOfTrip = () => {
  const start = new Date(document.querySelector("#start").value);
  const time = new Date();
  const remainingDaysToTrip = days_between(start.getTime(), time.getTime());
  return remainingDaysToTrip;
};

// get the length of the trip
const getDurationOfTrip = () => {
  const start = new Date(document.querySelector("#start").value);
  const end = new Date(document.querySelector("#end").value);
  const durationOfTrip = days_between(start.getTime(), end.getTime());
  return durationOfTrip;
};

function days_between(date1, date2) {
  // The number of milliseconds in one day
  const ONE_DAY = 1000 * 3600 * 24;
  // Calculate the difference in milliseconds
  const differenceInTime = Math.abs(date2 - date1);
  console.log(differenceInTime);
  // Convert back to days and return
  return Math.round(differenceInTime / ONE_DAY);
}

function init() {
  // Clear forms here
  document.querySelector("#city-img").value = "";
  document.querySelector("#result-city").innerHTML = "";
  document.querySelector("#result-temp").value = "";
  document.querySelector("#result-timeRemaining").value = "";
  document.querySelector("#result-population").innerHTML = "";
  document.querySelector("#result-timeRemaining").innerHTML = "";
  document.querySelector("#result-tripLength").innerHTML = "";
}

window.onload = init;

export { getTripData };
