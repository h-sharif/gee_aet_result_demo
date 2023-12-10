exports.G = function(albedo, Rn, Lst, ndvi){
  var a = albedo;
  var r = Rn;
  var t = Lst;
  var n = ndvi;
  return t.subtract(273.15).multiply(a.multiply(0.0074).add(0.0038)).multiply(n.pow(4).multiply(-0.98).add(1))
  .multiply(r).rename(["G"]);
};