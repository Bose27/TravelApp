// will be storing all the UI related data
let allData = {};

// get the length of the trip
const getLengthOfTrip = () => {
  const start = new Date(document.querySelector("#start").value);
  const end = new Date(document.querySelector("#end").value);
  const length = end.getTime() - start.getTime();
  allData.lengthOfTrip = length / (1000 * 60 * 60 * 24) + " days";
};

// get the number of days remaing for the trip
const getRemainingDaysOfTrip = () => {
  const start = new Date(document.querySelector("#start").value);
  const time = new Date();
  const remainingTimeToTrip = Math.ceil(start - time);
  allData.remainingTimeToTrip =
    Math.ceil(remainingTimeToTrip / (1000 * 60 * 60 * 24)) + " days";
};

// Container where the data will be updated on the UI
const containerDiv = document.querySelector("#entryHolder");

var el = document.querySelector("#form-submit");
document.addEventListener("DOMContentLoaded", function () {
  el.addEventListener("submit", getTripData, false);
});

// to validate the form values and process accordingly
const getTripData = async () => {
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
    document.querySelector("#form-submit").innerHTML = "Fetching data...";
    await getFormData();
    getRemainingDaysOfTrip();
    getLengthOfTrip();
    document.querySelector("#form-submit").innerHTML = "Submit";
    updateUI();
  } else {
    document.querySelector("#status").innerHTML = "Please enter correct values";
    setTimeout(() => {
      document.querySelector("#status").innerHTML = "";
    }, 2500);
  }
};
const getFormData = async () => {
  const city = document.querySelector("#destination").value;
  // getting the lat and lang for the input city value
  console.log(city);
  await fetch(`http://localhost:3001/getLatLang?city=${city}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
  })
    .then((res) => res.json())
    .then(async (res) => {
      allData.country = res.countryName;
      allData.city = res.name;
      allData.population = res.population;
      await getWeather(
        `http://localhost:3001/getWeather?lat=${res.lat}&long=${res.lng}`
      );
    })
    .catch((err) => {
      console.log(err);
    });
};

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
      allData.temperature = res.data[0].temp;
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
      allData.remainingTimeToTrip;
    document.querySelector("#result-tripLength").innerHTML =
      allData.lengthOfTrip;
  } catch (error) {
    console.log("error", error);
  }
};

function init() {
  // Clear forms here
  document.querySelector("#city-img").value = "";
  document.querySelector("#result-temp").value = "";
  document.querySelector("#result-timeRemaining").value = "";
}

window.onload = init;

export { getTripData };
