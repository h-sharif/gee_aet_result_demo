//U200 Function
exports.U200 = function(Zomw, uw){
  // At synoptic station
  return (ee.Number(uw).multiply((ee.Number(200).divide(Zomw)).log())).divide((ee.Number(10).divide(Zomw)).log()); // all types = number
};