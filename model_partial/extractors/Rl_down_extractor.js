exports.Rl_down_extractor = function(Rl, pointGeo){
  return ee.Number(Rl.reduceRegion({
    reducer: ee.Reducer.mean(),
    geometry: pointGeo,
    scale: 30,
    bestEffort: true
  }).get("Rl_down"));
};