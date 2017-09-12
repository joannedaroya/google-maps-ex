const fs = require('fs'),
	readMultipleFiles = require('read-multiple-files'),
	files = ['polygon.js', 'multipolygon.js'];

readMultipleFiles(files, 'utf8', (err,data) => {
	if (err) throw err;
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

	               ${data[0]}
	               ${data[1]}
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