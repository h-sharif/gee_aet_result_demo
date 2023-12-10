exports.Rn_extractor = function(Rn, pointGeo){
  return ee.Number(Rn.reduceRegion({
    reducer: ee.Reducer.mean(),
    geometry: pointGeo,
    scale: 30,
    bestEffort: true
  }).get("Rn"));
};