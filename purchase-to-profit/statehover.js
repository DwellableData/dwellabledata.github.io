(function(){

	var usa={};

	usa.draw = function(id, statedata, toolTip, projection){		

		//function to get path in correct format with states data
		function transform(coordinates, projection) {
			path = "";
			if (coordinates[0].length === 2) {
				positions = [];
				for (x in coordinates) {
					var location = [+coordinates[x][0], +coordinates[x][1]];
					positions.push(projection(location))
				};
				path += ("M" + positions.join("L") + "Z");
			} else { //check if there are islands/multiple shapes in the state
				for (x in coordinates) {
					path += transform(coordinates[x], projection);
				};
			};
			return path;
		}

	  	d3.json("us-states.json", function(collection) {

	    	d3.select(id).selectAll(".state")
	    		.data(collection.features)
	      		.enter().append("path")
	      			.attr("class", "state")
	        		.attr("d", function(d) {
	        			statename = d["properties"]["name"]; 

	        			if (statedata[statename] != undefined) {
							x = transform(d["geometry"]["coordinates"], projection);
							return x;
	        			};


	        		})
	        		.style("fill",function(d) { 
	        			statename = d["properties"]["name"]; 
	        			if (statedata[statename] != undefined) {
	        				return statedata[statename]["color"]; 
	        			};
	        		})
					.on("mouseover", function(d) {
	        			statename = d["properties"]["name"];
						d3.select("#tooltip").transition().duration(200).style("opacity", 0.9);      
						d3.select("#tooltip").html(toolTip(statedata[statename]))  
							.style("left", (d3.event.pageX) + "px")     
							.style("top", (d3.event.pageY - 28) + "px");
					}) 
					.on("mouseout", function(d) {
						var xPosition = d3.select(this).attr("cx");
          				var yPosition = d3.select(this).attr("cy");

						d3.select("#tooltip").transition().duration(700).style("opacity", 0);    
					});

			darkbluestates = ["South Dakota", "Indiana", "Georgia", "Kentucky"]
			d3.select(id).selectAll(".labelgrey")
				.data(collection.features).enter().append("svg:text").attr("class", "labelgrey")
					.text(function(d){
						statename = d["properties"]["name"];
						if (statedata[statename] != undefined && darkbluestates.indexOf(statename) > -1) {
				        	return statedata[statename].years;							
						}
				    })
				    .attr("x", function(d){
				    	statename = d["properties"]["name"]; 
				    	if (statedata[statename] != undefined) {
				        	return statedata[statename].longitude;						
						}
				    })
				    .attr("y", function(d){
				    	statename = d["properties"]["name"]; 
				    	if (statedata[statename] != undefined) {
				        	return statedata[statename].latitude;					
						}
				    })
				    .style("fill", "#c8d1d6");


			d3.select(id).selectAll(".labelblack")
				.data(collection.features).enter().append("svg:text").attr("class", "labelblack")
					.text(function(d){
						statename = d["properties"]["name"];
						if (statedata[statename] != undefined && darkbluestates.indexOf(statename) == -1) {
				        	return statedata[statename].years;							
						}
				    })
				    .attr("x", function(d){
				    	statename = d["properties"]["name"]; 
				    	if (statedata[statename] != undefined) {
				        	return statedata[statename].longitude;						
						}
				    })
				    .attr("y", function(d){
				    	statename = d["properties"]["name"]; 
				    	if (statedata[statename] != undefined) {
				        	return statedata[statename].latitude;					
						}
				    })
				    .style("fill", "#3A4145");



	    });

	};

	this.usa=usa;
})();

