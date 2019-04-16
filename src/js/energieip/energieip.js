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

const address = window.location.hostname + ':8888/v1.0/';
const weblink = 'https://'+address;

const driver = "driver";
const ledDriver = "led";
const hvacDriver = "hvac";
const blindDriver = "blind";
const sensorDriver = "sensor";
const switchDevice = "switch";

energieip.Notifications = function (cbkOnMessage) {
	var ws = new WebSocket("wss://" + address + "events");
	console.log("Connect ws ", ws);

	ws.onmessage = function (evt) {
		var event = JSON.parse(evt.data);
		cbkOnMessage(event);
	};

	ws.onclose = function() {
		console.log("connection close; reconnect");
		energieip.Notifications(cbkOnMessage);
	};

	ws.onerror = function() {
		console.log("connection on erreur; reconnect");
		energieip.Notifications(cbkOnMessage);
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
		if (this.readyState === XMLHttpRequest.DONE) {
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
		if (this.readyState === XMLHttpRequest.DONE) {
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
		if (this.readyState === XMLHttpRequest.DONE) {
			switch (this.status) {
				case 200:
					alert("Success");
					break;
				case 500:
					var obj = JSON.parse(xhr.responseText);
					alert("Error: "+ obj.message);
					break;
				default:
					alert("Error");
					break;
			}
		}
	}
	var content = {
		"group": parseInt(driver.statusGroup),
		"friendlyName": driver.groupConfigName,
	};
	xhr.send(JSON.stringify(content));
}

energieip.CreateGroup = function (group) {
	var url = energieip.weblink + 'setup/group';
	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhr.onreadystatechange = function() {
		if (this.readyState === XMLHttpRequest.DONE) {
			switch (this.status) {
				case 200:
					alert("Success");
					break;
				case 500:
					var obj = JSON.parse(xhr.responseText);
					alert("Error: "+ obj.message);
					break;
				default:
					alert("Error");
					break;
			}
		}
	}
	var content = {
		"group": parseInt(group.group),
		"leds": group.leds,
		"sensors": group.sensors,
		"hvacs": group.hvacs,
		"friendlyName": group.name,
		"slopeStartManual": parseInt(group.slopeStartManual) * 1000,
		"slopeStopManual": parseInt(group.slopeStopManual) * 1000,
		"slopeStartAuto": parseInt(group.slopeStartAuto) * 1000,
		"slopeStopAuto": parseInt(group.slopeStopAuto) * 1000,
		"correctionInterval": parseInt(group.correctionInterval),
		"sensorRule": group.sensorRule,
		"ruleBrightness": parseInt(group.ruleBrightness),
		"rulePresence": parseInt(group.rulePresence),
		"watchdog": parseInt(group.watchdog),
	};
	xhr.send(JSON.stringify(content));
}

energieip.UpdateGroupCfg = function (driver) {
	var url = energieip.weblink + 'config/group';
	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhr.onreadystatechange = function() {
		if (this.readyState === XMLHttpRequest.DONE) {
			switch (this.status) {
				case 200:
					alert("Success");
					break;
				case 500:
					var obj = JSON.parse(xhr.responseText);
					alert("Error: "+ obj.message);
					break;
				default:
					alert("Error");
					break;
			}
		}
	}
	var content = {
		"group": parseInt(driver.statusGroup),
		"friendlyName": driver.groupConfigName,
		"slopeStartManual": parseInt(driver.groupConfigSlopeStartManual) * 1000,
		"slopeStopManual": parseInt(driver.groupConfigSlopeStopManual) * 1000,
		"slopeStartAuto": parseInt(driver.groupConfigSlopeStartAuto) * 1000,
		"slopeStopAuto": parseInt(driver.groupConfigSlopeStopAuto) * 1000,
		"correctionInterval": parseInt(driver.groupConfigCorrectionInterval),
		"sensorRule": driver.groupConfigSensorRule,
		"ruleBrightness": parseInt(driver.groupConfigRuleBrightness),
		"rulePresence": parseInt(driver.groupConfigRulePresence),
		"firstDayOffset": parseInt(driver.groupConfigFirstDayOffset),
		"watchdog": parseInt(driver.groupConfigWatchdog)
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
			switch (this.status) {
				case 200:
					alert("Success");
					break;
				case 500:
					var obj = JSON.parse(xhr.responseText);
					alert("Error: "+ obj.message);
					break;
				default:
					alert("Error");
					break;
			}
		}
	}
	var content = {
		"group": parseInt(driver.statusGroup),
		"auto": driver.groupControlAuto,
		"setpointLeds": parseInt(driver.groupControlLight),
		"setpointBlinds": parseInt(driver.groupControlBlinds),
		"setpointSlats": parseInt(driver.groupControlBlindsSlats)
	};
	xhr.send(JSON.stringify(content));
}

energieip.ConsumptionsEvent = function (cbkOnMessage) {
	var ws = new WebSocket("wss://" + address + "events/consumption");

	ws.onmessage = function (evt) {
		var event = JSON.parse(evt.data);
		cbkOnMessage(event);
	};

	ws.onclose = function() {
		console.log("connection close; reconnect");
		energieip.ConsumptionsEvent(cbkOnMessage);
	};

	ws.onerror = function() {
		console.log("connection on erreur ");
	};

}

exports.address = address;
exports.weblink = weblink;
exports.driver = driver;
exports.ledDriver = ledDriver;
exports.hvacDriver = hvacDriver;
exports.blindDriver = blindDriver;
exports.sensorDriver = sensorDriver;
exports.switchDevice = switchDevice;

Object.defineProperty(exports, '__esModule', { value: true });

})));
