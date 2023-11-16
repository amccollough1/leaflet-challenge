function createMap(earthquake) {


    // Create the tile layer that will be the background of our map.
    let streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });


// Create a baseMaps object to hold the streetmap layer.
let baseMaps = {
    "Street Map": streetmap
  };   
  
// Create an overlayMaps object to hold the earthquake layer.
  let overlayMaps = {
    "Earthquakes": earthquake
  };  

  // Create the map object with options.
  let map = L.map("map", {
    center: [10, -100],
    zoom: 4,
    layers: [streetmap, earthquake]
  });

  //Creat a legend 
  let legend=L.control({
    position: "bottomright"
  });

  legend.onAdd=function(){
    let div =L.DomUtil.create("div", "legend");
    return div;
  };
// Add information to the legend
  legend.addTo(map);
  changeLegend();
}

function changeLegend(){
    document.querySelector(".legend").innerHTML = [
        "<p class='less-than-10'>-10-10</p>",
        "<p class='tenthru30'>10-30</p>",
        "<p class='thirtythru60'>30-60</p>",
        "<p class='sixtythru70'>60-70</p>",
        "<p class='seventythru90'>70-90 </p>",
        "<p class='ninetyplus'>90+ </p>"
      ].join("");
  }


  function colorMarkers(value){
    let color ="#0071BC";

    if(value > 10 && value <= 30){
        color = "#35BC00";
    }
    else if(value > 30 && value <= 60){
        color = "#BCBC00";
    }
    else if(value > 60 && value <= 70){
        color = "#BC3500";
    }
    else if(value > 70 && value <= 90){
        color = "#BC0000";
    }
    else if(value > 90){
        color = "#E2FFAE";
    }

    return color;
}

function createMarkers(response) {
  
    // Pull the "earthquakes" properly from response.data.
    let earthquakes = response.features;
    
    // Initialize an array to hold earthquake markers.
    let earthquakeMarkers = [];
  
    // Loop through the earthquake array.
    for (let index = 0; index < earthquakes.length; index++) {
    
      // For each earthquake, create a marker, and bind a popup with the earthquakes pin.
      let quakeMarker = L.circle([earthquakes[index].geometry.coordinates[1], [earthquakes[index].geometry.coordinates[0]]],{
        fillColor: colorMarkers(earthquakes[index].geometry.coordinates[2]),
        radius : earthquakes[index].properties.mag * 10000,
        weight: 0.75,
        color: "black"
      })
        .bindPopup("<h3>Place:" + earthquakes[index].properties.place + "</h3><h3>Magnitude: " + earthquakes[index].properties.mag + 
        "</h3><h3>Location: [" + earthquakes[index].geometry.coordinates[1] + ", "+earthquakes[index].geometry.coordinates[0]+"]</h3><h3>Depth: "+earthquakes[index].geometry.coordinates[2]+"</h3>");
  
      // Add the marker to the earthquake array.
      earthquakeMarkers.push(quakeMarker);
    }
    createMap(L.layerGroup(earthquakeMarkers));
}
// Perform an API call to the Citi Bike API to get the station information. Call createMarkers when it completes.
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(createMarkers);