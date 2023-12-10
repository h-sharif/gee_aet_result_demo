//DEM Input for an image
exports.getDEM = function(image){
  var DEM = ee.Image('USGS/SRTMGL1_003');
  return DEM.clip(image.geometry());
};
