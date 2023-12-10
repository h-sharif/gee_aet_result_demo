exports.Albedo = function(image, tsw){
  var B2 = image.select("SR_B2");
  var B3 = image.select("SR_B3");
  var B4 = image.select("SR_B4");
  var B5 = image.select("SR_B5");
  var B6 = image.select("SR_B6");
  var B7 = image.select("SR_B7");
  var wb = [0.3, 0.277, 0.233, 0.143, 0.036, 0.012]; //Coef Band 1,2,3,4,5,7
  var albdImg = B2.expression(
    "b_2*0.3 + b_3*0.277 + b_4*0.233 + b_5*0.143 + b_6*0.036 + b_7*0.012",{
      b_2: B2,
      b_3: B3,
      b_4: B4,
      b_5: B5,
      b_6: B6,
      b_7: B7
    });
  var albdImg2 = albdImg.subtract(0.03).divide(tsw.pow(2)).rename(["albedo"]);
  return albdImg2.where(albdImg2.lt(0), ee.Image.constant(0));
};