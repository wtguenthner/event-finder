var apiKey = "TcnFtVJuGcgL3ubSuuGQMpjlZcPwVVqZ"
var eventSubmit = document.querySelector(".event");

function handleSearch() {
    var info = document.getElementById('infoDisplay');
    var city = document.querySelector('#cityInput').value;
    var genre = document.querySelector('#genreInput').value;
    // var family = document.querySelector('#familyInput').value;
    var day = document.querySelector('#dayInput').value;
    var year = document.querySelector('#yearInput').value;
    var month = document.querySelector('#monthInput').value;
    var radius = document.querySelector('#radiusInput').value;

    // Resets the right side info text area when another event is searched
    info.innerHTML = `<br><u>Event Info</u>`

    // API fetch
    let url = `https://app.ticketmaster.com/discovery/v2/events.json?size=9&sort=date,asc&city=${city}&radius=${radius}&startDateTime=${year}-${month}-${day}T14:00:00Z&classificationName=${genre}&l&apikey=${apiKey}`

    fetch(url).then(data => data.json()).then(data => {

        jsonData = data;
        displayEvents(jsonData);
    })
}

function displayEvents(jsonData) {
    //This element begins as display: none. Changes it to flex when submit button is pressed
    document.getElementById("eventList").style.display = "flex";

    var eventHeader = document.querySelector('#eventHeader')
    var city = document.querySelector('#cityInput').value;
    var genre = document.querySelector('#genreInput').value;

    //Changes the event header to the user's city and genre selection
    if (genre == "Musicals") {
        eventHeader.innerHTML = `<u>${city} ${genre}</u>`;
    } else {
        eventHeader.innerHTML = `<u>${city} ${genre} Events</u>`;
    }

    for (var x = 0; x < 9; x++) {

        //Targets the text area for the corresponding event 
        var eventDisplay = document.querySelector(`#event${x + 1}`);

        //Sets array for the date to rearrange it to be in mm/dd/yyyy format
        var arr = jsonData._embedded.events[x].dates.start.localDate.split("-");
        var date = `${arr[1]}-${arr[2]}-${arr[0]}`;

        // Generates each listed event
        eventDisplay.innerHTML = `<button class="saveButton">Save</button>`
        eventDisplay.innerHTML += `<p class="eventDisplay">${jsonData._embedded.events[x].name}</p>`
        eventDisplay.innerHTML += `<p class="eventDisplay">${date}</p>`
        eventDisplay.innerHTML += `<p class="eventImage"><img height="auto" width="200" src="${jsonData._embedded.events[x].images[0].url}"></p><br>`;
        // eventDisplay.innerHTML += `<p class = "eventTickets"><a href=${jsonData._embedded.events[x].url}>Buy Tickets</a></p></button>`;
        eventDisplay.innerHTML += `<span class="setBottom"><span class = "eventTickets"><a href=${jsonData._embedded.events[x].url}>Buy Tickets</a><button class="infoButton" value = "${x}" onclick="displayData(this.value)">Info</button></span></span>`

    }

}

// Function for display info on the right side of screen
function displayData(value) {

    var x = value
    var info = document.getElementById('infoDisplay');
    var venue = jsonData._embedded.events[x]._embedded.venues[0].name
    var name = jsonData._embedded.events[x].name
    var minPrice = jsonData._embedded.events[x].priceRanges[0].min;
   var maxPrice = jsonData._embedded.events[x].priceRanges[0].max
   
    info.innerHTML = `<p><b>` + name + `</b></p>`
    info.innerHTML += `<p><u>Venue</u> <br>` + venue + `</p>`
    info.innerHTML += `<p><u>Price Range</u><br>$` + minPrice + ` to ` + `$` + maxPrice + `</p>`

}

// Set global variables
let userLat;
let userLon;

// Get user's location by lat long
let positionSuccess = (position) => {
    userLat = position.coords.latitude;
    userLon = position.coords.longitude;
    generateMap(userLat, userLon);
    addUserMarker(userLat, userLon);
    console.log(`User's position is: Lat: ${userLat}, Lon: ${userLon}`);
};
let positionError = (err) => {
    console.log(err.code);
};
navigator.geolocation.getCurrentPosition(positionSuccess, positionError);

// Generate map
let generateMap = (userLat, userLon) => {
    map = L.map('map').setView([userLat, userLon], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap'
    }).addTo(map);
};
// Generate user location marker
let addUserMarker = (userLat, userLon) => {
    L.marker([userLat, userLon]).addTo(map);
};


