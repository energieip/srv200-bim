/**
 * eip
 */

(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.energieip = {})));
}(this, (function (exports) { 'use strict';

/**
 The energieip namespace.

 @class energieip
 @main energieip
 @static
 @author EnergieIP / https://www.energie-ip.com/
 */
const address = '10.0.0.209:8888';
const weblink = 'http://'+address+'/';

const driver = "driver";
const ledDriver = "led";
const sensorDriver = "sensor";

energieip.Notifications = function () {
	var ws = new WebSocket("ws://" + address + "/events");

	ws.onmessage = function (evt) {
		console.log("=== Received " + evt.data);
	};

	ws.onclose = function() {
		console.log("connection close ");
	};

	ws.onerror = function() {
		console.log("connection on erreur ");
	};

}

energieip.GetIfcDump = function (labels) {
	var Http = new XMLHttpRequest();
	var url = energieip.weblink + 'dump'
	if (labels!= ""){ 
		url += '?labels=' + labels;
	}
	console.log("== url", url);
	Http.open("GET", url, false); //synchrone request
	Http.send();
	var drivers = {};

	if (Http.status === 200){
		var obj = JSON.parse(Http.responseText);

		for (var i  in obj) {
			for (var elt  in obj[i]){
				var driver = obj[i][elt];
				if (driver["ifc"] == null){
					continue
				}
				var label = driver["ifc"].label;
				drivers[label] = driver;
			}
			
		}
		return drivers;
	}
}

exports.address = address;
exports.weblink = weblink;
exports.driver = driver;
exports.ledDriver = ledDriver;
exports.sensorDriver = sensorDriver;

Object.defineProperty(exports, '__esModule', { value: true });

})));
