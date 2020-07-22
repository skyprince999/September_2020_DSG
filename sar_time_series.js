

// Create a time series video. 

// Ram Setu bridge/ Adam's bridge 
var startDate = ee.Date('2019');
var endDate = ee.Date('2020');
var geometry = ee.Geometry.Point(79.42, 9.10);
var bufferRadius = 3.8e4;
var polarization = 'VH';
var vizMin = -25;
var vizMax = 0;
var framesPerSecond = 2;
var customFilter = ee.Filter.and(
  ee.Filter.date(startDate, endDate),
  ee.Filter.eq('instrumentMode', 'IW'),
  // ee.Filter.equals('relativeOrbitNumber_start', 128)
  ee.Filter.eq('orbitProperties_pass', 'DESCENDING'),
  ee.Filter.listContains('transmitterReceiverPolarisation', polarization)
);



var collection = ee.ImageCollection('COPERNICUS/S1_GRD')
    .filterBounds(geometry)
    .filter(customFilter)
    .sort('system:time_start')
    .select(polarization);
    
// Visualization and animation parameters.
var viewport = geometry.buffer(bufferRadius).bounds(1, 'EPSG:3857');
var params = {
  crs: 'EPSG:3857', // spherical mercator
  framesPerSecond: framesPerSecond,
  region: viewport,
  min: vizMin,
  max: vizMax,
  palette: ['black', 'white'],
  dimensions: 256,
  // title: image.metadata('system:time_start')
};

// Preview the first frame on the map.
Map.centerObject(geometry.buffer(bufferRadius));
Map.addLayer(collection, params, 'collection');
Map.addLayer(viewport, {color:'red'}, 'viewport');

// This function adds a band representing the image timestamp.
var addTime = function(image) {
  return image.addBands(image.metadata('system:time_start'));
};

// Map the function over the collection and display the result.
collection.map(addTime);

// Display the animation in the console.
// Append two blank images so you can tell when it repeats.
var collectionPadded = collection.merge(
  ee.ImageCollection.fromImages([ee.Image(0), ee.Image(0)]));

// Uncomment the following if you want to create a filmstrip.
// print('Filmstrip', collectionPadded.getFilmstripThumbURL(params));

print(ui.Thumbnail(collectionPadded, params));
print('geometry', geometry);
print('collection.size()', collection.size());
