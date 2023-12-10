//u* Function #stable condition (step 0)
exports.Ustar = function(Zom, Zomw, u10){
  //Extract Uw of a image(specific time) #needed for U200
  //the high of measuring wind at synoptic station = 10 m
  //U200 Function
  var U200 = function(Zomw){
    var uw = ee.Number(u10);
     // At synoptic station
    return (uw.multiply((ee.Number(200).divide(Zomw)).log())).divide((ee.Number(10).divide(Zomw)).log()); // all types = number
  };
  
  return Zom.expression(
    "0.41*u200/log(200/zom)", {
    u200: U200(Zomw),
    zom: Zom
    }).rename(['u_star']);
};