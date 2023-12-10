exports.getNDVI = function(image){
  return image.normalizedDifference(['SR_B5', 'SR_B4']).rename(['NDVI']); // the band name is NDVI
};