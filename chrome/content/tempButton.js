window.addEventListener("load", function() {
    const buttonId = "wttr-temp-button";
    const button = document.getElementById(buttonId);
    if (!button) return;

    // Map wttr.in %C to local icons
    const iconMap = {
        "Clear": "chrome://tempbutton/skin/sunny.png",
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
        "Default": "chrome://tempbutton/skin/temp-icon-16.png"
    };

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

    // Initial update
    updateWeather();

    // Auto-refresh every 30 minutes
    setInterval(updateWeather, 30 * 60 * 1000);

    // Open wttr.in page on click
    button.addEventListener("command", () => {
    let url = "https://wttr.in/";
    let tabmail = window.opener || window; // SM navigator
    if (tabmail.gBrowser) {
        tabmail.gBrowser.selectedTab = tabmail.gBrowser.addTab(url);
    } else {
        window.open(url, "_blank");
    }
});
}, false);
