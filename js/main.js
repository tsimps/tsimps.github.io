/* =====================
Main class to read and map bus shetlers
===================== */



var map = L.map("map", {
  center: [39.9522, -75.1639],
  zoom: 15
});

var Thunderforest_Transport = L.tileLayer('https://{s}.tile.thunderforest.com/transport/{z}/{x}/{y}.png?apikey=39079820db6845f79a313d7d4724e1a9', {
	attribution: '&copy; <a href="http://www.thunderforest.com/">Thunderforest</a>, &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
	apikey: '<your apikey>',
	maxZoom: 22
}).addTo(map);

// transfer geojson to a simple object with an array of bus stops
var allStops = [];
for (var i = 0; i < dat[0].features.length; i++ ) {
    allStops[i] = dat[0].features[i].properties;
}

// normalization function
//function(val, max, min) { return (val - min) / (max - min); }
//const norm = (val, max, min) => (val - min) / (max - min);
//const norm = (val, max, min) => Math.max(0, Math.min(1, (val-min) / (max-min)));


for (i = 0; i < allStops.length - 1; i++) {

    // Constructing the styling  options for our map
    if (allStops[i].STATUS === 'Replaced'){
      color = '#0000FF';
    } else if (allStops[i].STATUS === 'New') {
      color = '#00FF00';
    } else {
      color = '##FF0000';
    }

    // The style options
    //var pathOpts = {'radius': norm(allStops[i].Average_Bo, 100000, 1)*10, 'fillColor': color}; // working on scaling correctly
    var pathOpts = {'radius': allStops[i].Ridership * 1.75, 'fillColor': color};

    L.circleMarker([allStops[i].Latitude, allStops[i].Longitude], pathOpts)
      .bindPopup('Stop ID: ' + allStops[i].Stopid +  '   Stop Name: ' + allStops[i].Stop_Name +
      '   Ridership: ' + allStops[i].Average_Bo + '   Direction: ' + allStops[i].Direction +
      '   Shelter Status: ' + allStops[i].STATUS)
      .addTo(map);
  }
