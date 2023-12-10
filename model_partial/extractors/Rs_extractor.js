exports.Rs_extractor = function(Rs, pointGeo){
  return ee.Number(Rs.reduceRegion({
    reducer: ee.Reducer.mean(),
    geometry: pointGeo,
    scale: 30,
    bestEffort: true
  }).get("Rs_down"));
};