exports.Rng = function(phi, delta, d2, z_synoptic, Rs_synoptic, synopticFeature, ea){
  var ph = (ee.Number(phi).multiply(Math.PI/180)).tan();
  var dl = ee.Number(delta).tan();
  var ws = (ee.Number(-1).multiply(ph).multiply(dl)).acos();
  var Ra = ee.Number.expression(
    "(24*60/pi)*Gsc*dr*((w * sin(Phi)* sin(Delta))+(cos(Phi) * cos(Delta) * sin(w)))", {
      pi: ee.Number(Math.PI),
      Gsc: 0.0820,
      dr: d2.pow(-1),
      w: ws,
      Phi: phi.multiply(Math.PI/180),
      Delta: delta

    }); //MJ m-2 day-1

  var Rso = ee.Number.expression(
    "(0.75 + 2 * 0.00001 * z)*ra",{
      z: z_synoptic,
      ra: Ra
    });
  var Tmax = ee.Number(synopticFeature.get("Maximum Air Temperature (oC)")).add(273.16);
  var Tmin = ee.Number(synopticFeature.get("Minimum Air Temperature (oC)")).add(273.16);
  var Rnl = ee.Number.expression(
    "sigma * ((tmax**4 + tmin**4)/2) * (0.34 - 0.14*(Ea**0.5)) * ((1.35*rsrso)-0.35)", {
      sigma: ee.Number(4.903).multiply(1e-09),
      tmax: Tmax,
      tmin: Tmin,
      Ea: ea,
      rsrso: ee.Algorithms.If(ee.Number(Rs_synoptic).lte(Rso), ee.Number(Rs_synoptic).divide(Rso), ee.Number(1))
    });
  return ee.Number.expression(
    "((1-0.23) * rs - rnl) * 0.408", {
      rs: Rs_synoptic, //should be MJ m-2 day-1 (be carfeul)
      rnl: Rnl
    }); // mm/day (be careful)
};

