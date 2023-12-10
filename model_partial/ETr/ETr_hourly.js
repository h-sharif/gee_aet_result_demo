//ETr hourly For an image Function //It is a NUMBER
exports.ETr_hourly  = function(image, synopticFeature, es, ea, delta, gama, Rn_synoptic, G_synoptic){
  var Tmean = ee.Number(synopticFeature.get("Average Air Temperature (oC)")).add(273.15);
  var U10 = ee.Number(synopticFeature.get("Wind Speed (m/s) at 10 m above ground"));
  var U2 = ee.Number.expression(
    "u * (4.87 / (log(678-5.42)))", {
      u: U10
    });
  var nightday = image.date().getFraction('day','Iran');
  var Cd = ee.Number(ee.Algorithms.If(nightday.gte(0.25).and(nightday.lte(0.75)), ee.Number(0.25), ee.Number(1.7)));
  var Cn = ee.Number(66);
  
  var check = ee.Number.expression(
    "0.408*(Rn-G)",{
      Rn: Rn_synoptic.multiply(0.0036), //MJ/m^(2)/hr
      G: G_synoptic.multiply(0.0036), //MJ/m^(2)/hr      
    }); 
  
  //print('This is 0.408(Rn-G) #model', check)
  //print('This is Rn @ synoptic #model:', Rn_synoptic.multiply(0.0036))
  //print('This is G @ synoptic #model:', G_synoptic.multiply(0.0036))
  
  return ee.Number.expression(
    "((0.408 * dlt * (Rn - G)) + (gma * (cn/T) * u * (Es - Ea))) / (dlt + (gma * (1 + cd * u)))", {
      dlt: delta,
      T: Tmean,
      Rn: Rn_synoptic.multiply(0.0036), //MJ/m^(2)/hr
      G: G_synoptic.multiply(0.0036), //MJ/m^(2)/hr
      gma: gama,
      cn: Cn,
      cd: Cd,
      u: U2,
      Es: es,
      Ea: ea
    });
};