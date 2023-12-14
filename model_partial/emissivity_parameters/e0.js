//Create broad band thermal emissivity Function for a img #return img with e0 bands
exports.e0 = function(ndviImage, laiImage){
  /*
  //var ndviImage = getNDVI(image);
  var laiImageMaskType1 = laiImage.mask(laiImage.gte(3)); //LAI >=3
  var laiImageMaskType2 = laiImage.mask(laiImage.lt(3)); //LAI <3
  var ndviImageMaskType1 = ndviImage.mask(ndviImage.lte(0)); //ndvi <=0
  var ndviImageMaskType2 = ndviImage.mask(ndviImage.gt(0)); //ndvi > 0
  // Lai >= 3 && Ndvi>0
  var ndviLaiMaskeType1 = laiImageMaskType1.updateMask(ndviImageMaskType2);
  var img1 = ndviLaiMaskeType1.multiply(0).add(0.98).rename(['e0_1']);
  // Lai <3 && Ndvi>0
  var ndviLaiMaskeType2 = laiImageMaskType2.updateMask(ndviImageMaskType2);
  var img2 = ndviLaiMaskeType2.multiply(0.01).add(0.95).rename(['e0_2']);
  // Ndvi<=0
  var img3 = ndviImageMaskType1.multiply(0).add(0.985).rename(['e0_3']);
  // Concatinate
  var e0CollectionBands = ee.Image.cat([img1, img2, img3]);
  return e0CollectionBands.reduce(ee.Reducer.max()).rename(["e0"]); //single band e0 Img
  */
  var lai = laiImage.where(laiImage.gt(3), ee.Image.constant(3));
  var eps = lai.expression(
    "0.95 + 0.01 * l", {
      l: lai
    });
  return eps.where(ndviImage.lte(0), 0.985).rename(['e0']);
};