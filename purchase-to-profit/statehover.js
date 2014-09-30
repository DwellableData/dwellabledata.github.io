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

newengland = ["Maine", "New Hampshire", "New York", "Vermont", "Massachusetts", "Rhode Island", "Connecticut", "New Jersey", "Delaware", "District of Columbia", "Maryland"]


	  	d3.json("us-states.json", function(collection) {

	    	d3.select(id).selectAll(".state")
	    		.data(collection.features)
	      		.enter().append("path")
	      			.attr("class", "state")
	        		.attr("d", function(d) {
	        			statename = d["properties"]["name"]; 

						if (statename ==  "District of Columbia") {
							dc_coords = [[[-75, 38],[-74, 38],[-74, 37],[-75, 37]]];
							statepath = transform(dc_coords, projection);
							return statepath;
						}

	        			if (statedata[statename] != undefined) {
							statepath = transform(d["geometry"]["coordinates"], projection);
							return statepath;
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
	        			NEoffset = 0
	        			if (newengland.indexOf(statename) > -1) {
	        				NEoffset = 175;
	        			}
						d3.select("#tooltip").transition().duration(200).style("opacity", 0.9);      
						d3.select("#tooltip").html(toolTip(statedata[statename]))  
							.style("left", (d3.event.pageX - NEoffset) + "px")     
							.style("top", (d3.event.pageY - 28) + "px");
					}) 
					.on("mouseout", function(d) {
						d3.select("#tooltip").transition().duration(700).style("opacity", 0);    
					});

			darkstates = ["Indiana", "Nebraska", "Ohio", "Indiana", "Wyoming", "Colorado", "North Carolina"]


			d3.select(id).selectAll(".label")
				.data(collection.features).enter().append("svg:text").attr("class", "label")
					.text(function(d){
						statename = d["properties"]["name"];
						if (statedata[statename] != undefined) {
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
				    .style("fill", function(d, i) {
				    	statename = d["properties"]["name"]; 
				    	if (statedata[statename] != undefined && darkstates.indexOf(statename) > -1) {
				        	return "#c8d1d6" 						
						}	
						return "#3A4145";
				    })
				    .on("mouseover", function(d) {
	        			statename = d["properties"]["name"];
	        			NEoffset = 0
	        			if (newengland.indexOf(statename) > -1) {
	        				NEoffset = 175;
	        			}
						d3.select("#tooltip").transition().duration(200).style("opacity", 0.9);      
						d3.select("#tooltip").html(toolTip(statedata[statename]))  
							.style("left", (d3.event.pageX - NEoffset) + "px")     
							.style("top", (d3.event.pageY - 28) + "px");
					}) 
					.on("mouseout", function(d) {
						d3.select("#tooltip").transition().duration(700).style("opacity", 0);    
					});



	    });

	};

	this.usa=usa;
})();

