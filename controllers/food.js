var request = require('request');
var async = require('async');
var parseString = require('xml2js').parseString;

String.prototype.replaceAll = function(search, replace)
{
    //if replace is null, return original string otherwise it will
    //replace search string with 'undefined'.
    if(!replace) 
        return this;

    return this.replace(new RegExp('[' + search + ']', 'g'), replace);
};

var parseWolframResults = function(res){
	console.log(res);
	res = res.replaceAll('|', '\n');
	console.log(res);
	ans = {};
	var array = res.split('\n');
	for(var i = 0; i<array.length; i++){
		array[i] = array[i].trim();
		var tarray = array[i].split(' ');
		
		for(var j = 0; j<tarray.length; j++){
			if(tarray[j] === ''){
				tarray.splice(j, 1);
				j--;
			}
		}
		console.log(tarray);

		if(tarray[0] === "total" && tarray[1] == "fat"){
			ans.totalFat = parseInt(tarray[2]) + 999*(tarray[3] === "g")*parseInt(tarray[2]);
		}
		if(tarray[0] === "saturated" && tarray[1] == "fat"){
			ans.satFat = parseInt(tarray[2]) + 999*(tarray[3] === "g")*parseInt(tarray[2]);
		}
		if(tarray[0] === "sodium"){
			ans.sodium = parseInt(tarray[1]) + 999*(tarray[2] === "g")*parseInt(tarray[1]);
		}
		if(tarray[0] === "total" && tarray[1] == "carbohydrates"){
			ans.totalCarbs = parseInt(tarray[2]) + 999*(tarray[3] === "g")*parseInt(tarray[2]);
		}
		if(tarray[0] === "protein"){
			ans.protein = parseInt(tarray[1]) + 999*(tarray[2] === "g")*parseInt(tarray[1]);
		}
		if(tarray[0] === "dietary" && tarray[1] == "fiber"){
			ans.fiber = parseInt(tarray[2]) + 999*(tarray[3] === "g")*parseInt(tarray[2]);
		}
		if(tarray[0] === "sugar"){
			ans.sugar = parseInt(tarray[1]) + 999*(tarray[2] === "g")*parseInt(tarray[1]);
		}
		if(tarray[0] === "vitamin" && tarray[1] == "A"){
			ans.vitA = parseInt(tarray[2].slice(0, tarray[2].length-1));
		}
		if(tarray[0] === "vitamin" && tarray[1] == "B6"){
			ans.vitB6 = parseInt(tarray[2].slice(0, tarray[2].length-1));
		}
		if(tarray[0] === "vitamin" && tarray[1] == "B12"){
			ans.vitB12 = parseInt(tarray[2].slice(0, tarray[2].length-1));
		}
		if(tarray[0] === "vitamin" && tarray[1] == "C"){
			ans.vitC = parseInt(tarray[2].slice(0, tarray[2].length-1));
		}
		if(tarray[0] === "vitamin" && tarray[1] == "D"){
			ans.vitD = parseInt(tarray[2].slice(0, tarray[2].length-1));
		}
		if(tarray[0] === "vitamin" && tarray[1] == "E"){
			ans.vitB12 = parseInt(tarray[2].slice(0, tarray[2].length-1));
		}
		if(tarray[0] === "riboflavin"){
			ans.riboflavin = parseInt(tarray[1].slice(0, tarray[1].length-1));
		}
		if(tarray[0] === "niacin"){
			ans.niacin = parseInt(tarray[1].slice(0, tarray[1].length-1));
		}
		if(tarray[0] === "thiamin"){
			ans.thiamin = parseInt(tarray[1].slice(0, tarray[1].length-1));
		}
		if(tarray[0] === "magnesium"){
			ans.magnesium = parseInt(tarray[1].slice(0, tarray[1].length-1));
		}
		if(tarray[0] === "folate"){
			ans.folate = parseInt(tarray[1].slice(0, tarray[1].length-1));
		}
		if(tarray[0] === "phosphorus"){
			ans.phosphorus = parseInt(tarray[1].slice(0, tarray[1].length-1));
		}
		if(tarray[0] === "zinc"){
			ans.zinc = parseInt(tarray[1].slice(0, tarray[1].length-1));
		}
		if(tarray[0] === "iron"){
			ans.iron = parseInt(tarray[1].slice(0, tarray[1].length-1));
		}

	}
	return ans;
}


// Creatde endpoint /api/routine for GET
exports.getFoods = function(req, res) {
  // Use the Beer model to find all beer
  var foods = req.body.foodArray + "";
  var foodArray = foods.split(",");
  var farray = [];
  for(var i = 0; i< foodArray.length; i++){
  	farray.push(function(callback) {
  		var name = foodArray.pop();
     	var url = "http://api.wolframalpha.com/v2/query?input=" + name + "&appid=A9QA8E-33UHX9UT6A";
     	request(url, function(err, response, body) {

        // JSON body
        if(err) { 
        	console.log(err); 
        	callback(true); 
        	return; 
        }
        console.log("inside callback 1");
        var res;
        parseString(body,{async:false, trim: true} ,function (err, result) {
        	res = result;

        console.log(name);
        for(var j = 0; j<res.queryresult.pod.length; j++){
        	if (res.queryresult.pod[j].$.title === "Nutrition facts" ||res.queryresult.pod[j].$.title === "Average nutrition facts" ){
        		// console.log(res.queryresult.pod[j].subpod[0].img);
        		res = res.queryresult.pod[j].subpod[0].img[0].$.alt;
        		break;
        	}
        }
        callback(false, {name:name, nutrition:parseWolframResults(res)});
         });
    });
     });
  }

  async.parallel(farray,
  /*
   * Collate results
   */
   function(err, results) {
   	if(err) { 
   		console.log(err); 
   		res.send(500,"Server Error"); 
   		return; 
   	}
   	res.send(results);
   }
   );
};



