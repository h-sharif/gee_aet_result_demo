//atmospheric pressure (kPa)
exports.Pressure = function(dem){
  return dem.expression(
    "101.3 * (((293 - 0.0065 * z) / 293) **5.26)",{
      z: dem.select("elevation")
    }).rename(["P"]);
};  