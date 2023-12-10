exports.dT_extractor = function(dT, pointGeo){
  return ee.Number(dT.reduceRegion({
    reducer: ee.Reducer.mean(),
    geometry: pointGeo,
    scale: 30,
    bestEffort: true
  }).get("dT"));
};