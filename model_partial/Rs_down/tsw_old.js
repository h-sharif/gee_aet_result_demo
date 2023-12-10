exports.tsw = function(dem){
  return dem.select('elevation').multiply(2e-5).add(0.75).rename(['tsw']); // with assumption of clear weather condition
};
