const ApiKey = "3e4fb69af6797d685c7116ec94759400";
const ApiKey2 = "7883da2ab61590f053d19bf9490a98fe";
let today = new Date().toLocaleDateString();
let inputField = document.getElementById("userInput")
let currentWeatherCard = document.getElementById("currentWeatherCard");
let citySearch = document.getElementById("citySearch");
let fiveCardDiv = document.getElementById("fiveCardDiv")
let buttonRow = document.getElementById("dynamicBtns")


function deleteLoglevel(){
    localStorage.removeItem("loglevel")
}
deleteLoglevel()

function pullFromLS(){
    deleteLoglevel()
    buttonRow.innerHTML = ""
    let lostArray = Object.values(window.localStorage)
    for (let i = 0; i < lostArray.length; i++) {
        const savedCityNam = lostArray[i];
        
        //creating the node elements for the buttons
        let blockDiv = document.createElement("div")
        let blockBtn = document.createElement("button")
        let deleteBtn = document.createElement("input")
        
        //setting the attributes for each created element
        blockBtn.setAttribute("style", "text-align: left")
        blockDiv.setAttribute("class", "d-grid gap-2")
        blockBtn.setAttribute("class", "btn btn-outline-dark")
        deleteBtn.setAttribute("id", "deleteButton")
        deleteBtn.setAttribute("style", "text-align: right")
        deleteBtn.setAttribute("type", "button")
        deleteBtn.setAttribute("value", "x")
        
        //appending the created node elements to the page
        buttonRow.appendChild(blockDiv)
        blockDiv.appendChild(blockBtn)
        blockBtn.innerHTML = savedCityNam
        blockBtn.appendChild(deleteBtn)

        deleteBtn.addEventListener("click", function(e){
            deleteLoglevel()
            e.stopPropagation()
            localStorage.removeItem(savedCityNam.slice(0,3))
            pullFromLS()  
            resize()
        })
        blockBtn.addEventListener("click", function(e){
            e.preventDefault()
            deleteLoglevel()
            renderTheWeather(savedCityNam)
            
        })
    }}
    pullFromLS()
    
function resize(){
    let lostArray = Object.values(window.localStorage)
    if(window.innerWidth > 900 && lostArray.length < 3){
            fiveCardDiv.setAttribute("style", "margin-top: 15px")
    }
    else if(window.innerWidth > 900 && lostArray.length === 3  ){
            fiveCardDiv.setAttribute("style", "margin-top: 0px")
    }
    else if(window.innerWidth > 900 && lostArray.length > 3  ){
            let marginNum = (lostArray.length  - 3) * -41
            fiveCardDiv.setAttribute("style", "margin-top: " + marginNum + "px")
    }
        
    else if(window.innerWidth < 900){
            fiveCardDiv.setAttribute("style", "margin-top: 0")
    }

}

    
citySearch.addEventListener("click", function(event){
event.preventDefault()
let userInput = document.getElementById('userInput').value
parUserIn = (document.getElementById('userInput').value).slice(0,3)
localStorage.setItem(parUserIn, userInput)
renderTheWeather(userInput)

})

