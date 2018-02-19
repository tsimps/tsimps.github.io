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
    var pathOpts = {'radius': allStops[i].Ridership * 1.5, 'fillColor': color};

    L.circleMarker([allStops[i].Latitude, allStops[i].Longitude], pathOpts)
      .bindPopup('Stop ID: ' + allStops[i].Stopid +  '   Stop Name: ' + allStops[i].Stop_Name +
      '   Ridership: ' + allStops[i].Ridership + '   Direction: ' + allStops[i].Direction +
      '   Shelter Status: ' + allStops[i].STATUS
    )
      .addTo(map);
  }
