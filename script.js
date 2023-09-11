var map = L.map('map').setView([31.064, -8.391], 10);

// Define a custom base layer with different styling
var googlemaps = L.tileLayer('http://mt0.google.com/vt/lyrs=m&hl=en&x={x}&y={y}&z={z}', {
    maxZoom: 19,
});

var Satellite = L.tileLayer('http://mt0.google.com/vt/lyrs=y&hl=en&x={x}&y={y}&z={z}', {
    maxZoom: 19,
});

var titleControl = L.control({
    position: 'topright' // Position the control in the top left corner
});

titleControl.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'map-title');
    div.innerHTML = '<h1>خريطة انهيارات صخرية محتملة متاقطعة مع الطريق</h1>'; // Customize your map title here
    return div;
};

// Add the custom control to the map
titleControl.addTo(map);

// Function to create custom point markers with different colors
function createCustomPointMarker(feature, latlng, color) {
    var customPointStyle = {
        radius: 6, // Adjust the size of the point
        fillColor: color, // Use the color passed as an argument
        color: 'black', // Border color of the point
        weight: 1, // Border width of the point
        opacity: 1, // Opacity of the point
        fillOpacity: 0.8 // Fill opacity of the point
    };
    return L.circleMarker(latlng, customPointStyle);
}

// Create custom GeoJSON layers with different colors
var landslide = L.geoJSON(lslide, {
    pointToLayer: function (feature, latlng) {
        return createCustomPointMarker(feature, latlng, 'red'); // Specify color for this layer
    },
    onEachFeature: function (feature, layer) {
        // Add a popup to visualize the properties when a point is clicked
        if (feature.properties && feature.properties.old_ref) {
            layer.bindPopup('<b>طريق:</b> ' + feature.properties.old_ref);
        }else {
            layer.bindPopup('<b>Name: طريق غير معروف</b> ' );
        }
    }   
});

var villagesLayer = L.geoJSON(villages, {
    pointToLayer: function (feature, latlng) {
        return createCustomPointMarker(feature, latlng, 'green'); // Specify color for this layer
    },
    onEachFeature: function (feature, layer) {
        // Add a popup to visualize the properties when a point is clicked
        if (feature.properties && feature.properties.name) {
            layer.bindPopup('<b>Name:</b> ' + feature.properties.name);
        }
    }
});

var seism_center = L.marker([31.064, -8.391]);
seism_center.bindPopup('بؤرة الزلزال');

// Create a base layer object for the custom base layer
var baseLayers = {
    "google maps": googlemaps,
    "Satellite" : Satellite
};

// Create an overlay object for the custom GeoJSON layers
var overlays = {
    "انهيارات صخرية": landslide, // Add the first custom layer
    "villages": villagesLayer // Add the second custom layer
};




// Add the layers control to the map
L.control.layers(baseLayers, overlays, {collapsed:false}).addTo(map);

// Add the custom base layer to the map by default
googlemaps.addTo(map);
landslide.addTo(map);
seism_center.addTo(map)
