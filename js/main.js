/* =====================
Main class to read and map bus shetlers
===================== */

// creat transit and aerial basemap versions to be controlled with boxes
var Thunderforest_Transport = L.tileLayer(
  "https://{s}.tile.thunderforest.com/transport/{z}/{x}/{y}.png?apikey=39079820db6845f79a313d7d4724e1a9",
  {
    attribution:
      '&copy; <a href="http://www.thunderforest.com/">Thunderforest</a>, &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    apikey: "39079820db6845f79a313d7d4724e1a9",
    maxZoom: 22
  }
);

var Esri_WorldImagery = L.tileLayer(
  "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
  {
    attribution:
      "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
  }
);

// set up the map; make transit basemap the default
var map = L.map("map", {
  center: [39.9522, -75.1639],
  zoom: 15,
  layers: [Thunderforest_Transport]
});
map.zoomControl.setPosition("bottomleft");

var jsonLink =
  "https://raw.githubusercontent.com/tsimps/tsimps.github.io/master/data/shelter_layer.geojson";

// transfer geojson to a simple object with an array of bus stops
var allStops = [];
for (var i = 0; i < dat[0].features.length; i++) {
  allStops[i] = dat[0].features[i].properties;
}

// normalization the ridership to scale the markers
normalize = val => {
  var x;
  if(isNaN(val)) { x = 2;}
  else {
    if (val < 10) {
      x = 3;
    } else {
      x = Math.sqrt(val);
    }
    //if (val > 10) {x = Math.sqrt(val);}
  }
  return x;
};

/* ============
CRITICAL:
L.circleMarker.bindPopup is only working in legacy Leaflet build 0.77
Unable to update to current Leaflet build. Unsure why this is a problem.
=============== */
var stops;

$.getJSON(jsonLink).done(function(data) {
  var json = data;
  //console.log("JSON", json);

  // create layer group of station markers
  stops = L.layerGroup(
    _.map(json.features, function(feature) {

      if (feature.properties.STATUS === "Replaced") {
        color = "#EC407A";
      } else if (feature.properties.STATUS === "New") {
        color = "#AB47BC";
      } else if (feature.properties.STATUS === "Existing") {
        color = "#9CCC65";
      } else {
        color = "#78909C";
      }

      var pathOpts = {
        //radius: allStops[i].Ridership * 1.75,
        radius: normalize(feature.properties.avg_boards),
        fillColor: color,
        stroke: false,
        fillOpacity: 0.8
      };


      return L.circleMarker( [feature.properties.Latitude, feature.properties.Longitude], pathOpts )
      .bindPopup(
        "<b> Stop ID: </b>" +
          feature.properties.Stopid +
          "<br><b>Stop Name: </b>" +
          feature.properties.Stop_Name +
          "<br><b>Spring '15-'17 Average Boardings Per Day: </b>" +
          Math.round(feature.properties.avg_boards) +
          "<br><b>Direction: </b>" +
          feature.properties.Direction +
          "<br><b>Shelter Status: </b>" +
          feature.properties.STATUS +
          "<br><b>Install Date: </b>" +
          feature.properties["INSTALL DATE"] +
          "<br><b>Digital: </b>" +
          feature.properties.DIGITAL +
          "<br><b>Shelter Type: </b>" +
          feature.properties["NEW TYPE"] +
          "<br><b>Score: </b>" +
          feature.properties["Total Score"] +
          "<br><b>Votes for New Shelter: </b>" +
          feature.properties.VOTES +
          "<br><b>Routes that Stop Here: </b>" +
          feature.properties.routeNumbers
      ); // close bindPopup;
    }) // close _.map()
  ).addTo(map);
});

//Basemap Layer control functionality
var baseMaps = {
  Aerial: Esri_WorldImagery,
  Transit: Thunderforest_Transport
};
L.control.layers(baseMaps).addTo(map);

/* ========
INDEGO Data Layer import and project
======== */

var plotMarkers = function(markers) {
  for (var n = 0; n < markers.length; n++) {
    markers[n].addTo(map);
  }
};

var indegoLink = "https://www.rideindego.com/stations/json/";
var stations;
var empty = [];

var indegoIcon = L.icon({
  iconUrl: "js/images/marker-0@2x.png",
  iconSize: [30, 45]
});

// helper functions
var downloadData = url => $.ajax(url);

// implement helper functions to call and wait for ajax download of json
downloadData(indegoLink).done(function(response) {
  // create layer group of station markers
  stations = L.layerGroup(
    _.map(response.features, function(feature) {
      return L.marker(
        [feature.geometry.coordinates[1], feature.geometry.coordinates[0]],
        { icon: indegoIcon }
      );
    })
  );

  // indego layer control system
  indegoLayer = {
    Indego: stations,
    Off: empty // error thrown here but no loss in functionality
  };
  L.control.layers(indegoLayer).addTo(map);
});
