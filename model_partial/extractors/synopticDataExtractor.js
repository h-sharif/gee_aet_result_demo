//In term of having synopticData with just one line of data for a day ==> All catch synoptic data function:
exports.generalsynopticData_extractor = function(image, synopticData){
  //Function of add the date column to SynopticData with type of (ee.Date)
  var AddTypeDate = function(feature){
    var date = ee.Date(feature.get("Date and Time"));
    return feature.set({"date":date});  
  };
  
  //Desire Synoptic data with ee.Date Property//
  var synopticDataWithDate = synopticData.map(AddTypeDate); //##Add a property of date = ee.Date to each feature
  var imgDate = image.date();
  var day = imgDate.get("day");
  var month = imgDate.get("month");
  var year = imgDate.get("year");
  var espDate = ee.Date.fromYMD(year, month, day);
  var featureData = synopticDataWithDate.filter(ee.Filter.eq('date', espDate)); //its a feature collection with one feature
  return featureData.first();
};