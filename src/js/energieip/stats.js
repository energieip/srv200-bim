dashboard = document.createElement("input");
dashboard.type = "image";
dashboard.title = "Dashboard";
dashboard.src = "images/bouton-home.png";
dashboard.alt = "Dashboard";
dashboard.style.float = "left";
dashboard.onclick = function () {
    window.location.href = 'dashboard.html';
};
placeHolder = document.getElementById("top");
placeHolder.appendChild(dashboard);

logo = document.createElement("img");
logo.title = "EnergieIP";
logo.src = "images/logo-energieip.png";
logo.alt = "EnergieIP";
placeHolder = document.getElementById("top");
placeHolder.appendChild(logo);

logout = document.createElement("input");
logout.type = "image";
logout.title = "Logout";
logout.src = "images/bouton-logout.png";
logout.alt = "Logout";
logout.style.float = "right";
logout.onclick = function () {
    window.location.href = 'logout.html';
};
placeHolder = document.getElementById("top");
placeHolder.appendChild(logout);

lighting = document.createElement("input");
lighting.type = "image";
lighting.title = "Lighting";
lighting.src = "images/bouton-led.png";
lighting.alt = "Lighting";
lighting.onclick = function () {
    CreateLeds();
};
placeHolder = document.getElementById("bottom");
placeHolder.appendChild(lighting);

hvac = document.createElement("input");
hvac.type = "image";
hvac.title = "Hvacs";
hvac.src = "images/bouton-hvac.png";
hvac.alt = "Hvacs";
hvac.onclick = function () {
    CreateHvacs();
};
placeHolder = document.getElementById("bottom");
placeHolder.appendChild(hvac);

blind = document.createElement("input");
blind.type = "image";
blind.title = "Blinds";
blind.src = "images/bouton-store.png";
blind.alt = "Blinds";
blind.onclick = function () {
    CreateBlinds();
};
placeHolder = document.getElementById("bottom");
placeHolder.appendChild(blind);

$(document).ready(function() {
    if ($.cookie(energieip.accessToken)!= null) {
        CreateLeds();
    } else {
        window.location.href = energieip.loginPage;
    }
});

function createGraph(lbl, color){
    var config = {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: lbl,
                data: [],
                backgroundColor: color,
				borderColor: color,
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
    return config;

}

function CreateLeds(){
    var config = createGraph('Lighting', window.chartColors.yellow);
    var ctx = document.getElementById('stats').getContext('2d');
    window.myLine = new Chart(ctx, config);
    energieip.ConsumptionsEvent(function(evt) {
        config.data.labels.push(evt.date);
        config.data.datasets[0].data.push(evt.leds);
        window.myLine.update();
        }
    );
};

function CreateHvacs(){
    var config = createGraph('HVACs', window.chartColors.red);
    var ctx = document.getElementById('stats').getContext('2d');
    window.myLine = new Chart(ctx, config);
    energieip.ConsumptionsEvent(function(evt) {
        config.data.labels.push(evt.date);
        config.data.datasets[0].data.push(evt.hvacs);
        window.myLine.update();
        }
    );
};

function CreateBlinds(){
    var config = createGraph('Blinds', window.chartColors.green);
    var ctx = document.getElementById('stats').getContext('2d');
    window.myLine = new Chart(ctx, config);
    energieip.ConsumptionsEvent(function(evt) {
        config.data.labels.push(evt.date);
        config.data.datasets[0].data.push(evt.hvacs);
        window.myLine.update();
        }
    );
};