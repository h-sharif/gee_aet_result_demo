exports.Rng = function(img, lm, phi, delta, d2, z_synoptic, Rs_synoptic, synopticFeature, ea){
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
  var ph = (ee.Number(phi).multiply(Math.PI).divide(180)).tan();
  var dl = ee.Number(delta).tan();
  var Ra = ee.Number.expression(
    "(12*60/pi)*Gsc*dr*((w3 * sin(Phi)* sin(Delta))+(cos(Phi) * cos(Delta) * (sin(w2)-sin(w1))))", {
      pi: ee.Number(Math.PI),
      Gsc: 0.0820,
      dr: d2.pow(-1),
      w3: ee.Number(Math.PI).divide(12),
      w2: w(img, lm).add(ee.Number(Math.PI).divide(24)),
      w1: w(img, lm).subtract(ee.Number(Math.PI).divide(24)),
      Phi: phi.multiply(Math.PI).divide(180),
      Delta: delta

    }); //MJ m-2 hour-1
    
  var Rso = ee.Number.expression(
    "(0.75 + 2 * 0.00001 * z)*ra",{
      z: z_synoptic,
      ra: Ra
    });
  var Tmax = ee.Number(synopticFeature.get("Maximum Air Temperature (oC)")).add(273.16);
  var Tmin = ee.Number(synopticFeature.get("Minimum Air Temperature (oC)")).add(273.16);
  var Rnl = ee.Number.expression(
    "sigma * ((tmax**4 + tmin**4)/2) * (0.34 - 0.14*(Ea**0.5)) * ((1.35*rsrso)-0.35)", {
      sigma: ee.Number(2.05).multiply(1e-10),
      tmax: Tmax,
      tmin: Tmin,
      Ea: ea,
      rsrso: ee.Algorithms.If(Rs_synoptic.lte(Rso), Rs_synoptic.divide(Rso), ee.Number(1))
    });
  return ee.Number.expression(
    "((1-0.23) * rs - rnl) * 0.408", {
      rs: Rs_synoptic, //should be MJ m-2 hour-1 (be carfeul)
      rnl: Rnl
    }); // mm/hour (be careful)
};

