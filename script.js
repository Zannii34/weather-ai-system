const apiKey = "YOUR_API_KEY";
let currentUnit = "metric";

document.getElementById("city").addEventListener("keypress", function(e) {
    if (e.key === "Enter") getWeather();
});

async function getWeather(cityInput = null) {
    const city = cityInput || document.getElementById("city").value;
    if (!city) return;

    document.getElementById("loading").classList.remove("hidden");

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${currentUnit}&appid=${apiKey}`;

    try {
        const res = await fetch(url);
        const data = await res.json();

        if (data.cod == 200) {
            displayWeather(data);
            changeBackground(data.weather[0].main);
        } else {
            alert("City not found");
        }
    } catch {
        alert("Error fetching weather");
    }

    document.getElementById("loading").classList.add("hidden");
}

function displayWeather(data) {
    document.getElementById("weatherBox").classList.remove("hidden");

    document.getElementById("cityName").innerText = data.name;
    document.getElementById("temp").innerText =
        `${data.main.temp}° ${currentUnit === "metric" ? "C" : "F"}`;
    document.getElementById("condition").innerText =
        data.weather[0].description;
    document.getElementById("wind").innerText =
        `Wind: ${data.wind.speed}`;

    document.getElementById("icon").src =
        `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

    generateAdvice(data.main.temp, data.weather[0].main);
}

function generateAdvice(temp, condition) {
    let advice = "";

    if (temp < 10) advice = "🥶 Freezing cold — stay warm!";
    else if (temp < 20) advice = "🧥 Light jacket recommended.";
    else if (temp < 30) advice = "😎 Perfect weather for soccer ⚽";
    else advice = "🔥 Stay hydrated!";

    if (condition.includes("Rain")) {
        advice += " ☔ Take an umbrella!";
    }

    document.getElementById("aiAdvice").innerText = advice;
}

function toggleTheme() {
    document.body.classList.toggle("dark");
}

function toggleUnit() {
    currentUnit = currentUnit === "metric" ? "imperial" : "metric";
    getWeather();
}

function saveCity() {
    const city = document.getElementById("city").value;
    if (!city) return;

    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    if (!favorites.includes(city)) {
        favorites.push(city);
        localStorage.setItem("favorites", JSON.stringify(favorites));
    }

    displayFavorites();
}

function displayFavorites() {
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    const container = document.getElementById("favorites");
    container.innerHTML = "";

    favorites.forEach(city => {
        container.innerHTML +=
            `<span onclick="getWeather('${city}')">⭐ ${city}</span>`;
    });
}

function changeBackground(condition) {
    if (condition.includes("Rain")) {
        document.body.style.background =
            "linear-gradient(135deg, #3a6073, #16222a)";
    } else if (condition.includes("Cloud")) {
        document.body.style.background =
            "linear-gradient(135deg, #757f9a, #d7dde8)";
    } else {
        document.body.style.background =
            "linear-gradient(135deg, #1e3c72, #2a5298)";
    }
}

displayFavorites();
