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
