function CreateStats(){
    
    var config = {
        type: 'line',
        data: {
            labels: [],
            datasets: [
            {
                label: 'Blinds',
                data: [],
                backgroundColor: window.chartColors.green,
                borderColor: window.chartColors.green,
                borderWidth: 1,
                fill: false,
            }
        ]
        },
        options: {
            responsive: true,

            title: {
					display: true,
					text: 'Energy consumption'
				},
				tooltips: {
					mode: 'index',
					intersect: false,
				},
				hover: {
					mode: 'nearest',
					intersect: true
				},
				scales: {
					xAxes: [{
						display: true,
						scaleLabel: {
							display: true,
							labelString: 'Date'
						}
					}],
					yAxes: [{
						display: true,
                        ticks: {
                            beginAtZero: true
                        },
						scaleLabel: {
							display: true,
							labelString: 'Power (Watts)'
						}
					}]
				}
        }
    }

    window.onload = function() {

        var ctx = document.getElementById('stats').getContext('2d');
        window.myLine = new Chart(ctx, config);
        energieip.ConsumptionsEvent(function(evt) {
            config.data.labels.push(evt.date);
            config.data.datasets[0].data.push(evt.blinds);
            window.myLine.update();
            }
        );
    };
};