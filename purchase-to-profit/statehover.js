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

			key_stateids = ["Washington", "California", "Colorado", "Georgia", "Hawaii", "Illinois", "Louisiana", "Massachusetts", "Montana", "North Carolina"];

			d3.select(id).selectAll(".labelname")
				.data(collection.features).enter().append("text").attr("class","labelname")
					.html(function(d){
						statename = d["properties"]["name"]; 

						if ((statedata[statename] != undefined) && (key_stateids.indexOf(statename) > -1)) {
				        	return (statedata[statename].label);
						};
						return "";
				    })
				    .attr("x", function(d){
				    	statename = d["properties"]["name"]; 
	        			if (statedata[statename] != undefined) {
				        	return statedata[statename].longitude;
				        };
				    })
				    .attr("y", function(d){
				    	statename = d["properties"]["name"]; 
	        			if (statedata[statename] != undefined) {
				        	return statedata[statename].latitude - 5;
				        };
				    });

			d3.select(id).selectAll(".labeldescription")
				.data(collection.features).enter().append("text").attr("class","labeldescription")
					.html(function(d){
						statename = d["properties"]["name"]; 
						  var format = d3.format("$,");

						if ((statedata[statename] != undefined) && (key_stateids.indexOf(statename) > -1)) {
				        	return (format(statedata[statename].home) + ", " + statedata[statename].years + " years");
						};
						return "";
				    })
				    .attr("x", function(d){
				    	statename = d["properties"]["name"]; 
	        			if (statedata[statename] != undefined) {
				        	return statedata[statename].longitude;
				        };
				    })
				    .attr("y", function(d){
				    	statename = d["properties"]["name"]; 
	        			if (statedata[statename] != undefined) {
				        	return statedata[statename].latitude + 5;
				        };
				    });


	    });

	};

	this.usa=usa;
})();

