var appInfo = "PlantTempSurveilance https://github.com/Krissapter/TemperatureSurveilance";

var url = 'https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=55.4514&lon=37.3715';

//TODO Transition from running as a script to like a server.
//TODO Make the application run the fetch using setTimeout
var now = new Date();
var millisTill10 = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 10, 0, 0, 0) - now;

//TODO Actual function names and stuff
async function runBullshit(){
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

    const subTenDay = subTenTime.reduce((acc, e) => {
        let day = e.slice(0, 10);
        let time = e.slice(11, 16);
        acc[day] = acc[day] || [];
        acc[day].push(time);
        return acc;
    }, {});
    
    //console.log(subTenDay);
    
    const freezeTempDay = freezeTempsTime.reduce((acc, e) => {
        let day = e.slice(0, 10);
        let time = e.slice(11, 16);
        acc[day] = acc[day] || [];
        acc[day].push(time);
        return acc;
    }, {});

    //TODO Further expand on data processing for different temperature thresholds.

    tenDegreeLimit(subTenDay);
    //TODO Set up notification system to send a mail if a set treshold is reached.
}

//TODO Check if temp is below treshold in any of the days in the list

//Some plants are generally hardy down to only 10°C
function tenDegreeLimit(days){
    let i = 0;
    var dayArr = Object.keys(days);
    dayArr.forEach(day => {
        if (days[day].length > 4){
            i++;
        }
    });
    console.log("\nThe next 11 days may contain " + dayArr.length + " days below 10°C, starting with " + dayArr[0] + ".\n" + i +" of these are within the next 3 days, and has a high probability of being below 10°C. \nConsider taking action for less hardy plants.");
}
runBullshit();
