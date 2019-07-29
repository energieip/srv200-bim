{
    energieip.ResetHvacCfg = function (driver) {
        var url = energieip.weblink + 'config/hvac';
        var data = {
            "mac": driver.statusMac,
            "isConfigured": false,
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

    energieip.Hvac = class hvac extends energieip.Driver {
        get type() {
            return "energieip.Hvac";
        }
 
        init(driverObj) {
            super.init(driverObj);
            this.default_color = "xeogl-annotation-pin-hvac";
            
            this.deviceType = energieip.hvacDriver;
            this._typeElement.innerHTML = "Driver: " + this.deviceType;

            this._spot.className = this.default_color;

            this._setpointElement = document.createElement('div');
            this._setpointElement.className = "xeogl-annotation-group";
            this.controlTemp = 0;

            this.statusLinePower = driverObj.driverProperties.status.linePower || 0;
            this.statusCoolOutput = driverObj.driverProperties.status.coolOutput1 || 0;
            this.statusEffectiveSetpoint = driverObj.driverProperties.status.effectSetPoint1 / 10.0 || 0;
            this.statusHeatCool = driverObj.driverProperties.status.heatCool1 || 0;
            this.statusHeatOutput = driverObj.driverProperties.status.heatOutput1 || 0;
            this.statusHoldOff = driverObj.driverProperties.status.holdOff1 || 0;
            this.statusOccManCmd = driverObj.driverProperties.status.occManCmd1 || 0;
            this.statusSetpointOccCool = driverObj.driverProperties.status.setpointOccupiedCool1 / 10.0 || 0;
            this.statusSetpointOccHeat = driverObj.driverProperties.status.setpointOccupiedHeat1 / 10.0 || 0;
            this.statusSetpointStdbyCool = driverObj.driverProperties.status.setpointStandbyCool1 / 10.0 || 0;
            this.statusSetpointStdbyHeat = driverObj.driverProperties.status.setpointStandbyHeat1 / 10.0 || 0;
            this.statusSetpointUnoccCool = driverObj.driverProperties.status.setpointUnoccupiedCool1 / 10.0 || 0;
            this.statusSetpointUnoccHeat = driverObj.driverProperties.status.setpointUnoccupiedHeat1 / 10.0 || 0;
            this.statusSpaceCO2 = driverObj.driverProperties.status.spaceCO2 / 10.0 || 0;
            this.statusSpaceCOV = driverObj.driverProperties.status.spaceCOV / 10.0 || 0;
            this.statusSpaceTemp = driverObj.driverProperties.status.spaceTemp1 / 10.0 || 0;
            this.statusTemperatureSelect = driverObj.driverProperties.status.temperatureSelect / 10.0 || 0;
            this.statusOADamper = driverObj.driverProperties.status.oaDamper || 0;

            this._label.appendChild(this._groupElement);
            
            if (this.statusIp === "") {
                this._spot.className = this.not_available_color;
            } else {
                if (this.statusError != 0) {
                    this._spot.className = this.error_color;
                }
            }

            var update = function () {
                requestAnimationFrame(update);
            };
            update();
        }

        removeEvent() {
            super.removeEvent();
            this.statusLinePower = 0;
            this.statusCoolOutput = 0;
            this.statusEffectiveSetpoint = 0;
            this.statusHeatCool = 0;
            this.statusHeatOutput = 0;
            this.statusHoldOff = 0;
            this.statusOccManCmd = 0;
            this.statusSetpointOccCool = 0;
            this.statusSetpointOccHeat = 0;
            this.statusSetpointStdbyCool = 0;
            this.statusSetpointStdbyHeat = 0;
            this.statusSetpointUnoccCool = 0;
            this.statusSetpointUnoccHeat = 0;
            this.statusSpaceCO2 = 0;
            this.statusSpaceCOV = 0;
            this.statusSpaceTemp = 0;
            this.statusTemperatureSelect = 0;
            this.statusOADamper = 0;
        }

        updateEvent(driverObj) {
            super.updateEvent(driverObj);
            this.statusLinePower = driverObj.linePower;
            this.statusCoolOutput = driverObj.coolOutput1;
            this.statusEffectiveSetpoint = driverObj.effectSetPoint1 / 10.0;
            this.statusHeatCool = driverObj.heatCool1;
            this.statusHeatOutput = driverObj.heatOutput1;
            this.statusHoldOff = driverObj.holdOff1;
            this.statusOccManCmd = driverObj.occManCmd1;
            this.statusSetpointOccCool = driverObj.setpointOccupiedCool1 / 10.0;
            this.statusSetpointOccHeat = driverObj.setpointOccupiedHeat1 / 10.0;
            this.statusSetpointStdbyCool = driverObj.setpointStandbyCool1 / 10.0;
            this.statusSetpointStdbyHeat = driverObj.setpointStandbyHeat1 / 10.0;
            this.statusSetpointUnoccCool = driverObj.setpointUnoccupiedCool1 / 10.0;
            this.statusSetpointUnoccHeat = driverObj.setpointUnoccupiedHeat1 / 10.0;
            this.statusSpaceCO2 = driverObj.spaceCO2 / 10.0;
            this.statusSpaceCOV = driverObj.spaceCOV / 10.0;
            this.statusSpaceTemp = driverObj.spaceTemp1 / 10.0;
            this.statusTemperatureSelect = driverObj.temperatureSelect / 10.0;
            this.statusOADamper = driverObj.oaDamper;
        }

        statusElement(gui){
            var status = gui.addFolder("HVAC Status");
            status.add(this, "statusName").name("Name").listen();
            status.add(this, "statusGroup").name("Group").listen();
            status.add(this, "statusEffectiveSetpoint").name("Effective Setpoint (°C)").listen();
            status.add(this, "statusHeatCool").name("Regulation Mode").listen();
            status.add(this, "statusHoldOff").name("Open Window").listen();
            status.add(this, "statusTemperatureSelect").name("Selected Temperature (in °C)").listen();
            return status;
        }
    };

    energieip.HvacSupervision = class hvacSupervision extends energieip.Hvac {
        get type() {
            return "energieip.Hvac";
        }

        init(driverObj) {
            super.init(driverObj);
        }

        updateEvent(driverObj) {
            super.updateEvent(driverObj);
        }

        statusElement(gui){
            var status = super.statusElement(gui);
            status.open();
        }
        ifcInfo(gui){}

        statusGroupInfo(gui){
            var status = super.statusGroupInfo(gui);
            status.open();
        }

        controlElement(gui){
            if (gui != null){
                document.getElementById('dat-gui-container').removeChild(gui.domElement);
                gui.destroy();
                window.gui = null;
            }
        }

        configElement(gui){
            if (gui != null){
                document.getElementById('dat-gui-container').removeChild(gui.domElement);
                gui.destroy();
                window.gui = null;
            }
        }
    };

    energieip.HvacMaintenance = class hvacMaintenance extends energieip.Hvac {
        get type() {
            return "energieip.Hvac";
        }

        init(driverObj) {
            super.init(driverObj);
            this._label.appendChild(this._macElement);
            this._label.appendChild(this._ipElement);
            this._label.appendChild(this._labelElement);

            this.ifcModelName = driverObj.driverProperties.ifc.modelName;
            this.ifcUrl = driverObj.driverProperties.ifc.url;
            this.ifcVendor = driverObj.driverProperties.ifc.vendor;
            this.ifcProductionYear = driverObj.driverProperties.ifc.productionYear;
        }

        updateEvent(driverObj) {
            super.updateEvent(driverObj);
        }

        statusElement(gui){
            var status = super.statusElement(gui);
            status.add(this, "statusError").name("Error Status").listen();
            status.add(this, "label").name("Cable").listen();
            status.add(this, "statusIp").name("IP").listen();
            status.add(this, "statusMac").name("Mac address").listen();
            status.add(this, "statusCoolOutput").name("Cool valve opening (%)").listen();
            status.add(this, "statusHeatOutput").name("Heat valve opening (%)").listen();
            status.add(this, "statusHeatOutput").name("Valve opening (%)").listen();
            status.add(this, "statusOccManCmd").name("Presence").listen();
            status.add(this, "statusSetpointOccCool").name("Setpoint Occ. Cool").listen();
            status.add(this, "statusSetpointOccHeat").name("Setpoint Occ. Heat").listen();
            status.add(this, "statusSetpointUnoccCool").name("Setpoint Unocc. Cool").listen();
            status.add(this, "statusSetpointUnoccHeat").name("Setpoint Unocc. Heat").listen();
            status.add(this, "statusSetpointStdbyHeat").name("Setpoint Standby Heat").listen();
            status.add(this, "statusSetpointStdbyCool").name("Setpoint Standby Cool").listen();
            status.add(this, "statusSpaceCO2").name("Space CO2 (in ppm)").listen();
            status.add(this, "statusSpaceCOV").name("Space COV (in ppm)").listen();
            status.add(this, "statusSpaceTemp").name("Space Temperature (in °C)").listen();
            status.add(this, "statusLinePower").name("Line Power (w)").listen();
            status.add(this, "statusSoftwareVersion").name("Software Version").listen();
            status.add(this, "statusSwitchMac").name("Switch Mac address").listen();
            status.add(this, "statusDumpFrequency").name("Refresh Frequency (s)").listen();
            status.open();
        }

        ifcInfo(gui){
            var ifc = gui.addFolder("HVAC Information");
            ifc.add(this, "ifcModelName").name("Model Name");
            ifc.add(this, "ifcUrl").name("URL");
            ifc.add(this, "ifcVendor").name("Vendor Name");
            ifc.add(this, "ifcProductionYear").name("Production Year");
            ifc.open();
        }

        statusGroupInfo(gui){
            var status = super.statusGroupInfo(gui);
            status.add(this, "groupStatusCeilingTemperature").name("Ceiling Temperature (°C)").listen();
            status.add(this, "groupStatusCeilingHumidity").name("Ceiling Hygrometry (%)").listen();
            status.add(this, "groupStatusError").name("Error Status").listen();
            status.add(this, "groupStatusCorrectionInterval").name("Correction Interval (s)").listen();
            status.add(this, "groupStatusSensorRule").name("Sensor Rule").listen();
            status.add(this, "groupStatusSlopeStartManual").name("Slope Start Manual (s)").listen();
            status.add(this, "groupStatusSlopeStopManual").name("Slope Stop Manual (s)").listen();
            status.add(this, "groupStatusSlopeStartAuto").name("Slope Start Auto (s)").listen();
            status.add(this, "groupStatusSlopeStopAuto").name("Slope Stop Auto (s)").listen();
            status.add(this, "groupStatusTimeToAuto").name("Time to Auto (s)").listen();
            status.add(this, "groupStatusTimeToLeave").name("Time to Leave (s)").listen();
            status.add(this, "groupStatusRulePresence").name("Rule Presence (s)").listen();
            status.add(this, "groupStatusRuleBrightness").name("Rule Brightness (Lux)").listen();
            status.add(this, "groupStatusFirstDayOffset").name("1st Day Offset (%)").listen();
            status.add(this, "groupStatusWatchdog").name("Watchdog (s)").listen();
            status.open();
        };

        controlElement(gui){
            var url = energieip.weblink + 'command/hvac';
            var driver = this;
            var controlDr = gui.addFolder("HVAC Control");
            var temp = controlDr.add(this, "controlTemp", -1.5,  1.5).step(0.5).name("Temperature Shift (°C)");
            temp.onFinishChange(function (value) {
                var data = {
                    "mac": driver.statusMac,
                    "label": driver.label,
                    "shiftTemp": parseFloat(value) *10
                };

                energieip.SendRequest(
                    "POST", url, data, function(response){
                        alert("success");
                    },
                    function(response){
                        alert("Error" + response["message"]);
                    }
                );
            });
            controlDr.add({"reset": function(){
                if (confirm("Do you want to reset the HVAC configuration ?")) {
                    energieip.ResetHvacCfg(driver);
                }
            }}, "reset").name("Reset");
            controlDr.open();
        }

        configElement(gui){
            var url = energieip.weblink + 'config/hvac';
            var driver = this;
            var config = gui.addFolder("HVAC Configuration");
            var name = config.add(this, "configName").name("Name");
            name.onFinishChange(function (value) {
                var data = {
                    "mac": driver.statusMac,
                    "label": driver.label,
                    "friendlyName": value,
                };

                energieip.SendRequest(
                    "POST", url, data, function(response){
                        alert("success");
                    },
                    function(response){
                        alert("Error" + response["message"]);
                    }
                );
            });

            var gr = config.add(this, "configGroup").name("Group");
            gr.onFinishChange(function (value) {
                var data = {
                    "mac": driver.statusMac,
                    "label": driver.label,
                    "group": parseInt(value),
                };

                energieip.SendRequest(
                    "POST", url, data, function(response){
                        alert("success");
                    },
                    function(response){
                        alert("Error" + response["message"]);
                    }
                );
            });

            var ref = config.add(this, "configDumpFrequency", 1).name("Refresh Frequency (s)");
            ref.onFinishChange(function (value) {
                var data = {
                    "mac": driver.statusMac,
                    "label": driver.label,
                    "dumpFrequency": parseInt(value) * 1000,
                };

                energieip.SendRequest(
                    "POST", url, data, function(response){
                        alert("success");
                    },
                    function(response){
                        alert("Error" + response["message"]);
                    }
                );
            });
            config.open();
        }

        groupConfigParam(gui){
            var driver = this;
            var url = energieip.weblink + 'config/group';
            var controlGr = gui.addFolder("Group Configuration");
            var name = controlGr.add(this, "groupConfigName").name("Name");
            name.onFinishChange(function (value) {
                var data = {
                    "group": parseInt(driver.statusGroup),
                    "friendlyName": value
                };

                energieip.SendRequest(
                    "POST", url, data, function(response){
                        alert("success");
                    },
                    function(response){
                        alert("Error" + response["message"]);
                    }
                );
            });
            var startManual = controlGr.add(this, "groupConfigSlopeStartManual").name("Slope Start Manual (s)");
            startManual.onFinishChange(function (value) {
                var data = {
                    "group": parseInt(driver.statusGroup),
                    "slopeStartManual": parseInt(value) * 1000
                };

                energieip.SendRequest(
                    "POST", url, data, function(response){
                        alert("success");
                    },
                    function(response){
                        alert("Error" + response["message"]);
                    }
                );
            });

            var stopManual = controlGr.add(this, "groupConfigSlopeStopManual").name("Slope Stop Manual (s)");
            stopManual.onFinishChange(function (value) {
                var data = {
                    "group": parseInt(driver.statusGroup),
                    "slopeStopManual": parseInt(value) * 1000
                };

                energieip.SendRequest(
                    "POST", url, data, function(response){
                        alert("success");
                    },
                    function(response){
                        alert("Error" + response["message"]);
                    }
                );
            });

            var startAuto = controlGr.add(this, "groupConfigSlopeStartAuto").name("Slope Start Auto (s)");
            startAuto.onFinishChange(function (value) {
                var data = {
                    "group": parseInt(driver.statusGroup),
                    "slopeStartAuto": parseInt(value) * 1000
                };

                energieip.SendRequest(
                    "POST", url, data, function(response){
                        alert("success");
                    },
                    function(response){
                        alert("Error" + response["message"]);
                    }
                );
            });

            var stopAuto = controlGr.add(this, "groupConfigSlopeStopAuto").name("Slope Stop Auto (s)");
            stopAuto.onFinishChange(function (value) {
                var data = {
                    "group": parseInt(driver.statusGroup),
                    "slopeStopAuto": parseInt(value) * 1000
                };

                energieip.SendRequest(
                    "POST", url, data, function(response){
                        alert("success");
                    },
                    function(response){
                        alert("Error" + response["message"]);
                    }
                );
            });
            
            var interval = controlGr.add(this, "groupConfigCorrectionInterval").name("Correction Interval (s)");
            interval.onFinishChange(function (value) {
                var data = {
                    "group": parseInt(driver.statusGroup),
                    "correctionInterval": parseInt(value)
                };

                energieip.SendRequest(
                    "POST", url, data, function(response){
                        alert("success");
                    },
                    function(response){
                        alert("Error" + response["message"]);
                    }
                );
            });
            var rule = controlGr.add(this, "groupConfigSensorRule", ["average", "min", "max"]).name("Sensor Rule");
            rule.onFinishChange(function (value) {
                var data = {
                    "group": parseInt(driver.statusGroup),
                    "sensorRule": value.toString()
                };

                energieip.SendRequest(
                    "POST", url, data, function(response){
                        alert("success");
                    },
                    function(response){
                        alert("Error" + response["message"]);
                    }
                );
            });

            var pres = controlGr.add(this, "groupConfigRulePresence").name("Rule Presence (s)");
            pres.onFinishChange(function (value) {
                var data = {
                    "group": parseInt(driver.statusGroup),
                    "rulePresence": parseInt(value)
                };

                energieip.SendRequest(
                    "POST", url, data, function(response){
                        alert("success");
                    },
                    function(response){
                        alert("Error" + response["message"]);
                    }
                );
            });
            
            var bright = controlGr.add(this, "groupConfigRuleBrightness").name("Rule Brightness (Lux)");
            bright.onFinishChange(function (value) {
                var data = {
                    "group": parseInt(driver.statusGroup),
                    "ruleBrightness": parseInt(value)
                };

                energieip.SendRequest(
                    "POST", url, data, function(response){
                        alert("success");
                    },
                    function(response){
                        alert("Error" + response["message"]);
                    }
                );
            });

            var offset = controlGr.add(this, "groupConfigFirstDayOffset").name("1st Day Offset (%)");
            offset.onFinishChange(function (value) {
                var data = {
                    "group": parseInt(driver.statusGroup),
                    "firstDayOffset": parseInt(value)
                };

                energieip.SendRequest(
                    "POST", url, data, function(response){
                        alert("success");
                    },
                    function(response){
                        alert("Error" + response["message"]);
                    }
                );
            });

            var watchdog = controlGr.add(this, "groupConfigWatchdog").name("Watchdog (s)");
            watchdog.onFinishChange(function (value) {
                var data = {
                    "group": parseInt(driver.statusGroup),
                    "watchdog": parseInt(value)
                };

                energieip.SendRequest(
                    "POST", url, data, function(response){
                        alert("success");
                    },
                    function(response){
                        alert("Error" + response["message"]);
                    }
                );
            });
            controlGr.open();
        }
    };
}