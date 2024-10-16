import dotenv from "dotenv";

dotenv.config();

var url = process.env.url;
var appInfo = "PlantTempSurveilance https://github.com/Krissapter/TemperatureSurveilance";

//Makes the application run at a specific time and repeatedly call the function every 24 hours 
function runAtSpecificTimeOfDay(hour, func){
    const twentyfourhours = 86400000;
    var now = new Date();
    var millisTill10 = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, 0, 0, 0) - now;
    if(millisTill10 < 0){
        millisTill10 += twentyfourhours;
    }
    setTimeout(function() {
        func();
        setInterval(func, twentyfourhours);
    }, millisTill10);
}

//Fetches data from the weather API with a custom userAgent and adds all hours containing temperatures below certain tresholds to an array
async function getWeatherData(){
    let response = await fetch(url, {
        headers: {
            userAgent: appInfo
        }
    });
    let data = await response.json();

    var nineDayForecast = data.properties.timeseries

    var freezeTempsTime = [];
    var subTenTime = [];
    let i = 0;
    nineDayForecast.forEach(hour => {
        if(hour.data.instant.details.air_temperature < 10){
            if(hour.data.instant.details.air_temperature <= 0){
                freezeTempsTime[i] = hour.time;
            }else{
                subTenTime[i] = hour.time;
            }
            i++;
        }
    });
    if (freezeTempsTime.length >= 1){
        temperatureWarning(organizeColdDays(freezeTempsTime), 0);
    }else if(subTenTime.length >= 1){
        temperatureWarning(organizeColdDays(subTenTime), 10)
    }

    //TODO Set up notification system to send a mail if a set treshold is reached.
}

//Organizes the hours based on the date
function organizeColdDays(rawDays){
    let coldDays = rawDays.reduce((acc, e) => {
        let day = e.slice(0, 10);
        let time = e.slice(11, 16);
        acc[day] = acc[day] || [];
        acc[day].push(time);
        return acc;
    }, {});
    return coldDays;
}

//Gives readable input in console (currently)
function temperatureWarning(days, limit){
    let i = 0;
    var dayArr = Object.keys(days);
    dayArr.forEach(day => {
        if (days[day].length > 4){
            i++;
        }
    });
    console.log("\nThe next 11 days may contain " + dayArr.length + " days below "+ limit + "°C, starting with " + dayArr[0] + ".\n" + i +" of these are within the next 72 hours, and has a high probability of being below " + limit + "°C. \nConsider taking action for less hardy plants.");
}
runAtSpecificTimeOfDay(10, getWeatherData);