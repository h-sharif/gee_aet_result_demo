exports.Lst_extractor = function(Lst, pointGeo){
  //#dictionary's key =LST
  var result = Lst.reduceRegion({
    geometry: pointGeo,
    reducer: ee.Reducer.mean(),
    scale: 30,
    bestEffort: true
  });
  return ee.Number(result.get("LST"));
};