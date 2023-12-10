exports.tsw = function(image, P, teta, Kt, W){
  var NaN_obj = teta.pow(-1).multiply(W)
  var NaN_solution = (NaN_obj.abs().pow(-0.6)).multiply(NaN_obj);
  var tsw = P.expression(
    "0.35 +  (0.627 * exp((-0.00146*p/(k*ct))-0.075*N))",{
      p: P,
      N: NaN_solution,
      k: Kt,
      ct: teta
    });
  return tsw ;
};