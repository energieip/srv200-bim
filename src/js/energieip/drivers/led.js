{
    energieip.ResetLedCfg = function (driver) {
        var url = energieip.weblink + 'config/led';
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

    energieip.Led = class led extends energieip.Driver {
        get type() {
            return "energieip.Led";
        }
 
        init(driverObj) {
            super.init(driverObj);
            this.default_color = "xeogl-annotation-pin-led";
            
            this.deviceType = energieip.ledDriver;
            this._typeElement.innerHTML = "Driver: " + this.deviceType;

            this._spot.className = this.default_color;

            this._setpointElement = document.createElement('div');
            this._setpointElement.className = "xeogl-annotation-group";

            this._label.appendChild(this._setpointElement);
            this._label.appendChild(this._groupElement);

            this.statusAuto = driverObj.driverProperties.status.auto;
            this.statusLight = driverObj.driverProperties.status.setpoint;
            
            this.statusDevicePower = driverObj.driverProperties.status.devicePower || 0;
            this.statusPMax = driverObj.driverProperties.status.pMax || 0;
            this.statusDaisyChained = driverObj.driverProperties.status.daisyChainEnabled || false;
            this.statusFirstDay = driverObj.driverProperties.status.firstDay || false;
            this.statusDaisyChainedPos = driverObj.driverProperties.status.daisyChainPos || 0;
            this.statusThresholdLow = driverObj.driverProperties.status.thresholdLow || 0;
            this.statusThresholdHigh = driverObj.driverProperties.status.thresholdHigh || 100;
            this.statusVoltageLed = driverObj.driverProperties.status.voltageLed || 0;
            this.statusEnergy = driverObj.driverProperties.status.energy || 0;
            this.statusDuration = driverObj.driverProperties.status.duration || 0;
            this.statusTimeToAuto = driverObj.driverProperties.status.timeToAuto || 0;
            this.statusLinePower = driverObj.driverProperties.status.linePower || 0;
            this.statusWatchdog = driverObj.driverProperties.status.watchdog || 0;

            this.configWatchdog = this.statusWatchdog.toString() || "0";
            this.configThresholdLow = this.statusThresholdLow;
            this.configThresholdHigh = this.statusThresholdHigh;

            this.controlBleMode = "remote";
            this.controlPtmMac = "";
            this.controlBleUUID = "";
            this.controlBleTxPower = "0";
            this.controlBleMajor = "0";
            this.controlBleMinor = "0";

            this.controlLight = 0;
            this.controlAuto = false;
            this.configFirstDay = false;

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

        set statusAuto(val) {
            if (this._status_auto === val) {
                return;
            }
            this._status_auto = val || false;
            this.fire("auto", this);
        }

        get statusAuto() {
            return this._status_auto;
        }

        set statusLight(val) {
            if (this._status_light === val) {
                return;
            }
            this._status_light = val || "0";
            this._setpointElement.innerHTML = "Light: " + this._status_light + " %";
            this.fire("setpoint", this);
        }

        get statusLight() {
            return this._status_light;
        }

        updateEvent(driverObj) {
            super.updateEvent(driverObj);
            this.statusAuto = driverObj.auto;
            this.statusLight = driverObj.setpoint;

            this.statusDevicePower = driverObj.devicePower || 0;
            this.statusPMax = driverObj.pMax || 0;
            this.statusDaisyChained = driverObj.daisyChainEnabled || false;
            this.statusFirstDay = driverObj.firstDay || false;
            this.statusDaisyChainedPos = driverObj.daisyChainPos || 0;
            this.statusThresholdHigh = driverObj.thresholdHigh || 100;
            this.statusThresholdLow = driverObj.thresholdLow || 0;
            this.statusVoltageLed = driverObj.voltageLed || 0;
            this.statusDuration = driverObj.duration || 0;
            this.statusTimeToAuto = driverObj.timeToAuto || 0;
            this.statusEnergy = driverObj.energy || 0;
            this.statusLinePower = driverObj.linePower || 0;
            this.statusWatchdog = driverObj.watchdog || 0;
        }

        removeEvent() {
            super.removeEvent();
            this.statusAuto = false;
            this.statusLight = 0;

            this.statusDevicePower = 0;
            this.statusPMax = 0;
            this.statusDaisyChained = false;
            this.statusFirstDay = false;
            this.statusDaisyChainedPos = 0;
            this.statusThresholdHigh = 100;
            this.statusThresholdLow = 0;
            this.statusVoltageLed = 0;
            this.statusDuration = 0;
            this.statusTimeToAuto = 0;
            this.statusEnergy = 0;
            this.statusLinePower = 0;
            this.statusWatchdog = 0;
        }

        statusElement(gui){
            var status = gui.addFolder("LED Status");
            status.add(this, "statusName").name("Name");
            status.add(this, "statusLight", 0, 100).name("Light (%)");
            status.add(this, "statusAuto").name("Auto");
            status.add(this, "statusGroup").name("Group");
            return status;
        }
    };

    energieip.LedSupervision = class ledSupervision extends energieip.Led {
        get type() {
            return "energieip.Led";
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
            var driver = this;
            var controlDr = gui.addFolder("LED Control");
            var url = energieip.weblink + 'command/led';
            var light = controlDr.add(this, "controlLight", 0, 100).name("Light (%)");
            light.onFinishChange(function (value) {
                var data = {
                    "mac": driver.statusMac,
                    "label": driver.label,
                    "setpoint": parseInt(value)
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
            var auto = controlDr.add(this, "controlAuto").name("Auto");
            auto.onFinishChange(function (value) {
                var data = {
                    "mac": driver.statusMac,
                    "label": driver.label,
                    "auto": value
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
            controlDr.open();
        }


        configElement(gui){
            if (gui != null){
                document.getElementById('dat-gui-container').removeChild(gui.domElement);
                gui.destroy();
                window.gui = null;
            }
        }
    };

    energieip.LedMaintenance = class ledMaintenance extends energieip.Led {
        get type() {
            return "energieip.Led";
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
            status.add(this, "statusFirstDay").name("First Day").listen();
            status.add(this, "statusBle").name("BLE").listen();
            status.add(this, "statusBleMode").name("BLE Mode").listen();
            status.add(this, "statusPtmMac").name("Switch Power Mac").listen();
            status.add(this, "statusIBeaconUUID").name("iBeacon UUID").listen();
            status.add(this, "statusIBeaconMajor").name("iBeacon Major").listen();
            status.add(this, "statusIBeaconMinor").name("iBeacon Minor").listen();
            status.add(this, "statusIBeaconTxPower").name("iBeacon Tx Power").listen();
            status.add(this, "statusIsConfigured").name("Ready").listen();
            status.add(this, "statusIp").name("IP").listen();
            status.add(this, "statusMac").name("Mac address").listen();
            status.add(this, "statusThresholdLow").name("Threshold Low (%)").listen();
            status.add(this, "statusThresholdHigh").name("Threshold High (%)").listen();
            status.add(this, "statusDaisyChained").name("Daisy Chained").listen();
            status.add(this, "statusDaisyChainedPos").name("Daisy Chain Position").listen();
            status.add(this, "statusDevicePower").name("Device Power (W)").listen();
            status.add(this, "statusVoltageLed").name("Voltage LED (V)").listen();
            status.add(this, "statusEnergy").name("Cumulative Energy (Wh)").listen();
            status.add(this, "statusLinePower").name("Line Power (W)").listen();
            status.add(this, "statusDuration").name("Light Duration (s)").listen();
            status.add(this, "statusPMax", 0, 100).name("PMax (W)").listen();
            status.add(this, "statusVoltageInput").name("Voltage Input (V)").listen();
            status.add(this, "statusSoftwareVersion").name("Software Version").listen();
            status.add(this, "statusHardwareVersion").name("Hardware Version").listen();
            status.add(this, "statusSwitchMac").name("Switch Mac address").listen();
            status.add(this, "statusDumpFrequency").name("Refresh Frequency (s)").listen();
            status.open();
        }

        ifcInfo(gui){
            var ifc = gui.addFolder("LED Information");
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
            var driver = this;
            var controlDr = gui.addFolder("LED Control");
            var url = energieip.weblink + 'command/led';
            var light = controlDr.add(this, "controlLight", 0, 100).name("Light (%)");
            light.onFinishChange(function (value) {
                var data = {
                    "mac": driver.statusMac,
                    "label": driver.label,
                    "setpoint": parseInt(value)
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
            var auto = controlDr.add(this, "controlAuto").name("Auto");
            auto.onFinishChange(function (value) {
                var data = {
                    "mac": driver.statusMac,
                    "label": driver.label,
                    "auto": value
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
            controlDr.add({"reset": function() {
                if (confirm("Do you want to reset the LED configuration ?")) {
                    energieip.ResetLedCfg(driver);
                }
            }}, "reset").name("Reset");
            controlDr.open();
        }

        configElement(gui){
            var driver = this;
            var url = energieip.weblink + 'config/led';
            var config = gui.addFolder("LED Configuration");
            var name = config.add(this, "configName").name("Name");
            name.onFinishChange(function (value) {
                var data = {
                    "mac": driver.statusMac,
                    "label": driver.label,
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

            var gr = config.add(this, "configGroup").name("Group");
            gr.onFinishChange(function (value) {
                var data = {
                    "mac": driver.statusMac,
                    "label": driver.label,
                    "group": parseInt(value)
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

            var firstDay = config.add(this, "configFirstDay").name("First Day");
            firstDay.onFinishChange(function (value) {
                var data = {
                    "mac": driver.statusMac,
                    "label": driver.label,
                    "firstDay": value
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

            var ble = config.add(this, "configBle").name("BLE");
            ble.onFinishChange(function (value) {
                var data = {
                    "mac": driver.statusMac,
                    "label": driver.label,
                    "isBleEnabled": value,
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
            
            var bleMode = config.add(this, "controlBleMode",  ['remote', 'ptm', 'iBeacon']).name("BLE Mode");
            bleMode.onFinishChange(function (value) {
                var data = {
                    "mac": driver.statusMac,
                    "label": driver.label,
                    "bleMode": value
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
            var ptmMac = config.add(this, "controlPtmMac").name("Switch Power Mac");
            ptmMac.onFinishChange(function (value) {
                var data = {
                    "mac": driver.statusMac,
                    "label": driver.label,
                    "ptmMac": value.toString()
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
            var bleUUID = config.add(this, "controlBleUUID").name("iBeacon UUID");
            bleUUID.onFinishChange(function (value) {
                var data = {
                    "mac": driver.statusMac,
                    "label": driver.label,
                    "iBeaconUUID": value.toString()
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
            var bleMajor = config.add(this, "controlBleMajor").name("iBeacon Major");
            bleMajor.onFinishChange(function (value) {
                var data = {
                    "mac": driver.statusMac,
                    "label": driver.label,
                    "iBeaconMajor": parseInt(value)
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
            var bleMinor = config.add(this, "controlBleMinor").name("iBeacon Minor");
            bleMinor.onFinishChange(function (value) {
                var data = {
                    "mac": driver.statusMac,
                    "label": driver.label,
                    "iBeaconMinor": parseInt(value)
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
            var bleTxPower = config.add(this, "controlBleTxPower").name("iBeacon Tx Power");
            bleTxPower.onFinishChange(function (value) {
                var data = {
                    "mac": driver.statusMac,
                    "label": driver.label,
                    "iBeaconTxPower": parseInt(value)
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

            var tlow = config.add(this, "configThresholdLow",  0, 100).name("Threshold Low (%)");
            tlow.onFinishChange(function (value) {
                var data = {
                    "mac": driver.statusMac,
                    "label": driver.label,
                    "thresoldLow": parseInt(value),
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
            var thigh = config.add(this, "configThresholdHigh",  0, 100).name("Threshold High (%)");
            thigh.onFinishChange(function (value) {
                var data = {
                    "mac": driver.statusMac,
                    "label": driver.label,
                    "thresoldHigh": parseInt(value),
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
            var watchdog = config.add(this, "configWatchdog").name("Watchdog");
            watchdog.onFinishChange(function (value) {
                var data = {
                    "mac": driver.statusMac,
                    "label": driver.label,
                    "watchdog": parseInt(value),
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