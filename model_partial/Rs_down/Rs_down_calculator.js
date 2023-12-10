//Rs Downward Function//-----
exports.Rs_down = function(tetaRel, tsw, esd){ //earth-sun distance #Picture property: EARTH_SUN_DISTANCE (double)
  //var esd = ee.Number(image.get("EARTH_SUN_DISTANCE"));
  return tetaRel.expression(
    "1367 * Teta * Tsw / dr", {
      Teta: tetaRel,
      Tsw: tsw,
      dr: esd
    }).rename(["Rs_down"]);
};
