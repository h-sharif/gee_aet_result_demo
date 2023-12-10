exports.TetaRel = function(ph, dlt, s, ap, og){
  //var dlt = delta(image); // computed variable simillar for each pixel
  //var s = slope(getDEM(image)).select('slope').multiply(Math.PI/180).clip(imageGeo(image));   // an image with band = "slope"
  //var ap = aspect(getDEM(image)).select('aspect').multiply(Math.PI/180).clip(imageGeo(image)); // an image with band = "aspect"
  //var og = w(image);  // computed variable simillar for each pixel
  //var ph = phi(image);           // computed latitude for each pixel
  var TetaRelImage = s.expression(
    "sd*sp*cs - sd*cp*ss*casp + cd*cp*cs*cw + cd*sp*ss*casp*cw + cd*sasp*ss*sw", {
      ss: s.sin(),
      cs: s.cos(),
      sd: dlt.sin(),
      cd: dlt.cos(),
      sp: ph.sin(),
      cp: ph.cos(),
      sw: og.sin(),
      cw: og.cos(),
      sasp: ap.sin(),
      casp: ap.cos()
    }).rename(["TetaRel"]);
  TetaRelImage = TetaRelImage.where(TetaRelImage.lt(0), ee.Image.constant(0));
  return TetaRelImage; // This is the cos(teta rel) picture
};
