window.addEventListener("load", function() {
    const buttonId = "wttr-temp-button";
    const button = document.getElementById(buttonId);
    if (!button) return;

    // Map wttr.in %C to local icons
    const iconMap = {
        "Clear": "chrome://tempbutton/skin/sunny.png",
        "Sunny": "chrome://tempbutton/skin/sunny.png",
        "Partly cloudy": "chrome://tempbutton/skin/partly-cloudy.png",
        "Cloudy": "chrome://tempbutton/skin/cloudy.png",
        "Overcast": "chrome://tempbutton/skin/overcast.png",
        "Mist": "chrome://tempbutton/skin/mist.png",
        "Fog": "chrome://tempbutton/skin/fog.png",
        "Patchy rain possible": "chrome://tempbutton/skin/rain.png",
        "Light rain": "chrome://tempbutton/skin/rain.png",
        "Heavy rain": "chrome://tempbutton/skin/heavy-rain.png",
        "Snow": "chrome://tempbutton/skin/snow.png",
        "Thunderstorm": "chrome://tempbutton/skin/thunder.png",
        "Light rain with thunderstorm": "chrome://tempbutton/skin/light-rain-with-thunderstorm.png",
        "Rain in vicinity": "chrome://tempbutton/skin/cloudy.png",
        "Default": "chrome://tempbutton/skin/temp-icon-16.png"
    };


/*

// Original (short) function - only temperature and sky

    function updateWeather() {
        fetch("https://wttr.in/?format=%t+%C")
            .then(resp => resp.text())
            .then(text => {
                let [temp, ...condArr] = text.trim().split(" ");
                let condition = condArr.join(" ");

                // Set label
                button.setAttribute("label", temp);

                // Set icon
                let icon = iconMap[condition] || iconMap["Default"];
                button.setAttribute("image", icon);
            })
            .catch(err => {
                button.setAttribute("label", "N/A");
                button.setAttribute("image", iconMap["Default"]);
                console.error("WTTR fetch failed:", err);
            });
    }
*/


/*
// A better version with more parameters, but with slicing

function updateWeather() {
    // Include temperature, condition, wind, pressure, humidity
    fetch("https://wttr.in/?M&format=%t+%C+%w+%P+%h")
        .then(resp => resp.text())
        .then(text => {
            // Split into parts
            let parts = text.trim().split(" ");
            let temp = parts[0];
            // The rest: condition, wind, pressure, humidity
            let condition = parts.slice(1, -3).join(" ");  // might be 1–2 words
            let wind = parts.slice(-3, -2)[0];
            let pressure = parts.slice(-2, -1)[0]; // e.g. "1026hPa"
            
            // Extract numeric part safely
            let pressureValue = parseFloat(pressure); // gives 1026
            let pressure_mmHg = (pressureValue * 0.75006).toFixed(1); // 769.8 mmHg
            
            let humidity = parts.slice(-1)[0];

            // Set label (temperature)
            button.setAttribute("label", temp);

            // Set icon
            let icon = iconMap[condition] || iconMap["Default"];
            button.setAttribute("image", icon);

            // Set tooltiptext (full summary)
            let tooltip = `Condition: ${condition}
Wind: ${wind}
Pressure: ${pressure_mmHg} mmHg
Humidity: ${humidity}`;
            button.setAttribute("tooltiptext", tooltip);
        })
        .catch(err => {
            button.setAttribute("label", "N/A");
            button.setAttribute("image", iconMap["Default"]);
            button.setAttribute("tooltiptext", "Unable to retrieve data from wttr.in");
            console.error("WTTR fetch failed:", err);
        });
}

*/


// Improved function with even more parameters and more portable

function updateWeather() {
  fetch("https://wttr.in/?M&format=%t|%C|%w|%P|%h|%m|%S|%s")
      .then(resp => resp.text())
      .then(text => {
          // Split by "|" into 8 fixed fields
          let [temp, condition, wind, pressure, humidity, moonphase, sunrise, sunset] = text.trim().split("|");

          // Convert pressure from hPa to mmHg (if numeric)
          let pressureValue = parseFloat(pressure);
          let pressure_mmHg = isNaN(pressureValue) ? pressure : (pressureValue * 0.75006).toFixed(1);

          // Set label (temperature)
          button.setAttribute("label", temp);

          // Set icon (optional: make sure condition normalization matches your iconMap)
          let icon = iconMap[condition] || iconMap["Default"];
          button.setAttribute("image", icon);
          
          //Trimming sunrise/sunset
          let sunrise_short = sunrise.substring(0,5);  // first 5 chars = "HH:MM"
          let sunset_short  = sunset.substring(0,5);

          // Build tooltip (multi-line summary)
          let tooltip = `Condition: ${condition}
Wind: ${wind}
Pressure: ${pressure_mmHg} mmHg
Humidity: ${humidity}
Sunrise: ${sunrise_short}
Sunset: ${sunset_short}
Moon: ${moonphase}`;
          button.setAttribute("tooltiptext", tooltip);
      })
      .catch(err => {
            button.setAttribute("label", "N/A");
            button.setAttribute("image", iconMap["Default"]);
            button.setAttribute("tooltiptext", "Unable to retrieve data from wttr.in");
            console.error("WTTR fetch failed:", err);
        });
}




    // Initial update
    updateWeather();

    // Auto-refresh every 30 minutes
    setInterval(updateWeather, 30 * 60 * 1000);

    // Open wttr.in page on click
    button.addEventListener("command", () => {
    let url = "https://wttr.in/?M";
    let tabmail = window.opener || window; // SM navigator
    if (tabmail.gBrowser) {
        tabmail.gBrowser.selectedTab = tabmail.gBrowser.addTab(url);
    } else {
        window.open(url, "_blank");
    }
});
}, false);
