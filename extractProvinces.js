'use strict';

const jsonfile = require('jsonfile'),
    fs = require('fs'),
    srcJsonFile = 'Provinces.json';

jsonfile.readFile(srcJsonFile, (err,data) => {
    data.features.map(content => {
        let getProvName = content.properties.PROVINCE;
        let fileName = getProvName.split(" ").join("_").toLowerCase();
        fileName = fileName.split("-").join("_").toLowerCase();
        let coords;

        if(content.geometry.type === 'Polygon') {
            coords = content.geometry.coordinates[0].map(point => {
                let obj = {};
                obj['lng'] = point[0];
                obj['lat'] = point[1];
                return obj;
            });
            jsonfile.writeFile(`./provinces/polygon/${fileName}.json`, coords, err => {
                if (err) return err;
            });
        } else if(content.geometry.type === 'MultiPolygon') {
            coords = content.geometry.coordinates.map(coordinates => {
                return coordinates[0].map(point => {
                    let obj = {};
                    obj['lng'] = point[0];
                    obj['lat'] = point[1];
                    return obj;
                });
            });
            jsonfile.writeFile(`./provinces/multipolygon/${fileName}.json`, coords, err => {
                if (err) return err;
            });
        }
    })
});