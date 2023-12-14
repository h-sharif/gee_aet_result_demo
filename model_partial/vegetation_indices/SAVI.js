exports.getSAVI = function (image){
  var b5 = image.select("SR_B5");
  var b4 = image.select("SR_B4");
  var L = 0.1; // SAVI Coef # Assumption!! Depend on the region
  var savi = (b5.subtract(b4).divide(b5.add(b4).add(L))).multiply(ee.Number(L).add(1)).rename(['SAVI']);
  return savi;
};