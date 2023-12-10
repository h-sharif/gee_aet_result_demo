//Calculate Slope and Aspect //image = degital elevation model
exports.Slope = function(image){
  var slopeImage = ee.Terrain.slope(image); //in degree
  return slopeImage; 
};
exports.Aspect = function(image){
  var aspectImage = ee.Terrain.aspect(image); //in degree
  return aspectImage;
};   