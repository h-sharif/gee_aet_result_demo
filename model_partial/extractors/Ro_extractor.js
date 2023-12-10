exports.Ro_extractor = function(Ro, pointGeo){
  return ee.Number(Ro.reduceRegion({
    reducer: ee.Reducer.mean(),
    geometry: pointGeo,
    scale: 30,
    bestEffort: true
  }).get("Ro"));
};