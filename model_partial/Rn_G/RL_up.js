exports.Rl_up = function(lst, e0){
  return e0.expression(
    "e * sigma * (t**4)",{
      e:e0,
      sigma: 5.67e-08,
      t: lst
    }).rename(['Rl_up']);
};