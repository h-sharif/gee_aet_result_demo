exports.ETrNeededvariables = function(synopticFeature, Pressure, synopticPoint){
  var P = ee.Number(Pressure.reduceRegion({
    reducer: ee.Reducer.mean(),
    geometry: synopticPoint,
    scale: 30,
    bestEffort: true
  }).get("P"));
  var Tmax = ee.Number(synopticFeature.get("Maximum Air Temperature (oC)")).add(273.15);
  var Tmin = ee.Number(synopticFeature.get("Minimum Air Temperature (oC)")).add(273.15);
  var Tmean = ee.Number(synopticFeature.get("Average Air Temperature (oC)")).add(273.15);
  var RH = ee.Number(synopticFeature.get("Relative Humidity (%)")); 
  var e = function(t){
    return ee.Number.expression(
    "0.6108*exp((17.27*(T-273.15))/T)", {
      T: t
    });
  };
  //Vapor Pressure Es
  // input T : kelvin
  var Es = e(Tmin).add(e(Tmax)).divide(ee.Number(2));
  //Vapor Pressure Ea
  //# input T: kelvin rh: %
  var Ea = ee.Number.expression(
      "(rh/100)*es", {
        rh: RH,
        es: Es
      });
  //sycometric Coef. input P: pa
  var Gama = ee.Number(0.000665).multiply(P);
  //DELTA Kpa.c-1 # input T: Kelvin 
  var Delta = ee.Number.expression(
    "(4098*0.6108*exp((17.27*(T-273.15))/T))/(T**2)", {
      T: Tmean
    });
  return ee.List([Es, Ea, Gama, Delta]);
};