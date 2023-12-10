// Omega (hourly angle) //number
exports.w = function(image, Lm){
  var t0 = ee.Number(ee.Date(image.date()).getRelative('minute', 'day'));//"SENSING_TIME"
  var t = t0.divide(ee.Number(60));
  // Seasonal Correction  //number
  var Sc = function(image){
    var JD = ee.Number(image.date().getRelative('day','year'));
    var b = ee.Number(2*Math.PI).multiply(JD.subtract(ee.Number(81))).divide(ee.Number(364));
    return (ee.Number(0.1645).multiply((b.multiply(ee.Number(2))).sin())).subtract((ee.Number(0.1255).multiply(b.cos())).add(ee.Number(0.025).multiply(b.sin())));
  };
  var S_C = Sc(image);
  //var Lz = longitude of user's location (number) ==> deleted according to MATLAB model and the discussion with professor Danesh
  //var Lm = longitude of picture (number)
  // var Lm = Lm.multiply(ee.Number(Math.PI).divide(180));
  return ee.Number(Math.PI/12).multiply(t.add(ee.Number(0.06667).multiply(Lm)).add(S_C).subtract(ee.Number(12)));
};




// // Revised code due to the new version of GEE
// // Omega (hourly angle)
// exports.w = function(image, Lm) {
//   var t0 = ee.Number(image.date().getFraction('day'));
//   var t = t0.multiply(24); // Convert fraction of a day to hours

//   // Seasonal Correction
//   var Sc = function(image) {
//     var JD = ee.Number(image.date().getRelative('day', 'year'));
//     var b = JD.multiply(2).multiply( Math.PI).subtract(81).divide(364);
//     return ee.Number.expression('0.1645*sin(2*B) - 0.1255*cos(b) - 0.025*sin(b)',
//                                 {B:b});
//   };
//   var S_C = Sc(image);

//   // Lm should be provided as radians, not degrees
//   var Lm_adj = Lm.multiply(ee.Number(Math.PI).divide(180)); // Convert Lm from degrees to radians

//   // Calculate Omega (hourly angle)
//   var omega = (ee.Number(Math.PI).divide(12)).multiply(t.add(ee.Number(0.06667).multiply(Lm)).add(S_C).subtract(ee.Number(12)));

//   return ee.Number(omega);
// };
