//solar zenith angle over a horizental surface ==> cos(teta hor)
exports.Teta_hor = function(ph, dlt, og){
   //var dlt = delta(image);
   //var ph = phi(image);
   //var og = w(image);
   var TetaHorImage = ph.expression(
     "sd*sp + cd*cp*cw", {
       sd: dlt.sin(),
       cd: dlt.cos(),
       sp: ph.sin(),
       cp: ph.cos(),
       cw: og.cos()
     });
  return TetaHorImage;
};