/* =====================
hello world
===================== */
var map = L.map("map", {
  center: [39.9522, -75.1639],
  zoom: 15
});
var Stamen_TonerLite = L.tileLayer(
  "http://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}.{ext}",
  {
    attribution:
      'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    subdomains: "abcd",
    minZoom: 0,
    maxZoom: 20,
    ext: "png"
  }
).addTo(map);

//var geojsonLayer = new L.GeoJSON.AJAX("data/dat.geojson");

/*
var councilDistrict1 = geojsonLayer.refilter(function(feature) {
  return feature.properties.City_Counc === 1;
});
*/

// dat[0].features[0].properties.Stopid


/*
var geojsonMarkerOptions = {
    radius: 8,
    fillColor: "#ff7800",
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
};
*/

//geojsonLayer.addTo(map);

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
    var pathOpts = {'radius': allStops[i].Ridership * 2,
                    'fillColor': color};
    L.circleMarker([allStops[i].Latitude, allStops[i].Longitude], pathOpts)
      .bindPopup('Stop ID: ' + allStops[i].Stopid, 'Stop Name: ' + allStops[i].Stop_Name)
      .addTo(map);
  }
