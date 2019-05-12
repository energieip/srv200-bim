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
const accessToken = "EiPAccessToken";
const loginPage = "login.html";

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

energieip.SendRequest = function (type, url, data, cbk, err){
	$.ajax({
		type: type,
		url: url,
		dataType: 'json',
		cache: false,
		credentials: 'include',
		data: JSON.stringify(data),
		crossDomain: true,
		xhrFields: {
			withCredentials: true
		},
		statusCode: {
			200: function (response) {
				cbk(response);
			},
			401: function (response) {
				window.location.href = energieip.loginPage;
			},
			500: function (response) {
				err(response);
			}
		}
	});
};

energieip.GetIfcDump = function (labels, cbk) {
	var url = energieip.weblink + 'dump'
	if (labels!= ""){ 
		url += '?labels=' + labels;
	}
	energieip.SendRequest(
		"GET", url, {}, function(response){
			var drivers = {};
			var groups = {};
			for (var i  in response) {
				if (i === "groups"){
					continue
				}
				for (var elt  in response[i]){
					var driver = response[i][elt];
					if (driver["ifc"] == null){
						continue
					}
					var label = driver["ifc"].label;
					drivers[label] = driver;
				}
			}
			for (var elt in response["groups"]){
				var grID = response["groups"][elt]["config"].group;
				groups[grID] = response["groups"][elt];
			}
			cbk(drivers, groups);
		},
		function(response){}
	);
}

energieip.UpdateGroupNameCfg = function (driver) {
	var url = energieip.weblink + 'config/group';
	var data = {
		"group": parseInt(driver.statusGroup),
		"friendlyName": driver.groupConfigName,
	};
	energieip.SendRequest(
		"POST", url, data, function(response){
			alert("success");
		},
		function(response){
            alert("Error" + response["message"]);
		}
	);
}

energieip.CreateGroup = function (group) {
	var url = energieip.weblink + 'setup/group';
	var data = {
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
	energieip.SendRequest(
		"POST", url, data, function(response){
			alert("success");
		},
		function(response){
            alert("Error" + response["message"]);
		}
	);
}

energieip.UpdateGroupCfg = function (driver) {
	var url = energieip.weblink + 'config/group';
	var data = {
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

	energieip.SendRequest(
		"POST", url, data, function(response){
			alert("success");
		},
		function(response){
            alert("Error" + response["message"]);
		}
	);
}

energieip.SendGroupCmd = function (driver) {
	var url = energieip.weblink + 'command/group';
	var data = {
		"group": parseInt(driver.statusGroup),
		"auto": driver.groupControlAuto,
		"setpointLeds": parseInt(driver.groupControlLight),
		"setpointBlinds": parseInt(driver.groupControlBlinds),
		"setpointSlats": parseInt(driver.groupControlBlindsSlats)
	};

	energieip.SendRequest(
		"POST", url, data, function(response){
			alert("success");
		},
		function(response){
            alert("Error" + response["message"]);
		}
	);
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
exports.accessToken = accessToken;
exports.loginPage = loginPage;

Object.defineProperty(exports, '__esModule', { value: true });

})));
