//load the production data
consuptionSerie = [];
productionSerie = [];
immissionSerie = [];

//todo produzione va spostata avanti di 1 ora
function getFile(file,dataStorage){
		var xhr = new XMLHttpRequest();
		xhr.onload = function() {
			if (xhr.status === 200) {
				//alert('Reply ' + xhr.responseText);
				// Parse CSV string
				var data = Papa.parse(xhr.responseText).data;
				//console.log(data);
				

				
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
						dataStorage.push([currDate, power]);
					}
				}
			}
			else {
				//alert('Request failed.  Returned status of ' + xhr.status);
				//console.log('Request failed.  Returned status of ' + xhr.status);
				console.log('File failed: ' + file);
			}
		};
		xhr.open('GET', file, false);
		xhr.send();
		return xhr;
}

//consumi
/*
var anni = [2019,2020];
var mesi = ('gennaio febbraio marzo aprile maggio giugno luglio agosto settembre ottobre novembre dicembre').split(' '); 
*/
var anni = [2020];
var mesi = ('gennaio febbraio marzo aprile').split(' '); 
//consumi
anni.forEach(function(anno){
	mesi.forEach(function (mese){
		getFile('./Consumi/'+anno+'/ExportData_'+mese+'.csv',consuptionSerie);		
	});
});

//consumi
anni.forEach(function(anno){
	mesi.forEach(function (mese){
		getFile('./Immissioni/'+anno+'/ExportData_'+mese+'.csv',immissionSerie);		
	});
});

//immissioni
/*
getFile('./Consumi/2019/ExportData_luglio.csv',consuptionSerie);
getFile('./Consumi/2019/ExportData_agosto.csv',consuptionSerie);
getFile('./Consumi/2019/ExportData_settembre.csv',consuptionSerie);
getFile('./Consumi/2019/ExportData_ottobre.csv',consuptionSerie);
getFile('./Consumi/2019/ExportData_novembre.csv',consuptionSerie);
getFile('./Consumi/2019/ExportData_dicembre.csv',consuptionSerie);
getFile('./Consumi/2020/ExportData_gennaio.csv',consuptionSerie);
getFile('./Consumi/2020/ExportData_febbraio.csv',consuptionSerie);
getFile('./Consumi/2020/ExportData_marzo.csv',consuptionSerie);

//immissioni
getFile('./Immissioni/2019/ExportData_settembre.csv',immissionSerie);
getFile('./Immissioni/2019/ExportData_ottobre.csv',immissionSerie);
getFile('./Immissioni/2019/ExportData_novembre.csv',immissionSerie);
getFile('./Immissioni/2019/ExportData_dicembre.csv',immissionSerie);
getFile('./Immissioni/2020/ExportData_gennaio.csv',immissionSerie);
getFile('./Immissioni/2020/ExportData_febbraio.csv',immissionSerie);
getFile('./Immissioni/2020/ExportData_marzo.csv',immissionSerie);
*/
//get the production data

var xhrBIS = new XMLHttpRequest();
xhrBIS.open('GET', './Produzione/master.txt');
xhrBIS.onload = function() {
	if (xhrBIS.status === 200) {
		//alert('Reply ' + xhr.responseText);
		// Parse CSV string
		var dataBIS = Papa.parse(xhrBIS.responseText).data;
		//console.log(dataBIS);
		
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
			
			
			//console.log(year, month, day, hours, minutes);
			
			//new Date(year, month, day, hours, minutes, seconds, milliseconds)
			var currDateBIS = Date.parse(new Date(year, month, day, hours, minutes, 0, 0).toString());
			//console.log(currDateBIS.toString());
						
			var powerBIS = dataBIS[i][1]/1000;
			productionSerie.push([currDateBIS, powerBIS]);
		
		}
		//BUILD THE CHART
		var myData = {};
		myData.productionSerie = productionSerie;
		myData.consuptionSerie = consuptionSerie;
		myData.immissionSerie = immissionSerie;
		
		//console.log ('Production Serie', productionSerie);
		//console.log ('Consumption Serie', consuptionSerie);
		
		//console.log(myData);
		buildChart(myData);
	}
	else {
		//alert('Request failed.  Returned status of ' + xhr.status);
		//console.log('Request failed.  Returned status of ' + xhr.status);
		console.log('File failed: ' + file);

	}
};
xhrBIS.send();	


function buildChart(data){

        //Highcharts.chart('container', {*/
		Highcharts.stockChart('container', {
            chart: {
                zoomType: 'x',
				height: 800,
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
                    text: 'produzione/consumo kWh',
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
				},
				{
					type: 'area',
					name: 'immissioni kWh',
					data: data.immissionSerie,
					color: '#4977eb'
				}
			],
			scrollbar: {
				height: 100
			},
        });
	
}