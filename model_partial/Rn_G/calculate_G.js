exports.G = function(lai, ndvi, lst, rn){
  var laiType1 = lai.mask(lai.gte(0.5));
  var laiType2 = lst.mask(lai.lt(0.5)); //actually it's LST
  var Gtype1 = (laiType1.multiply(-0.521).exp()).multiply(0.18).add(0.05);
  var Gtype2 = laiType2.subtract(273.15).multiply(1.8).divide(rn).add(0.084);
  var Gtype = ee.Image.cat([Gtype1, Gtype2]).reduce(ee.Reducer.max());
  var GFinal = Gtype.where(ndvi.lte(0), ee.Image.constant(0.5));
  return GFinal.multiply(rn).rename(['G']);
};