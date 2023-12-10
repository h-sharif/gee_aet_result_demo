exports.rah_extractor = function(rah, pointGeo){
  return ee.Number(rah.reduceRegion({
    reducer: ee.Reducer.mean(),
    geometry: pointGeo,
    scale: 30,
    bestEffort: true
  }).get("rah"));
};