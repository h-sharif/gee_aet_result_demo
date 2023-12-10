//Albido Functions
exports.Albedo = function(image, Lb, tsw, esd){
  //Kb function for Albido
  var kb = function(lb, rb, z, des){
    return lb.divide(rb).multiply(Math.PI).divide((z.multiply(des)).cos());
  };
  var Z = ee.Number(image.get("SOLAR_ZENITH_ANGLE"));
  var k2 = kb(Lb.select("B2"), image.select("SR_B2"), Z, esd);
  var k3 = kb(Lb.select("B3"), image.select("SR_B3"), Z, esd);
  var k4 = kb(Lb.select("B4"), image.select("SR_B4"), Z, esd);
  var k5 = kb(Lb.select("B5"), image.select("SR_B5"), Z, esd);
  var k6 = kb(Lb.select("B6"), image.select("SR_B6"), Z, esd);
  var k7 = kb(Lb.select("B7"), image.select("SR_B7"), Z, esd);
  var sum = k2.add(k3).add(k4).add(k5).add(k6).add(k7);
  var w2 = k2.divide(sum);
  var w3 = k3.divide(sum);
  var w4 = k4.divide(sum);
  var w5 = k5.divide(sum);
  var w6 = k6.divide(sum);
  var w7 = k7.divide(sum);

  var wb = ee.List([w2, w3, w4, w5, w6, w7]);
  
  var B2 = image.select("SR_B2");
  var B3 = image.select("SR_B3");
  var B4 = image.select("SR_B4");
  var B5 = image.select("SR_B5");
  var B6 = image.select("SR_B6");
  var B7 = image.select("SR_B7");

  var albdImg = B2.expression(
    "b2*W1 + b3*W2 + b4*W3 + b5*W4 + b6*W5 + b7*W6",{
      b2: B2,
      W1: w2,
      b3: B3,
      W2: w3,
      b4: B4,
      W3: w4,
      b5: B5,
      W4: w5,
      b6: B6,
      W5: w6,
      b7: B7,
      W6: w7
    });
  var albdImg_revised =  albdImg.mask(albdImg.gt(0));
  return albdImg_revised.subtract(0.03).divide(tsw.pow(2));
};