function renderTheWeather(savedCityNam){
    currentWeatherCard.innerHTML = ""
    fiveCardDiv.innerHTML = ""
    buttonRow.innerHTML = ""
    deleteLoglevel()
    pullFromLS()
    fetch('https://api.openweathermap.org/geo/1.0/direct?q=' + savedCityNam +' &limit=10&appid=' + ApiKey)
    .then(res => res.json())
    .then(response => fetch('https://api.openweathermap.org/data/2.5/weather?lat=' + response[0].lat + '&lon=' + response[0].lon 
    + '&appid=' + ApiKey)
    .then(res => res.json())
    .then(function(data){

        resize()
        window.onresize = function(){
            resize()
        }

        let cityName = data.name
        const icon = JSON.stringify(data.weather[0].icon).replace(/['"]+/g, '')
        const temperature = (((data.main.temp - 273.15) * (9/5)) + 32).toFixed(1)
        const humidity = data.main.humidity
        const windSpeed = data.wind.speed
        const pressure = (data.main.pressure/33.864).toFixed(2)
        

        //building the elements of the current weather card
        let cardDiv = document.createElement("div")
        let cardBodyDiv = document.createElement("div")
        let h3tag = document.createElement("h3")
        let imgtag = document.createElement("img")
        let temperatureDiv = document.createElement("div")
        let humidityDiv = document.createElement("div")
        let windSpeedDiv = document.createElement("div")
        let pressureDiv = document.createElement("div")
        let pressureSpan = document.createElement("span")
        let pressureSpanMeasurement = document.createElement("span")
        let mercurySpan = document.createElement("span")
        let fiveDayForcast = document.createElement("div")
        let h4tag = document.createElement("h4")


        //setting the elements their classes
        cardDiv.setAttribute("class", "card")
        cardBodyDiv.setAttribute("class", "card-body")
        h3tag.setAttribute("id", "cityTimeIcon")
        imgtag.setAttribute("src", "https://openweathermap.org/img/wn/" + icon + "@2x.png")
        imgtag.setAttribute("id", "iconImg")
        temperatureDiv.setAttribute("class", "row")
        temperatureDiv.setAttribute("id", "tempDiv")
        humidityDiv.setAttribute("class", "row")
        humidityDiv.setAttribute("id", "humDiv")
        windSpeedDiv.setAttribute("class", "row")
        windSpeedDiv.setAttribute("id", "windSpdDiv")
        pressureDiv.setAttribute("class", "row")
        pressureDiv.setAttribute("id", "pressDiv")
        fiveDayForcast.setAttribute("class", "row")
        h4tag.setAttribute("id", "h4tag")

        if(pressure < 30.20){
            pressureSpanMeasurement.setAttribute("class", "badge text-bg-primary")
            }
        else if(pressure > 30.20){
            pressureSpanMeasurement.setAttribute("class", "badge text-bg-danger")
        }    
        else if(pressure === 30.20){
            pressureSpanMeasurement.setAttribute("class", "badge text-bg-warning")
        }

        //appending the elements to the page
        currentWeatherCard.appendChild(cardDiv)
        cardDiv.appendChild(cardBodyDiv)
        cardBodyDiv.appendChild(h3tag)
        h3tag.appendChild(document.createTextNode(cityName))
        h3tag.appendChild(document.createTextNode("(" + today + ")"))
        h3tag.appendChild(imgtag)
        cardBodyDiv.appendChild(temperatureDiv)
        temperatureDiv.appendChild(document.createTextNode("Temperature: " + temperature + " " + "°F"))
        temperatureDiv.appendChild(humidityDiv)
        humidityDiv.appendChild(document.createTextNode("Humidity: " + humidity + "%"))
        humidityDiv.appendChild(windSpeedDiv)
        windSpeedDiv.appendChild(document.createTextNode("Wind Speed: " + windSpeed + " MPH"))
        windSpeedDiv.appendChild(pressureDiv)
        pressureDiv.appendChild(pressureSpan)
        pressureSpan.appendChild(document.createTextNode("Pressure: "))
        pressureSpan.appendChild(pressureSpanMeasurement)
        pressureSpanMeasurement.appendChild(document.createTextNode(pressure))
        pressureSpan.appendChild(mercurySpan)
        mercurySpan.appendChild(document.createTextNode(" inHg"))
        currentWeatherCard.appendChild(fiveDayForcast)
        fiveDayForcast.appendChild(h4tag)
        h4tag.appendChild(document.createTextNode("5-Day Forcast:"))

    }).then(fetch('https://api.openweathermap.org/data/2.5/forecast?lat=' + response[0].lat + '&lon=' + response[0].lon + '&appid=' + ApiKey)
    .then(res => res.json())
    .then(function(data){
        const weatherArrary = data.list

        for (let i = 0; i < 40; i++) {
            const targetedData = weatherArrary[i];
            if(targetedData.dt_txt.substring(11) === "18:00:00"){

                const date = targetedData.dt_txt.slice(5,10) + "-" + targetedData.dt_txt.slice(0,4)
                const icon = targetedData.weather[0].icon
                const temperature = (((targetedData.main.temp - 273.15) * (9/5)) + 32).toFixed(2)
                const humidity = targetedData.main.humidity

                //building the elements of the 5 day forcast weather cards
                let colmd = document.createElement("div")
                let fivecardprimary = document.createElement("div")
                let fiveCardBody = document.createElement("div")
                let h5tag = document.createElement("h5")
                let iconDiv = document.createElement("div")
                let imgtag = document.createElement("img")
                let temperatureDiv = document.createElement("div")
                let humidityDiv = document.createElement("div")
              
                //setting attributes to the 5 day forcast weather cards
                colmd.setAttribute("class", "col-md")
                fivecardprimary.setAttribute("class", "card text-bg-primary mb-3")
                fivecardprimary.setAttribute("style", "max-width: 18rem;")
                fiveCardBody.setAttribute("class", "card-body")
                h5tag.setAttribute("class", "card-title")
                iconDiv.setAttribute("class", "row")
                imgtag.setAttribute("src", "https://openweathermap.org/img/wn/" + icon + "@2x.png")
                imgtag.setAttribute("id", "fiveicon")
                temperatureDiv.setAttribute("class", "row")
                temperatureDiv.setAttribute("id", "temperatureDiv")
                humidityDiv.setAttribute("class", "row")
                humidityDiv.setAttribute("id", "humidityDiv5")

                //appending the data to the page
                fiveCardDiv.appendChild(colmd)
                colmd.appendChild(fivecardprimary)
                fivecardprimary.appendChild(fiveCardBody)
                fiveCardBody.appendChild(h5tag)
                h5tag.appendChild(document.createTextNode(date))
                fiveCardBody.appendChild(iconDiv)
                iconDiv.appendChild(imgtag)
                iconDiv.appendChild(temperatureDiv)
                temperatureDiv.appendChild(document.createTextNode("Temp: " + temperature + " ºF"))
                temperatureDiv.appendChild(humidityDiv)
                humidityDiv.appendChild(document.createTextNode("Humidity: " + humidity + "%"))
                inputField.value = ""
            } 
        }
    }))
    )
}


