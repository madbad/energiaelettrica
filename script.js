//load the production data
consuptionSerie = [];
productionSerie = [];

var xhr = new XMLHttpRequest();
xhr.open('GET', './Consumi/2018/ExportData_ottobre.csv');
xhr.onload = function() {
    if (xhr.status === 200) {
        //alert('Reply ' + xhr.responseText);
		// Parse CSV string
		var data = Papa.parse(xhr.responseText).data;
		//console.log(data);
		
//		xAxis = [];
//		yAxis = [];
//		consuptionSerie = [];
		
		//remove the first array
		data.shift();
		for (var i = 0; i < data.length; i++) {
			//data[i];
			for (var h = 1; h < data[i].length; h++) {
				
				var parts = data[i][0].split("/");
				var dt = new Date(parseInt(parts[2], 10),
                  parseInt(parts[1], 10) - 1,
                  parseInt(parts[0], 10));
				
				var currDate = Date.parse(dt)+(h*15*60*1000);
			
				var power = data[i][h].replace(',','.')*1;
				consuptionSerie.push([currDate, power]);
			}
		}
		
		
		//get the production data
		
		var xhrBIS = new XMLHttpRequest();
		xhrBIS.open('GET', './Produzione/2018-10.csv');
		xhrBIS.onload = function() {
			if (xhr.status === 200) {
				//alert('Reply ' + xhr.responseText);
				// Parse CSV string
				var dataBIS = Papa.parse(xhrBIS.responseText).data;
				console.log(dataBIS);
				
//				productionSerie = [];
				
				//remove the first and last element of this array
				dataBIS.shift();
				dataBIS.pop();
				for (var i = 0; i < dataBIS.length; i++) {
					
					var day		= dataBIS[i][0].substring(0,2) *1 ;
					var month	= dataBIS[i][0].substring(3,5) *1 -1; /*we need the month index not the actual month: we count from 0*/
					var year	= dataBIS[i][0].substring(6,10) *1;
					var hours	= dataBIS[i][0].substring(11,13) *1 ;
					var minutes	= dataBIS[i][0].substring(14,16) *1 ;
					
					
					console.log(year, month, day, hours, minutes);
					
					//new Date(year, month, day, hours, minutes, seconds, milliseconds)
					var currDateBIS = Date.parse(new Date(year, month, day, hours, minutes, 0, 0).toString());
					console.log(currDateBIS.toString());
								
					var powerBIS = dataBIS[i][1]/1000;
					productionSerie.push([currDateBIS, powerBIS]);
				
				}
				//BUILD THE CHART
				var myData = {};
				myData.productionSerie = productionSerie;
				myData.consuptionSerie = consuptionSerie;
				
				console.log ('Production Serie', productionSerie);
				console.log ('Consumption Serie', consuptionSerie);
				
				//console.log(myData);
				buildChart(myData);
			}
			else {
				alert('Request failed.  Returned status of ' + xhr.status);
			}
		};
		xhrBIS.send();				
		

    }
    else {
        alert('Request failed.  Returned status of ' + xhr.status);
    }
};
xhr.send();


function buildChart(data){

        Highcharts.chart('container', {
            chart: {
                zoomType: 'x'
            },
            title: {
                text: 'Confronto energia consumi/prelievi'
            },
            subtitle: {
                text: document.ontouchstart === undefined ?
                    'Click and drag in the plot area to zoom in' : 'Pinch the chart to zoom in'
            },
            xAxis: {
                type: 'datetime'
            },
            yAxis: {
                title: {
                    text: 'produzione/consumo kWh'
                }
            },
            legend: {
                enabled: false
            },
            plotOptions: {
                area: {
					/*
                    fillColor: {
                        linearGradient: {
                            x1: 0,
                            y1: 0,
                            x2: 0,
                            y2: 1
                        },
                        stops: [
                            [0, Highcharts.getOptions().colors[0]],
                            [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                        ]
                    },
					*/
                    marker: {
                        radius: 2
                    },
                    lineWidth: 1,
                    states: {
                        hover: {
                            lineWidth: 1
                        }
                    },
                    threshold: null
                }
            },
			tooltip:{
				shared: true
				
			},

            series: [
				{
					type: 'area',
					name: 'consumo kWh',
					data: data.consuptionSerie,
					color: '#f04c2b'
				},
				{
					type: 'area',
					name: 'produzione kWh',
					data: data.productionSerie,
					color: '#359c50'
				}
			]
        });
	
}