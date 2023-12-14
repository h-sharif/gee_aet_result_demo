//3rd ea
//Create effective atmospheric emissivity Function for a img with ea Band
/*
allen et al function for Idaho (# 1.08 and 0.265 Coefs must be calculated by mapping
this function to the area of intreset or setting appropriate coefs)
*/
exports.ea = function(tsw){
  return tsw.expression(
    "1.08*(-log(t))**0.265", {
      t: tsw
    }).rename(["ea"]);
};
