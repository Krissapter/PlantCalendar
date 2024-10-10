var appInfo = "PlantTempSurveilance https://github.com/Krissapter/TemperatureSurveilance";

var url = 'https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=59.5622&lon=10.3630';

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

    var freezTempsTime = [];
    var subTenTime = [];
    let i = 0;
    nineDayForecast.forEach(hour => {
        if(hour.data.instant.details.air_temperature < 10){
            if(hour.data.instant.details.air_temperature <= 0){
                freezTempsTime[i] = hour.time;
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
    
    console.log(subTenDay);
    
    //TODO Reduce freezeTempsTime like done with subTenTime


    //TODO Further expand on data processing for different temperature thresholds.
    //TODO Check if temp is below treshold in any of the days in the list

    //TODO Set up notification system to send a mail if a set treshold is reached.
}
runBullshit();
