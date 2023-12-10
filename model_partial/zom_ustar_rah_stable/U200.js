//U200 Function
exports.U200 = function(Zom, synopticPoint, uw){
  // At synoptic station
  var Zomw = ee.Number(Zom.reduceRegion({
    geometry: synopticPoint,
    reducer: ee.Reducer.mean(),
    scale: 30,
    bestEffort: true
  }).get("Zom"));
  return (ee.Number(uw).multiply((ee.Number(200).divide(Zomw)).log())).divide((ee.Number(10).divide(Zomw)).log()); // all types = number
};