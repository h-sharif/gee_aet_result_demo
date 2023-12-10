exports.G_extractor = function(G, pointGeo){
  return ee.Number(G.reduceRegion({
    reducer: ee.Reducer.mean(),
    geometry: pointGeo,
    scale: 30,
    bestEffort: true
  }).get("G"));
};