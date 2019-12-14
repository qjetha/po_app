document.addEventListener('DOMContentLoaded', () => {

	// Graph 1 - Single Bar (no subgroup, no proportion)
	function po_graph(data, labels, title, n) {

		var po_graph = new Chart(document.getElementById('my_canvas'), {
		    type: 'bar',
		    data: {
		      labels: labels,
		      datasets: [
		        {
		          label: "Percentage of Respondents",
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
		        	fontSize: 20,
		        	fontColor: "#061539",
		        	text: [title, ' ', ' '],
		      	},
		      	scales: {
					xAxes: [{
						ticks: {
							fontSize: 15,
						},
	 					gridLines: {
		                	display:false
		            	}
	    	    	}],
	        		yAxes: [{
	        			ticks: {
	        				suggestedMax: 60,
	        				min: 0,
	        				fontSize: 15
	        			},
	        			scaleLabel: {
	        				display: true,
	        				fontSize: 18,
	        				fontColor: "#061539",
							fontStyle: "bold",
	        				labelString: 'Percentage of Respondents',
	        				padding: 20
	        			},
	            		gridLines: {
	                		display:false
	            		}   
	        		}]
	    		}
		    }
		});

		note = document.getElementById('subtitle')
		note.innerHTML = 'n = ' + n + ' respondents'
	}


	// Graph 2 - Double Bar (subgroup, no proportion)
	function po_graph_dual(data_True, data_False, title, retlabels, s1, s2, s_label, nF, nT) {

		var po_graph_dual = new Chart(document.getElementById("my_canvas"), {
		    type: 'bar',
		    data: {
		      labels: retlabels,
		      datasets: [
		        {
		          label: s1,
		          backgroundColor: "#2E4372",
		          data: data_True
		        },
		        {
		        	label: s2,
		        	backgroundColor: "#8e5ea2",
		        	data: data_False
		        }
		      ]
		    },
		    options: {
		    	responsive: true,
				legend: { 
					display: true,
					position: 'top',
					labels: {
						padding: 15,
						fontSize: 16
					}
				},
				title: {
		        	display: true,
		        	fontSize: 20,
		        	fontColor: "#061539",
		        	text: [title, '[By ' + s_label + ']']
		      	},
		      	scales: {
					xAxes: [{
						ticks: {
							fontSize: 15,
						},
	 					gridLines: {
		                	display: false
		            	}
		            }],
	        		yAxes: [{
	        			ticks: {
	        				suggestedMax: 60,
	        				min: 0,
	        				fontSize: 15
	        			},
	        			scaleLabel: {
	        				display: true,
	        				fontSize: 18,
	        				fontColor: "#061539",
							fontStyle: "bold",
	        				labelString: 'Percentage of Respondents',
	        				padding: 20
	        			},
	            		gridLines: {
	                		display:false
	            		}   
	        		}]
	    		}
		    }
		})

		note = document.getElementById('subtitle')
		note.innerHTML = s1 + ' = ' + nT + ' respondents' + '<br>' + s2 + ' = ' + nF + ' respondents'
	}


	// Graph 3 - Proportion Simple (No Subgroup)
	function po_graph_prop(data, title, n) {

		var po_graph_prop = new Chart(document.getElementById('my_canvas'), {
		    type: 'bar',
		    data: {
		      datasets: [
		        {
		          label: "Percentage of Respondents",
		          backgroundColor: "#2E4372",
		          data: [data]
		        }
		      ]
		    },
		    options: {
		    	responsive: true,
				legend: { display: false },
				title: {
		        	display: true,
		        	fontSize: 20,
		        	fontColor: "#061539",
		        	text: [title, ' ', ' '],
		      	},
		      	scales: {
					xAxes: [{
						ticks: {
							fontSize: 15,
						},
	 					gridLines: {
		                	display:false
		            	}
	    	    	}],
	        		yAxes: [{
	        			ticks: {
	        				suggestedMax: 100,
	        				min: 0,
	        				fontSize: 15
	        			},
	        			scaleLabel: {
	        				display: true,
	        				fontSize: 18,
	        				fontColor: "#061539",
							fontStyle: "bold",
	        				labelString: '% of Respondents Who Agree or Strongly Agree',
	        				padding: 20
	        			},
	            		gridLines: {
	                		display:false
	            		}   
	        		}]
	    		}
		    }
		});

		note = document.getElementById('subtitle')
		note.innerHTML = 'n = ' + n + ' respondents'
	}


	// Graph 4 - Proportion With Subgroup
	function po_graph_dual_prop(data_True, data_False, title, s1, s2, s_label, nF, nT) {
		var po_graph_dual_prop = new Chart(document.getElementById("my_canvas"), {
		    type: 'bar',
		    data: {
		      datasets: [
		        {
		          label: s1,
		          backgroundColor: "#2E4372",
		          data: [data_True]
		        },
		        {
		        	label: s2,
		        	backgroundColor: "#8e5ea2",
		        	data: [data_False]
		        }
		      ]
		    },
		    options: {
		    	responsive: true,
				legend: { 
					display: true,
					position: 'top',
					labels: {
						padding: 15,
						fontSize: 16
					}				
				},
				title: {
		        	display: true,
		        	fontSize: 20,
		        	fontColor: "#061539",
		        	text: [title, '[By ' + s_label + ']']
		      	},
		      	scales: {
					xAxes: [{
						ticks: {
							fontSize: 15,
						},
	 					gridLines: {
		                	display: false
		            	}
		            }],
	        		yAxes: [{
	        			ticks: {
	        				suggestedMax: 100,
	        				min: 0,
	        				fontSize: 15
	        			},
	        			scaleLabel: {
	        				display: true,
	        				fontSize: 18,
	        				fontColor: "#061539",
							fontStyle: "bold",
	        				labelString: '% of Respondents Who Agree or Strongly Agree',
	        				padding: 20
	        			},
	            		gridLines: {
	                		display:false
	            		}   
	        		}]
	    		}
		    }
		})

		note = document.getElementById('subtitle')
		note.innerHTML = s1 + ' = ' + nT + ' respondents' + '<br>' + s2 + ' = ' + nF + ' respondents'
	}


	function ajax_request(question, outcome, subgroup) {

		// Initialize new request
		const request = new XMLHttpRequest();
		request.open('POST', '/');

		// Callback function on return then call graph fxn
		request.onload = function() {
			const data = JSON.parse(request.responseText);

			if ((outcome=='proportion') && (subgroup=='none')) {
				const return_datas = data.datas
				const return_title = data.titles
				const return_n = data.n

				po_graph_prop(return_datas, return_title, return_n)
			}
			if ((subgroup=='none') && (outcome=='likert')) {
				const return_datas = data.datas
				const return_labels = data.labels
				const return_title = data.titles
				const return_n = data.n
				
				po_graph(return_datas, return_labels, return_title, return_n)
			}
			if ((subgroup!='none') && (outcome=='likert')) {
				const data_True = data.Data_True
				const data_False = data.Data_False
				const return_title = data.titles
				const return_labels = data.labels
				const s1 = data.s1
				const s2 = data.s2
				const s_label = data.slabel
				const nF = data.nF
				const nT = data.nT
				
				po_graph_dual(data_True, data_False, return_title, return_labels, s1, s2, s_label, nF, nT)
			}
			if ((subgroup!='none') && (outcome!='likert')) {
				const data_True = data.Data_True
				const data_False = data.Data_False
				const return_title = data.titles
				const s1 = data.s1
				const s2 = data.s2
				const s_label = data.slabel
				const nF = data.nF
				const nT = data.nT
				
				po_graph_dual_prop(data_True, data_False, return_title, s1, s2, s_label, nF, nT)	
			}
		}

		// Add Data & Send Request
		const data = new FormData()

		data.append('series', question)
		data.append('outcome', outcome)
		data.append('subgroup', subgroup)

		request.send(data)
		return false;
	}

	ajax_request('Important to learn about Golden Triangle of Trade', 'likert', 'none')


	function pre_ajax_request() {

		// Transition Canvas to Opacity = 0
		const fadeBox = document.getElementById("my_canvas");
		fadeBox.style.opacity = 0;
		fadeBox.style.transition = "opacity 0.1s";

		fadeBox.addEventListener('webkitTransitionEnd', function(event) {
			fadeBox.remove()

			// Add a New Canvas
			var canv = document.createElement('canvas');
			canv.id = "my_canvas"
			document.querySelector('#graph_can').append(canv)

			// Get New Parameters Based on Radio Boxes Selected
			var sel = document.getElementById('option_list');
			var question = sel.options[sel.selectedIndex].text;

			var radios = document.querySelectorAll('input[type="radio"]:checked')
			var sgroup = radios[0].value;
			var outcome = radios[1].value;

			ajax_request(question, outcome, sgroup)	
		})
	}

	// Run pre-ajax request if question changes
	document.getElementById('option_list').onchange = function() {
		pre_ajax_request()
	}

	// Run pre-ajax request if subgroup or outcome changes
	document.querySelectorAll('.rad').forEach(rad => {
		rad.onclick = () => {
			pre_ajax_request()
		}
	})
})

