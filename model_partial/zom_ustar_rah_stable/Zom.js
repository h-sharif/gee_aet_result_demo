//Landcover map = Copernicus Global Land Cover Layers: CGLS-LC100 collection 3 (100 meter resolution)
//2015 until 2019
exports.Zom = function(image, lai){
  //year should be a string(client object)
  var LandcoverCollection = ee.ImageCollection("COPERNICUS/Landcover/100m/Proba-V-C3/Global").select("discrete_classification");
  var Landcover = (LandcoverCollection.first()).clip(image.geometry());
  var waterBodies = Landcover.eq(80).or(Landcover.eq(90)).or(Landcover.eq(200));
  var bareAreas = Landcover.eq(0).or(Landcover.eq(60));
  var snow_iceBodies = Landcover.eq(70);
  var urbanAreas = Landcover.eq(50);
  var greenAreas = Landcover.eq(20).or(Landcover.eq(30)).or(Landcover.eq(40)).or(Landcover.eq(100)).or(Landcover.eq(111)).or(Landcover.eq(112))
                    .or(Landcover.eq(113)).or(Landcover.eq(114)).or(Landcover.eq(115)).or(Landcover.eq(116)).or(Landcover.eq(121)).or(Landcover.eq(122))
                    .or(Landcover.eq(123)).or(Landcover.eq(124)).or(Landcover.eq(125)).or(Landcover.eq(126)).or(Landcover.eq(200));
  var Zom_water = waterBodies.mask(waterBodies).add(0.0005).subtract(1).rename(["water"]);
  var Zom_bare = bareAreas.mask(bareAreas).add(0.1).subtract(1).rename(['bare']);
  var Zom_snow_ice = snow_iceBodies.mask(snow_iceBodies).add(0.005).subtract(1).rename(["snow_ice"]);
  var Zom_urban = urbanAreas.mask(urbanAreas).add(0.2).subtract(1).rename(["urban"]);
  var Zom_green = greenAreas.mask(greenAreas);
  var Zom_green_1 = Zom_green.updateMask(lai.lte(0));
  var Zom_green_2_1 = lai.mask(Zom_green);
  var Zom_green_2_2 = Zom_green_2_1.updateMask(lai.gt(0)); 
  var Zom_green_out1 = Zom_green_1.subtract(1).add(0.005).rename(["green_1"]);
  var Zom_green_out2 = Zom_green_2_2.multiply(0.018).rename(["green_2"]);
  var ZomImg = ee.Image.cat([Zom_water, Zom_bare, Zom_snow_ice, Zom_urban, Zom_green_out1, Zom_green_out2]).reduce(ee.Reducer.max()).mask(lai.gt(-9999));
  var Zom1 = ZomImg.updateMask(ZomImg.lt(0.0005));
  var Zom2 = ZomImg.updateMask(ZomImg.gte(0.0005));
  var Zom1_Cr = Zom1.subtract(Zom1).add(0.0005);
  return ee.Image.cat([Zom1_Cr, Zom2]).reduce(ee.Reducer.max()).rename(["Zom"]);
};