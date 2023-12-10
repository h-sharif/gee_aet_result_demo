//Extract at sensor image reflectance //with date and bounds filtered raw img collection
exports.extractRaw = function(image, Frawcollection){
  var ts = image.get("system:time_start");
  var getrawimg = Frawcollection.filter(ee.Filter.eq("system:time_start", ts));
  var Cr = ee.Algorithms.Landsat.calibratedRadiance(getrawimg.first()); // at sensor radiance
  return Cr;
};
