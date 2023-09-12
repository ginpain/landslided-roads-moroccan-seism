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
    div.innerHTML = '<h1>  خريطة انهيارات صخرية على الطريق و دواوير منكوبة بدرجات متفاوتة</h1>'; // Customize your map title here
    return div;
};

// Add the custom control to the map
titleControl.addTo(map);

// Function to create custom point markers with different colors
// Function to create custom point markers with a gradient red color based on an attribute
function createCustomPointMarker(feature, latlng) {
    // Replace 'attributeName' with the actual attribute name you want to use for styling
    var attributeValue = feature.properties.landslide_1;
    
    // Define a gradient scale from light red to dark red based on attribute values
    var colorScale = d3.scaleLog()
        .domain([0.0006, 0.022]) // Specify the range of attribute values
        .range(["white", "#c40024"]); // Define the corresponding gradient colors

    var customPointStyle = {
        radius: 6, // Adjust the size of the point
        fillColor: colorScale(attributeValue), // Set the fill color based on attribute value
        color: 'black', // Border color of the point
        weight: 1, // Border width of the point
        opacity: 1, // Opacity of the point
        fillOpacity: 0.8 // Fill opacity of the point
    };

    return L.circleMarker(latlng, customPointStyle);
}

function createCustomPointMarker_ROADS(feature, latlng) {
    var customPointStyle = {
        radius: 6, // Adjust the size of the point
        fillColor: 'yellow', // Set the fill color based on attribute value
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
        return createCustomPointMarker_ROADS(feature, latlng); // Specify color for this layer
    },
    onEachFeature: function (feature, layer) {
        // Add a popup to visualize the properties when a point is clicked
        if (feature.properties && feature.landslide_1) {
            layer.bindPopup('<b>طريق:</b> ' + feature.landslide_1);
        }else {
            layer.bindPopup('<b>Name: طريق غير معروف</b> ' );
        }
    }   
});


var divillagesLayer = L.geoJSON(dvill, {
    pointToLayer: function (feature, latlng) {
        return createCustomPointMarker(feature, latlng, 'white'); // Specify color for this layer
    },
    onEachFeature: function (feature, layer) {
        // Add a popup to visualize the properties when a point is clicked
        if (feature.properties && feature.properties.name) {
            layer.bindPopup('<b>Name:</b> ' + feature.properties.name);
        }else {
            layer.bindPopup('<b>Name: الإسم على الخريطة</b>'  );
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
    " انهيارات صخرية في الطريق": landslide, 
    'دواوير منكوبة' : divillagesLayer
};




// Add the layers control to the map
L.control.layers(baseLayers, overlays, {collapsed:false}).addTo(map);

// Add the custom base layer to the map by default
googlemaps.addTo(map);
divillagesLayer.addTo(map);
seism_center.addTo(map)
