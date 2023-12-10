exports.Rl_down = function(Ta, ea){
  return ea.expression(
    "e * sigma * (ta**4)",{
      e: ea,
      sigma: 5.67e-08,
      ta: Ta
    }).rename(['Rl_down']);
};