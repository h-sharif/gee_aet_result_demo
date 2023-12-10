//ETr dayly For an image Function //It is a NUMBER
exports.ETr_dayly = function(synopticFeature, es, ea, delta, gama, Rn_synoptic, G_synoptic){
  var Tmean = ee.Number(synopticFeature.get("Average Air Temperature (oC)")).add(273.15);
  var U10 = ee.Number(synopticFeature.get("Wind Speed (m/s) at 10 m above ground"));
  var U2 = ee.Number.expression(
    "u * (4.87 / (log(678-5.42)))", {
      u: U10
    });
  var Cd = ee.Number(0.38);
  var Cn = ee.Number(1600);

  return ee.Number.expression(
    "((0.408 * dlt * (Rn - G)) + (gma * (cn/T) * u * (Es - Ea))) / (dlt + (gma * (1 + cd * u)))", {
      dlt: delta,
      T: Tmean,
      Rn: Rn_synoptic.multiply(0.0864), //MJ/m^(2)/day
      G: G_synoptic.multiply(0), //MJ/m^(2)/day
      gma: gama,
      cn: Cn,
      cd: Cd,
      u: U2,
      Es: es,
      Ea: ea
    });
};