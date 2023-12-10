//latitude of the area of intrest //image
exports.phi = function(image){
  var baseLat = ee.Image.pixelLonLat().clip(image.geometry());
  return baseLat.select('latitude').multiply(Math.PI/180);
};