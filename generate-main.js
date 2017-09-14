'use strict';

const fs = require('fs'),
	readMultipleFiles = require('read-multiple-files'),
	dirPath = './provinces/';

fs.readdir(dirPath, (err,filesPath) => {
	if (err) throw err;
	filesPath = filesPath.map(filePath => dirPath + filePath);
	readMultipleFiles(filesPath, 'utf8', (err,data) => {
		if (err) throw err;
		let i = 0;

		let generateCode = data.map(coords => {
			let colorGen = Math.floor(0x1000000 * Math.random()).toString(16);
			let color = '#' + ('000000' + colorGen).slice(-6);
			i += 1;
			return `
				var shape${i}Coords = ${coords};
				var shape${i} = new google.maps.Polygon({
				    paths: shape${i}Coords,
				    strokeColor: '${color}',
				    strokeOpacity: 0.8,
				    strokeWeight: 2,
				    fillColor: '${color}',
				    fillOpacity: 0.5
			    });
			    shape${i}.setMap(map);
			`;
		});
		generateCode = generateCode.reduce((aggregate, coordinate) => aggregate + coordinate);

		let content = `
	        <!DOCTYPE html>
	        <html>
	          <head>
	            <meta name="viewport" content="initial-scale=1.0, user-scalable=no">
	            <meta charset="utf-8">
	            <title>Simple Polygon</title>
	            <style>
	              #map {
	                height: 100%;
	              }
	              html, body {
	                height: 100%;
	                margin: 0;
	                padding: 0;
	              }
	            </style>
	          </head>
	          <body>
	            <div id="map"></div>
	            <script>
	              function initMap() {
	                var map = new google.maps.Map(document.getElementById('map'), {
	                  zoom: 6,
	                  center: {lat: 13.1024, lng: 120.7651}, // MINDORO
	                  mapTypeId: 'terrain'
	                });

	               ${generateCode}
	              }
	            </script>
	            <script async defer
	            src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDl32dSXGt7MYeJnkofk4mARVT4VUF5Poo&callback=initMap">
	            </script>
	          </body>
	        </html>
	    `;


		fs.writeFile('index.html', content, err => {
		    if (err) return err;
		})
	})
});