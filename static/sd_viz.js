document.addEventListener('DOMContentLoaded', () => {

	//Initialize graph function
	function sd_graph(data1, data2, retlabels, sglabels, type, year, axis) {

		var da_graph = new Chart(document.getElementById("my_canvas"), {
		    type: 'bar',
		    data: {
		      labels: retlabels,
		      datasets: [
		        {
		          label: sglabels[0],
		          backgroundColor: "#2E4372",
		          data: data1
		        },
		        {
		        	label: sglabels[1],
		        	backgroundColor: "#8e5ea2",
		        	data: data2
		        }
		      ]
		    },
		    options: {
		    	responsive: true,
				legend: { display: true },
				title: {
		        	display: true,
		        	fontSize: 18,
		        	fontColor: "#061539",
		        	text: [axis + " - District " + district, 
		        			'(' + type + ', ' + (year - 1) + '-' + year.toString().substring(2, 4) 
		        			+ ' School Year)']
		      	},
		      	scales: {
					xAxes: [{
						scaleLabel: {
							display: true,
							fontSize: 16,
							fontStyle: "bold",
							labelString: 'Distance in Miles'
          				},
	 					gridLines: {
		                	display: false
		            	}
	    	    	}],
	        		yAxes: [{
	        			scaleLabel: {
	        				display: true,
	        				fontSize: 16,
							fontStyle: "bold",
	        				labelString: axis
	        			},
	        			ticks: {
          					beginAtZero: true
          				},
	            		gridLines: {
	                		display: false
	            		}   
	        		}]
	    		}
		    }
		})
	}


	function ajax_request(sy, type, metric, subgroup) {

		// Initialize new request
		const request = new XMLHttpRequest();
		request.open('POST', '/school_distance/district');
		
		var school_year = sy;
		var school_type = type;
		var metric = metric;
		var subgroup = subgroup;

		// Callback function on return then call graph fxn
		request.onload = function() {
			const data = JSON.parse(request.responseText);
			const return_datas_1 = data.results_1
			const return_datas_2 = data.results_2
			const return_labels = data.labels
			const subgroup_labels = data.subgroup_labels
			const axis = data.axis

			sd_graph(return_datas_1, return_datas_2, return_labels, subgroup_labels, school_type, school_year, axis)
		}

		// Add Data & Send Request
		const data = new FormData()

		data.append('school_year', school_year)
		data.append('school_type', school_type)
		data.append('metric', metric)
		data.append('subgroup', subgroup)
		data.append('district', district)

		request.send(data)
		return false
	}

	ajax_request(2019, 'All Schools', 'pct', 'Gender')


	document.querySelectorAll('.rad').forEach(rad => {
		rad.onclick = () => {

			// Remove the Canvas
			const fadeBox = document.getElementById("my_canvas");
			fadeBox.style.opacity = 0;
			fadeBox.style.transition = "opacity 0.1s";
			fadeBox.addEventListener('webkitTransitionEnd', function(event) {
				fadeBox.remove()

				// Create New Canvas
				var canv = document.createElement('canvas');
				canv.id = "my_canvas"
				canv.style.height="500px"
				canv.style.width="1200"
				document.querySelector('#graph_can').append(canv)

				// Remove the Canvas and Add a New One
				document.querySelector("#my_canvas").remove();
				var canv = document.createElement('canvas');
				canv.id = "my_canvas"
				document.querySelector('#graph_can').append(canv)

				// Get New Parameters Based on Radio Boxes Selected
				var radios = document.querySelectorAll('input[type="radio"]:checked')
				var year = radios.length>0? radios[0].value: null;
				var type = radios.length>0? radios[1].value: null;
				var metric = radios.length>0? radios[2].value: null;
				var subgroup = radios.length>0? radios[3].value: null;

				ajax_request(year, type, metric, subgroup)	
			});
		};
	});
})