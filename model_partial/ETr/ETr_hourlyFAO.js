//ETr dayly For an image Function //It is a NUMBER

var Rng_calculator = require('users/hamedsharif1377/SUT_METRIC:ETr/RngFAOhourly');
exports.ETr_hourly = function(image, lm,  synopticFeature, es, ea, delta, gama, phi_synoptic, inclinationAngle, d2, synopticPoint, dem){
  var Tmean = ee.Number(synopticFeature.get("Average Air Temperature (oC)")).add(273.15);
  var U10 = ee.Number(synopticFeature.get("Wind Speed (m/s) at 10 m above ground"));
  var U2 = ee.Number.expression(
    "u * (4.87 / (log(678-5.42)))", {
      u: U10
    });
  var nightday = image.date().getFraction('day','Iran');
  var Cd = ee.Number(ee.Algorithms.If(nightday.gte(0.25).and(nightday.lte(0.75)), ee.Number(0.25), ee.Number(1.7)));
  var Cn = ee.Number(66);

  
  var z_synoptic = ee.Number(dem.reduceRegion({
    reducer: ee.Reducer.mean(),
    geometry: synopticPoint,
  }).get('elevation'));
  //var Rs_synoptic = ee.Number(synopticFeature.get('Converted Solar Radiation'));
  
  var ph = (ee.Number(phi_synoptic).multiply(Math.PI/180)).tan();
  var dl = ee.Number(inclinationAngle).tan();
  var ws = (ee.Number(-1).multiply(ph).multiply(dl)).acos();
  
  var w = function(image, Lm){
    var t0 = ee.Number(image.date().getFraction('day'));
    var t = t0.multiply(24); // Convert fraction of a day to hours
    // Seasonal Correction
    var Sc = function(image) {
      var JD = ee.Number(image.date().getRelative('day', 'year'));
      var b = JD.multiply(2 * Math.PI).subtract(81).divide(364);
      return (ee.Number(0.1645).multiply((b.multiply(ee.Number(2))).sin())).subtract((ee.Number(0.1255).multiply(b.cos())).add(ee.Number(0.025).multiply(b.sin())));
    };
    
    var S_C = Sc(image);
    
    // Lm should be provided as radians, not degrees
    var Lm_adj =Lm.multiply(ee.Number(Math.PI).divide(180)); // Convert Lm from degrees to radians
    // Calculate Omega (hourly angle)
    var omega = ee.Number(Math.PI/12).multiply(t.add(ee.Number(0.06667).multiply(Lm_adj)).add(S_C).subtract(ee.Number(12)));
    return omega;
    };
    
  var n = ee.Number(synopticFeature.get('Sunshine Hour (hour)'));
  var N = ee.Number.expression(
    "(24/p)*w",{
      p: ee.Number(Math.PI),
      w: ws
    });
  // print('This is N: ', N)  
  var Ra = ee.Number.expression(
    "(12*60/pi)*Gsc*dr*((w3 * sin(Phi)* sin(Delta))+(cos(Phi) * cos(Delta) * (sin(w2)-sin(w1))))", {
      pi: ee.Number(Math.PI),
      Gsc: 0.0820,
      dr: d2.pow(-1),
      w3: ee.Number(Math.PI).divide(12),
      w2: w(image, lm).add(ee.Number(Math.PI).divide(24)),
      w1: w(image, lm).subtract(ee.Number(Math.PI).divide(24)),
      Phi: phi_synoptic.multiply(Math.PI).divide(180),
      Delta: inclinationAngle

    }); //MJ m-2 hour-1
  
  // print('This is Ra_hourly: ', Ra)  
  var Rs_fromSunshineHour = ee.Number.expression(
    "(0.25 + 0.5 * Dn)*ra",{
      Dn: n.divide(N),
      ra: Ra
    });
     
  //var Rs = ee.Algorithms.If(Rs_synoptic.lte(0), Rs_fromSunshineHour, Rs_synoptic);
  var Rs = Rs_fromSunshineHour;
  // print('This is Rs_hourly with synoptic data: ', Rs)
  // print('This is Rng_hourly with synoptic data: ', Rng_calculator.Rng(image, lm, phi_synoptic, inclinationAngle, d2, z_synoptic, Rs, synopticFeature, ea))
  // print('This is Gng_hourly with synoptic data: ', ee.Number(ee.Algorithms.If(nightday.gte(0.25).and(nightday.lte(0.75)), Rng_calculator.Rng(image, lm, phi_synoptic, inclinationAngle, d2, z_synoptic, Rs, synopticFeature, ea).divide(10), Rng_calculator.Rng(image, lm, phi_synoptic, inclinationAngle, d2, z_synoptic, Rs, synopticFeature, ea).divide(2))))
  return ee.Number.expression(
    "(( dlt * (rng-G)) + (gma * (cn/T) * u * (Es - Ea))) / (dlt + (gma * (1 + cd * u)))", {
      dlt: delta,
      T: Tmean,
      rng: Rng_calculator.Rng(image, lm, phi_synoptic, inclinationAngle, d2, z_synoptic, Rs, synopticFeature, ea),
      G: ee.Number(ee.Algorithms.If(nightday.gte(0.25).and(nightday.lte(0.75)), Rng_calculator.Rng(image, lm, phi_synoptic, inclinationAngle, d2, z_synoptic, Rs, synopticFeature, ea).divide(10), Rng_calculator.Rng(image, lm, phi_synoptic, inclinationAngle, d2, z_synoptic, Rs, synopticFeature, ea).divide(2))),
      gma: gama,
      cn: Cn,
      cd: Cd,
      u: U2,
      Es: es,
      Ea: ea
    });
    
};

