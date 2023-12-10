exports.lm = function(image){
  var baseLat = ee.Image.pixelLonLat().clip(image.geometry());
  var longi =  baseLat.select('longitude');
  return ee.Number(longi.reduceRegion({
    reducer: ee.Reducer.mean(),
    scale: 30,
    bestEffort: true
  }).get('longitude'));
};