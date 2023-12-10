//Earth sun relative distance //number
exports.Es_dr = function(image){
  var JD = ee.Number(image.date().getRelative('day','year'));
  return (JD.multiply(Math.PI).multiply(2).divide(365).cos().multiply(0.033).add(1)).pow(-1);
};