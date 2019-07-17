{
    energieip.ResetBlindCfg = function (driver) {
        var url = energieip.weblink + 'config/blind';
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

    energieip.Blind = class blind extends energieip.Driver {
        get type() {
            return "energieip.Blind";
        }
 
        init(driverObj) {
            super.init(driverObj);
            this.default_color = "xeogl-annotation-pin-blind";
            
            this.deviceType = energieip.blindDriver;
            this._typeElement.innerHTML = "Driver: " + this.deviceType;

            this._spot.className = this.default_color;

            this._setpointElement = document.createElement('div');
            this._setpointElement.className = "xeogl-annotation-group";

            this._label.appendChild(this._setpointElement);
            this._label.appendChild(this._groupElement);
            
            this.statusDaisyChained = driverObj.driverProperties.status.daisyChainEnabled;
            this.statusDaisyChainedPos = driverObj.driverProperties.status.daisyChainPos;
            this.statusWindowStatus1 = driverObj.driverProperties.status.windowStatus1;
            this.statusWindowStatus2 = driverObj.driverProperties.status.windowStatus2;
            this.statusBlind1 = driverObj.driverProperties.status.blind1 || 0;
            this.statusBlind2 = driverObj.driverProperties.status.blind2 ||0;
            this.statusSlat1 = driverObj.driverProperties.status.slat1 || 0;
            this.statusSlat2 = driverObj.driverProperties.status.slat2 ||0;

            this.controlBlind1 = 0;
            this.controlBlind2 = 0;
            this.controlSlat1 = 0;
            this.controlSlat2 = 0;
            this.controlBleMode = "remote";
            this.controlBleUUID = "";
            this.controlBleTxPower = "0";
            this.controlBleMajor = "0";
            this.controlBleMinor = "0";

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

            this.statusDaisyChained = false;
            this.statusDaisyChainedPos = 0;
            this.statusWindowStatus1 = false;
            this.statusWindowStatus2 = false;
            this.statusBlind1 = 0;
            this.statusBlind2 = 0;
            this.statusSlat1 = 0;
            this.statusSlat2 = 0;
        }

        updateEvent(driverObj) {
            super.updateEvent(driverObj);

            this.statusDaisyChained = driverObj.daisyChainEnabled;
            this.statusDaisyChainedPos = driverObj.daisyChainPos;
            this.statusWindowStatus1 = driverObj.windowStatus1;
            this.statusWindowStatus2 = driverObj.windowStatus2;
            this.statusBlind1 = driverObj.blind1||0;
            this.statusBlind2 = driverObj.blind2||0;
            this.statusSlat1 = driverObj.slat1||0;
            this.statusSlat2 = driverObj.slat2||0;
        }

        statusElement(gui){
            var status = gui.addFolder("Blind Status");
            status.add(this, "statusName").name("Name").listen();
            status.add(this, "statusWindowStatus1").name("Window 1 Open").listen();
            status.add(this, "statusWindowStatus2").name("Window 2 Open").listen();
            status.add(this, "statusBlind1",{ Stop: 0, Up: 1, Down: 2 }).name("Last Order on Blind 1").listen();
            status.add(this, "statusBlind2", { Stop: 0, Up: 1, Down: 2 }).name("Last Order on Blind 2").listen();
            status.add(this, "statusSlat1").name("Last Order for Slat 1").listen();
            status.add(this, "statusSlat2").name("Last Order for Slat 2").listen();
            status.add(this, "statusGroup").name("Group").listen();
            return status;
        }
    };

    energieip.BlindSupervision = class blindSupervision extends energieip.Blind {
        get type() {
            return "energieip.Blind";
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
            var controlDr = gui.addFolder("Driver Control");
            var bld1 = controlDr.add(this, "controlBlind1", { Stop: 0, Up: 1, Down: 2 } ).name("Action Blind 1");
            bld1.onFinishChange(function (value) {
                var url = energieip.weblink + 'config/blind';
                var data = {
                    "mac": driver.statusMac,
                    "label": driver.label,
                    "blind1": parseInt(value)
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
            var bld2 = controlDr.add(this, "controlBlind2", { Stop: 0, Up: 1, Down: 2 } ).name("Action Blind 2");
            bld2.onFinishChange(function (value) {
                var url = energieip.weblink + 'config/blind';
                var data = {
                    "mac": driver.statusMac,
                    "label": driver.label,
                    "blind2": parseInt(value)
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
            var slat1 = controlDr.add(this, "controlSlat1", 0,  180 ).step(30).name("Action Slat 1");
            slat1.onFinishChange(function (value) {
                var url = energieip.weblink + 'config/blind';
                var data = {
                    "mac": driver.statusMac,
                    "label": driver.label,
                    "slat1": parseInt(value)
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
            var slat2 = controlDr.add(this, "controlSlat2", 0,  180 ).step(30).name("Action Slat 2");
            slat2.onFinishChange(function (value) {
                var url = energieip.weblink + 'config/blind';
                var data = {
                    "mac": driver.statusMac,
                    "label": driver.label,
                    "slat2": parseInt(value)
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
    };

    energieip.BlindMaintenance = class blindMaintenance extends energieip.Blind {
        get type() {
            return "energieip.Blind";
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
            status.add(this, "statusBle").name("BLE").listen();
            status.add(this, "statusBleMode").name("BLE Mode").listen();
            status.add(this, "statusIBeaconUUID").name("iBeacon UUID").listen();
            status.add(this, "statusIBeaconMajor").name("iBeacon Major").listen();
            status.add(this, "statusIBeaconMinor").name("iBeacon Minor").listen();
            status.add(this, "statusIBeaconTxPower").name("iBeacon Tx Power").listen();
            status.add(this, "statusIsConfigured").name("Ready").listen();
            status.add(this, "statusIp").name("IP").listen();
            status.add(this, "statusMac").name("Mac address").listen();
            status.add(this, "statusVoltageInput").name("Voltage Input (V)").listen();
            status.add(this, "statusSoftwareVersion").name("Software Version").listen();
            status.add(this, "statusHardwareVersion").name("Hardware Version").listen();
            status.add(this, "statusSwitchMac").name("Switch Mac address").listen();
            status.add(this, "statusDumpFrequency").name("Refresh Frequency (s)").listen();
            status.open();
        }

        ifcInfo(gui){
            var ifc = gui.addFolder("Blind Information");
            ifc.add(this, "ifcModelName").name("Model Name");
            ifc.add(this, "ifcUrl").name("URL");
            ifc.add(this, "ifcVendor").name("Vendor Name");
            ifc.add(this, "ifcProductionYear").name("Production Year");
            ifc.open();
        }

        statusGroupInfo(gui){
            var status = super.statusGroupInfo(gui);
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
            var controlDr = gui.addFolder("Blind Control");
            var bld1 = controlDr.add(this, "controlBlind1", { Stop: 0, Up: 1, Down: 2 } ).name("Action Blind 1");
            bld1.onFinishChange(function (value) {
                var url = energieip.weblink + 'config/blind';
                var data = {
                    "mac": driver.statusMac,
                    "label": driver.label,
                    "blind1": parseInt(value)
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
            var bld2 = controlDr.add(this, "controlBlind2", { Stop: 0, Up: 1, Down: 2 } ).name("Action Blind 2");
            bld2.onFinishChange(function (value) {
                var url = energieip.weblink + 'config/blind';
                var data = {
                    "mac": driver.statusMac,
                    "label": driver.label,
                    "blind2": parseInt(value)
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
            var slat1 = controlDr.add(this, "controlSlat1", 0,  180 ).step(30).name("Action Slat 1");
            slat1.onFinishChange(function (value) {
                var url = energieip.weblink + 'config/blind';
                var data = {
                    "mac": driver.statusMac,
                    "label": driver.label,
                    "slat1": parseInt(value)
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
            var slat2 = controlDr.add(this, "controlSlat2", 0,  180 ).step(30).name("Action Slat 2");
            slat2.onFinishChange(function (value) {
                var url = energieip.weblink + 'config/blind';
                var data = {
                    "mac": driver.statusMac,
                    "label": driver.label,
                    "slat2": parseInt(value)
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
                if (confirm("Do you want to reset the driver configuration ?")) {
                    energieip.ResetBlindCfg(driver);
                }
            }}, "reset").name("Reset");
            controlDr.open();
        }

        configElement(gui){
            var url = energieip.weblink + 'config/blind';
            var driver = this;
            var config = gui.addFolder("Blind Configuration");
            var name = config.add(this, "configName").name("Name");
            name.onFinishChange(function (value) {
                if (value.toString() != driver.statusName.toString()){
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
                }
            });
            var gr = config.add(this, "configGroup").name("Group");
            gr.onFinishChange(function (value) {
                if (driver.statusGroup.toString() !== value.toString()){
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
                }
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
                if (driver.statusDumpFrequency.toString() !== (parseInt(value) * 1000).toString()){
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
                }
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