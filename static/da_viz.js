document.addEventListener('DOMContentLoaded', () => {

	//Initialize graph function
	function da_graph(data, labels, sn, sy) {

		var da_graph = new Chart(document.getElementById("my_canvas"), {
		    type: 'bar',
		    data: {
		      labels: labels,
		      datasets: [
		        {
		          label: "Number of Students",
		          backgroundColor: "#2E4372",
		          data: data
		        }
		      ]
		    },
		    options: {
		    	responsive: true,
				legend: { display: false },
				title: {
		        	display: true,
		        	fontSize: 18,
		        	fontColor: "#061539",
		        	text: ['Days Absent - District ' + district, 
		        			'(' + sn + ', ' + (sy - 1) + '-' + sy.toString().substring(2, 4) 
		        			+ ' School Year)']
		      	},
		      	scales: {
					xAxes: [{
						scaleLabel: {
							display: true,
							fontSize: 16,
							fontStyle: "bold",
							labelString: 'Number of Days Absent'
          				},
	 					gridLines: {
		                	display:false
		            	}
	    	    	}],
	        		yAxes: [{
	        			ticks: {
	        				min: 0,
	        				max: 30
	        			},
	        			scaleLabel: {
	        				display: true,
	        				fontSize: 16,
							fontStyle: "bold",
	        				labelString: 'Number of Students'
	        			},
	            		gridLines: {
	                		display:false
	            		}   
	        		}]
	    		}
		    }
		});
	}


	function ajax_request(sy, sc, sn) {

		// Initialize new request
		const request = new XMLHttpRequest();
		request.open('POST', '/daily_absence/district');

		var school_year = sy;
		var school_code = sc;
		var school_name = sn;

		// Callback function on return then call graph fxn
		request.onload = function() {
			const data = JSON.parse(request.responseText);
			const return_datas = data.datas
			const return_labels = data.labels

			da_graph(return_datas, return_labels, school_name, school_year)
		}

		// Add Data & Send Request
		const data = new FormData()

		data.append('school_year', school_year)
		data.append('school_code', school_code)
		data.append('school_name', school_name)
		data.append('district', district)

		request.send(data)
		return false;
	}

	ajax_request(2019, 999, 'All Schools')


	document.querySelectorAll('.rad').forEach(rad => {
		rad.onclick = () => {

			// Remove the Canvas
			const fadeBox = document.getElementById("my_canvas");
			fadeBox.style.opacity = 0;
			fadeBox.style.transition = "opacity 0.1s";
			fadeBox.addEventListener('webkitTransitionEnd', function( event ) {
				fadeBox.remove()

				// Create New Canvas
				var canv = document.createElement('canvas');
				canv.id = "my_canvas"
				document.querySelector('#graph_can').append(canv)


				// Remove the Canvas and Add a New One
				document.querySelector("#my_canvas").remove();
				var canv = document.createElement('canvas');
				canv.id = "my_canvas"
				document.querySelector('#graph_can').append(canv)

				// Get New Parameters Based on Radio Boxes Selected
				var radios = document.querySelectorAll('input[type="radio"]:checked')
				var year = radios.length>0? radios[0].value: null;
				var name = radios.length>0? radios[1].value: null;

				if (name=="All Schools") {
					var code = 999
				} else {
					var code = 1
				}

				ajax_request(year, code, name)	
			})
		
		}
	})

})