//2nd eNB
//Create narrow band thermal emissivity Function for a img #return img with eNB bands
exports.eNB = function(ndviImage, laiImage){
  /*
  //var ndviImage = getNDVI(image);
  var laiImageMaskType1 = laiImage.mask(laiImage.gte(3)); //LAI >=3
  var laiImageMaskType2 = laiImage.mask(laiImage.lt(3)); //LAI <3
  var ndviImageMaskType1 = ndviImage.mask(ndviImage.lte(0)); //ndvi <=0
  var ndviImageMaskType2 = ndviImage.mask(ndviImage.gt(0)); //ndvi > 0
  // Lai >= 3 && Ndvi>0
  var ndviLaiMaskeType1 = laiImageMaskType1.updateMask(ndviImageMaskType2);
  var img1 = ndviLaiMaskeType1.multiply(0).add(0.98).rename(['eNB_1']);
  // Lai <3 && Ndvi>0
  var ndviLaiMaskeType2 = laiImageMaskType2.updateMask(ndviImageMaskType2);
  var img2 = ndviLaiMaskeType2.multiply(0.0033).add(0.97).rename(['eNB_2']);
  // Ndvi<=0
  var img3 = ndviImageMaskType1.multiply(0).add(0.985).rename(['eNB_3']);
  // Concentrat
  var eNBCollectionBands = ee.Image.cat([img1, img2, img3]);
  return eNBCollectionBands.reduce(ee.Reducer.max()).rename(["eNB"]); //single band eNB Img
  */
  var lai = laiImage.where(laiImage.gt(3), ee.Image.constant(3));
  var eps = lai.expression(
    "0.97 + 0.0033 * l", {
      l: lai
    });
  return eps.where(ndviImage.lte(0), 0.985).rename(['eNB']);
};
