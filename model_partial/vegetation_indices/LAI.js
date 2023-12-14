exports.LAI = function(imageSavi){
  //var imageSavi = getSAVI(image);
  var firstType = imageSavi.mask(imageSavi.gt(0.687));
  var middleType = imageSavi.mask(imageSavi.gte(0.1).and(imageSavi.lte(0.687)));
  var secondType = imageSavi.mask(imageSavi.lt(0.1));
  var firstTypeLai = firstType.subtract(firstType).add(6).rename(["LAI_1"]); // savi > 0.678 Lai = 6
  var middleTypeLai = ((middleType.multiply(-1).add(0.69)).divide(0.59)).log().divide(-0.91).rename(["LAI_2"]); // 0 <= savi <= 0.678 Lai = varies 0 to 6
  var secondTypeLai = secondType.subtract(secondType).rename(["LAI_3"]); //savi < 0.1
  var LaiCollectionBands = ee.Image.cat([firstTypeLai, middleTypeLai, secondTypeLai]); //#three bands LAI_1 to LAI_3 #Single Image 
  var LaiImage = LaiCollectionBands.reduce(ee.Reducer.max()).rename(["LAI"]); //single band Lai Img
  return LaiImage;

};