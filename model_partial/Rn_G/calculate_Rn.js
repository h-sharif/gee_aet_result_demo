exports.Rn = function(albedo, rs, rl_up, rl_down, e0){
  return albedo.expression(
    "(1-alpha) * Rs + rld - rlu - (1-eps)*rld", {
      alpha: albedo,
      Rs: rs,
      rld: rl_down,
      rlu: rl_up,
      eps: e0
    }).rename(["Rn"]);
};