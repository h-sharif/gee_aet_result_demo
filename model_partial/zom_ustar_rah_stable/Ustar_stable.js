//u* Function #stable condition (step 0)
exports.Ustar = function(Zom, U200){
  //Extract Uw of a image(specific time) #needed for U200
  //the high of measuring wind at synoptic station = 10 m
  //U200 Function
  /*
  var U200 = function(Zom, synopticPoint){
    var uw = ee.Number(u10);
     // At synoptic station
    var Zomw = ee.Number(Zom.reduceRegion({
      geometry: synopticPoint,
      reducer: ee.Reducer.mean(),
      scale: 30,
      bestEffort: true
    }).get("Zom"));
    return (uw.multiply((ee.Number(200).divide(Zomw)).log())).divide((ee.Number(10).divide(Zomw)).log()); // all types = number
  };
  */
  return Zom.expression(
    "0.41*u200/log(200/zom)", {
    //u200: U200(Zom, synopticPoint),
    u200: U200,
    zom: Zom
    }).rename(['u_star']);
};
