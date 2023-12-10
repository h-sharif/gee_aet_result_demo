//ETr dayly For an image Function //It is a NUMBER
var Rng_calculator = require('users/hamedsharif1377/SUT_METRIC:ETr/RngFAOdayly');
exports.ETr_dayly = function(synopticFeature, es, ea, delta, gama, phi_synoptic, inclinationAngle, d2, synopticPoint, dem){
  var Tmean = ee.Number(synopticFeature.get("Average Air Temperature (oC)")).add(273.15);
  var U10 = ee.Number(synopticFeature.get("Wind Speed (m/s) at 10 m above ground"));
  var U2 = ee.Number.expression(
    "u * (4.87 / (log(678-5.42)))", {
      u: U10
    });
  var Cd = ee.Number(0.38);
  var Cn = ee.Number(1600);

  var z_synoptic = ee.Number(dem.reduceRegion({
    reducer: ee.Reducer.mean(),
    geometry: synopticPoint,
  }).get('elevation'));

  var Rs_synoptic = ee.Number(synopticFeature.get('Converted Solar Radiation'));
  
  var ph = (ee.Number(phi_synoptic).multiply(Math.PI/180)).tan();
  var dl = ee.Number(inclinationAngle).tan();
  var ws = (ee.Number(-1).multiply(ph).multiply(dl)).acos();
  
  var n = ee.Number(synopticFeature.get('Sunshine Hour (hour)'));
  var N = ee.Number.expression(
    "(24/p)*w",{
      p: ee.Number(Math.PI),
      w: ws
    });
    
  var Ra = ee.Number.expression(
    "(24*60/pi)*Gsc*dr*((w * sin(Phi)* sin(Delta))+(cos(Phi) * cos(Delta) * sin(w)))", {
      pi: ee.Number(Math.PI),
      Gsc: 0.0820,
      dr: d2.pow(-1),
      w: ws,
      Phi: phi_synoptic.multiply(Math.PI/180),
      Delta: inclinationAngle

    }); //MJ m-2 day-1
    
  var Rs_fromSunshineHour = ee.Number.expression(
    "(0.25 + 0.5 * Dn)*ra",{
      Dn: n.divide(N),
      ra: Ra
    });
  
  var condition = 0;
  var rsInfo = Rs_synoptic.getInfo();
  if (rsInfo!==null){
    condition = 1;
  }
  
  var Rs = ee.Algorithms.If(ee.Number(condition).eq(0), Rs_fromSunshineHour, Rs_synoptic);
  
  return ee.Number.expression(
    "(( dlt * rng) + (gma * cn * u * (Es - Ea))/T) / (dlt + (gma * (1 + cd * u)))", {
      dlt: delta,
      T: Tmean,
      rng: Rng_calculator.Rng(phi_synoptic, inclinationAngle, d2, z_synoptic, Rs, synopticFeature, ea),
      gma: gama,
      cn: Cn,
      cd: Cd,
      u: U2,
      Es: es,
      Ea: ea
    });
};