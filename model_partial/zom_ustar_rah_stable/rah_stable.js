//rah Function ## Acording to Allen et al and MET sebal manual/ assume : z2= 2 m , z1= 0.1 m
//#stable condition step(0)
exports.rah = function(ustar){
  return ustar.expression(
    "log(2/0.1)/(u*0.41)", {
    u: ustar
    }).rename(['rah']);
};