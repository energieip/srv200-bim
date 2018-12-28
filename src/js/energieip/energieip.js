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

energieip.Notifications = function (cbkOnMessage) {
	var ws = new WebSocket("ws://" + address + "/events");

	ws.onmessage = function (evt) {
		var event = JSON.parse(evt.data);
		cbkOnMessage(event);
	};

	ws.onclose = function() {
		console.log("connection close; reconnect");
		energieip.Notifications(cbkOnMessage);
	};

	ws.onerror = function() {
		console.log("connection on erreur ");
	};

}

energieip.GetIfcDump = function (labels, cbk) {
	var Http = new XMLHttpRequest();
	var url = energieip.weblink + 'dump'
	if (labels!= ""){ 
		url += '?labels=' + labels;
	}
	Http.open("GET", url, true);
	Http.send();
	var drivers = {};
	Http.onreadystatechange = function() {
		if (this.readyState === XMLHttpRequest.DONE){
			if (this.status === 200) {
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
				cbk(drivers);
			}
		}
	}
}

energieip.GetGroupStatus = function (grID, cbk) {
	var Http = new XMLHttpRequest();
	var url = energieip.weblink + 'status/group/' + grID.toString();
	Http.open("GET", url, true);
	Http.send();
	Http.onreadystatechange = function() {
		if (this.readyState === XMLHttpRequest.DONE){
			if (this.status === 200) {
				var obj = JSON.parse(Http.responseText);
				cbk(obj);
			}
		}
	}
}

energieip.UpdateGroupNameCfg = function (driver) {
	var url = energieip.weblink + 'config/group';
	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhr.onreadystatechange = function() {
		if (this.readyState === XMLHttpRequest.DONE){
			if (this.status === 200) {
				alert("Command successfull");
			} else{
				alert("Command Error");
			}
		}
	}
	var content = {
		"group": parseInt(driver.statusGroup),
		"friendlyName": driver.groupConfigName,
	};
	xhr.send(JSON.stringify(content));
}

energieip.UpdateGroupCfg = function (driver) {
	var url = energieip.weblink + 'config/group';
	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhr.onreadystatechange = function() {
		if (this.readyState === XMLHttpRequest.DONE){
			if (this.status === 200) {
				alert("Command successfull");
			} else{
				alert("Command Error");
			}
		}
	}
	var content = {
		"group": parseInt(driver.statusGroup),
		"friendlyName": driver.groupConfigName,
	};
	xhr.send(JSON.stringify(content));
}

energieip.SendGroupCmd = function (driver) {
	var url = energieip.weblink + 'command/group';
	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhr.onreadystatechange = function() {
		if (this.readyState === XMLHttpRequest.DONE){
			if (this.status === 200) {
				alert("Command successfull");
			} else{
				alert("Command Error");
			}
		}
	}
	var content = {
		"group": parseInt(driver.statusGroup),
		"auto": driver.groupControlAuto,
		"setpointLeds": parseInt(driver.groupControlLight),
	};
	xhr.send(JSON.stringify(content));
}

exports.address = address;
exports.weblink = weblink;
exports.driver = driver;
exports.ledDriver = ledDriver;
exports.sensorDriver = sensorDriver;

Object.defineProperty(exports, '__esModule', { value: true });

})));
