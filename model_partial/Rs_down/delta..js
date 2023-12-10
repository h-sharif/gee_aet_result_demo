//declination of earth angle //number
exports.delta = function(image){
  var JD = ee.Number(image.date().getRelative('day','year'));
  return ee.Number(0.409).multiply(((ee.Number(2*Math.PI/365).multiply(JD)).subtract(ee.Number(1.39))).sin()); //in radian
};