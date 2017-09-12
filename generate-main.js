'use strict';

const fs = require('fs'),
	readMultipleFiles = require('read-multiple-files'),
	dirPathPoly = './provinces/polygon/',
	dirPathMulti = './provinces/multipolygon/';

fs.readFile('Provinces.json', 'utf8', (err,rawData) => {
	if (err) throw err;
	rawData = JSON.parse(rawData);

	function randomColor() {
		let colorGen = Math.floor(0x1000000 * Math.random()).toString(16);
		return '#' + ('000000' + colorGen).slice(-6);
	}
	
	rawData.features.map(provinces => {
		if(provinces.geometry.type === 'Polygon') {
			fs.readdir(dirPathPoly, (err,filesPathPoly) => {
				if (err) throw err;
				filesPathPoly = filesPathPoly.map(filePathPoly => dirPathPoly + filePathPoly);
				readMultipleFiles(filesPathPoly, 'utf8', (err,data) => {
					if (err) throw err;
					let i = 0;

					let generatePoly = data.map(coords => {
						i += 1;
						return `
							var shape${i}Coords = ${coords};
							var shape${i} = new google.maps.Polygon({
							    paths: shape${i}Coords,
							    strokeColor: '${randomColor()}',
							    strokeOpacity: 0.8,
							    strokeWeight: 2,
							    fillColor: '${randomColor()}',
							    fillOpacity: 0.5
						    });
						    shape${i}.setMap(map);
						`;
					});
					generatePoly = generatePoly.reduce((aggregate, coordinate) => aggregate + coordinate);
					fs.writeFile('./polygon.js', generatePoly, err => {
					    if (err) return err;
					})
				})
			})
		} else if(provinces.geometry.type === 'MultiPolygon') {
			fs.readdir(dirPathMulti, (err,filesPathMulti) => {
				if (err) throw err;
				filesPathMulti = filesPathMulti.map(filePathMulti => dirPathMulti + filePathMulti);
				readMultipleFiles(filesPathMulti, 'utf8', (err,data) => {
					if (err) throw err;
					let i = 20;

					let generateMulti = data.map(coords => {
						i += 1;
						return `
							var shape${i}Coords = ${coords};
							var shape${i} = new google.maps.Polygon({
							    paths: shape${i}Coords,
							    strokeColor: '${randomColor()}',
							    strokeOpacity: 0.8,
							    strokeWeight: 2,
							    fillColor: '${randomColor()}',
							    fillOpacity: 0.5
						    });
						    shape${i}.setMap(map);
						`;
					});
					generateMulti = generateMulti.reduce((aggregate, coordinate) => aggregate + coordinate);
					fs.writeFile('./multipolygon.js', generateMulti, err => {
					    if (err) return err;
					})
				})
			})
		}
	})
});