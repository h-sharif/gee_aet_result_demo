// ---------------Ts (surface temprature of an img)-----//Need at sensor band 6 radiant//
exports.Lst = function(reflectance, enb){
  // var L6 = reflectance.select("B10"); //L6 = METRIC paper parameter (in term of Landsat 7 image)
  // var Rc = L6.expression(
  //   "((l-rp)/t) - (1-e)*rs",{
  //     l: L6,
  //     rp: ee.Number(0.91),
  //     t: ee.Number(0.866),
  //     e: enb,
  //     rs:1.32
  //   });
  // var lst = (enb.divide(Rc).multiply(774.89).add(1)).log().pow(-1).multiply(1321.08).rename(["LST"]);
  // return lst;
  var L10 = reflectance.select('ST_B10');
  //var lst = L10.multiply(0.00341802).add(149.0).rename(["LST"]);
  var lst = L10.rename(["LST"]);
  return lst;
};
