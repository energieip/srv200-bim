{
    energieip.ResetSwitchCfg = function (driver) {
        var url = energieip.weblink + 'config/switch';
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

    energieip.Switch = class dswitch extends xeogl.Annotation {
        get type() {
            return "energieip.Switch";
        }
 
        init(driverObj) {
            super.init(driverObj);
            this.error_color = "xeogl-annotation-pin-error";
            this.not_available_color = "xeogl-annotation-pin-not-present";
            this.default_color = "xeogl-annotation-pin-switch";

            this._spot.className = this.default_color;

            this.deviceType = energieip.switchDevice;
            this._typeElement = document.createElement('div');
            this._typeElement.innerHTML = "Switch: " + this.deviceType;
            this._typeElement.className = "xeogl-annotation-group";
            this._label.appendChild(this._typeElement);

            this._friendlyNameElement = document.createElement('div');
            this._friendlyNameElement.className = "xeogl-annotation-alias";
            this._label.appendChild(this._friendlyNameElement);

            this._ipElement = document.createElement('div');
            this._ipElement.className = "xeogl-annotation-group";

            this._macElement = document.createElement('div');
            this._macElement.className = "xeogl-annotation-mac";

            this._clusterElement = document.createElement('div');
            this._clusterElement.className = "xeogl-annotation-group";
            this._label.appendChild(this._clusterElement);
            this._labelElement = document.createElement('div');
            this._labelElement.className = "xeogl-annotation-mac";

            this.statusMac = driverObj.driverProperties.status.mac;
            this.statusName = driverObj.driverProperties.status.friendlyName;
            this.statusError = driverObj.driverProperties.status.error||0;
            this.statusCluster = driverObj.driverProperties.status.cluster||0;
            this.label = driverObj.driverProperties.ifc.label;
            this._labelElement.innerHTML = "Cable: " + this.label;
            this.statusIp = driverObj.driverProperties.status.ip;
            this.statusProfil = driverObj.driverProperties.status.profil || "none";
            this.statusBaes = driverObj.driverProperties.status.stateBaes|| 0;
            this.statusPuls1 = driverObj.driverProperties.status.statePuls1|| 0;
            this.statusPuls2 = driverObj.driverProperties.status.statePuls2|| 0;
            this.statusPuls3 = driverObj.driverProperties.status.statePuls3|| 0;
            this.statusPuls4 = driverObj.driverProperties.status.statePuls4|| 0;
            this.statusPuls5 = driverObj.driverProperties.status.statePuls5|| 0;

            this.statusLedsPower = driverObj.driverProperties.status.ledsPower|| 0;
            this.statusBlindsPower = driverObj.driverProperties.status.blindsPower|| 0;
            this.statusHvacsPower = driverObj.driverProperties.status.hvacsPower|| 0;
            this.statusTotalPower = driverObj.driverProperties.status.totalPower|| 0;

            this.statusLedsEnergy = driverObj.driverProperties.status.ledsEnergy|| 0;
            this.statusBlindsEnergy = driverObj.driverProperties.status.blindsEnergy|| 0;
            this.statusHvacsEnergy = driverObj.driverProperties.status.hvacsEnergy|| 0;
            this.statusTotalEnergy = driverObj.driverProperties.status.totalEnergy|| 0;

            this.statusIsConfigured = driverObj.driverProperties.status.isConfigured;
            this.statusSoftwareVersion = driverObj.driverProperties.status.softwareVersion|| 0;
            this.statusHardwareVersion = driverObj.driverProperties.status.hardwareVersion ||0;
            this.statusDumpFrequency = driverObj.driverProperties.status.dumpFrequency;

            this.configName = this.statusName;
            this.configDumpFrequency = this.statusDumpFrequency;
            this.configCluster = this.statusCluster;

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

        get deviceType() {
            return this._deviceType;
        }

        set deviceType(val) {
            this._deviceType = val;
        }

        set statusError(val) {
            if (this._status_error === val) {
                return;
            }
            this._status_error = val;
            if (this._status_error != 0) {
                this._spot.className = this.error_color;
            } else {
                this._spot.className = this.default_color;
            }
            this.fire("error", this);
        }

        get statusError() {
            return this._status_error;
        }

        set statusIp(val) {
            if (this._status_ip === val) {
                return;
            }
            this._status_ip = val || "";
            if (this._status_ip === "") {
                this._spot.className = this.not_available_color;
            } else {
                this._spot.className = this.default_color;
            }
            this._ipElement.innerHTML = "IP: " +  this._status_ip;
            this.fire("ip", this);
        }

        get statusIp() {
            return this._status_ip;
        }

        set statusIsConfigured(val) {
            if (this._status_isConfigured === val) {
                return;
            }
            this._status_isConfigured = val || false;
            if (this._status_isConfigured === false) {
                this._spot.className = this.not_available_color;
            } else {
                this._spot.className = this.default_color;
            }
            this.fire("isConfigured", this);
        }

        get statusIsConfigured() {
            return this._status_isConfigured;
        }

        set statusMac(mc) {
            if (this._status_mac === mc) {
                return;
            }
            this._status_mac = mc || "";
            this._macElement.innerHTML = "Mac: " + this._status_mac;
            this.fire("mac", this);
        }

        get statusMac() {
            return this._status_mac;
        }

        set statusName(fr) {
            if (this._statusName === fr) {
                return;
            }
            this._statusName = fr || "";
            this._friendlyNameElement.innerHTML = "Name: " + this._statusName;
            this.fire("friendlyName", this);
        }

        get statusName() {
            return this._statusName;
        }

        set statusCluster(val) {
            if (this._status_cluster === val) {
                return;
            }
            this._status_cluster = val;
            this._clusterElement.innerHTML = "Cluster: " + this._status_cluster;
            this.fire("cluster", this);
        }

        get statusCluster() {
            return this._status_cluster;
        }

        updateEvent(driverObj) {
            console.log("update Switch", driverObj);
            this.statusName = driverObj.friendlyName;
            this.statusIp = driverObj.ip;
            this.statusMac = driverObj.mac;
            if (driverObj.hasOwnProperty("error")) {
                this.statusError = driverObj.error;
            }
            this.statusIsConfigured = driverObj.isConfigured;
            this.statusSoftwareVersion = driverObj.softwareVersion;
            this.statusHardwareVersion = driverObj.hardwareVersion;
            this.statusDumpFrequency = driverObj.dumpFrequency;
            this.statusProfil = driverObj.profil;
            this.statusBaes = driverObj.stateBaes;
            this.statusPuls1 = driverObj.statePuls1;
            this.statusPuls2 = driverObj.statePuls2;
            this.statusPuls3 = driverObj.statePuls3;
            this.statusPuls4 = driverObj.statePuls4;
            this.statusPuls5 = driverObj.statePuls5;

            this.statusLedsPower = driverObj.ledsPower;
            this.statusBlindsPower = driverObj.blindsPower;
            this.statusHvacsPower = driverObj.hvacsPower;
            this.statusTotalPower = driverObj.totalPower;

            this.statusLedsEnergy = driverObj.ledsEnergy;
            this.statusBlindsEnergy = driverObj.blindsEnergy;
            this.statusHvacsEnergy = driverObj.hvacsEnergy;
            this.statusTotalEnergy = driverObj.totalEnergy;

            this.statusCluster = driverObj.cluster;
            this.glyph = this.statusCluster;
        }

        destroy() {
            super.destroy();
        }

        statusElement(gui){
            var status = gui.addFolder("Switch Status");
            status.add(this, "statusName").name("Name").listen();
            return status;
        }

        statusGroupInfo(gui){
            if (gui != null){
                document.getElementById('dat-gui-container').removeChild(gui.domElement);
                gui.destroy();
                window.gui = null;
            }
        }

        groupControlParam(gui){
            if (gui != null){
                document.getElementById('dat-gui-container').removeChild(gui.domElement);
                gui.destroy();
                window.gui = null;
            }
        }

        groupConfigParam(gui){
            if (gui != null){
                document.getElementById('dat-gui-container').removeChild(gui.domElement);
                gui.destroy();
                window.gui = null;
            }
        }

        configElement(gui){
            var driver = this;
            var url = energieip.weblink + 'config/switch';
            var configuration = gui.addFolder("Switch Configuration");
            var name = configuration.add(this, "configName").name("Name");
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
            var freq = configuration.add(this, "configDumpFrequency").name("Refresh Frequency (s)");
            freq.onFinishChange(function (value) {
                var data = {
                    "mac": driver.statusMac,
                    "label": driver.label,
                    "dumpFrequency": parseInt(value)*1000
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
            configuration.open();
        }
    };

    energieip.SwitchSupervision = class switchSupervision extends energieip.Switch {
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

        controlElement(gui){
            if (gui != null){
                document.getElementById('dat-gui-container').removeChild(gui.domElement);
                gui.destroy();
                window.gui = null;
            }
        }
    };

    energieip.SwitchMaintenance = class switchMaintenance extends energieip.Switch {
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
            status.add(this, "statusProfil").name("Profil").listen();
            status.add(this, "statusBaes").name("BAES").listen();
            status.add(this, "statusPuls1").name("Puls 1").listen();
            status.add(this, "statusPuls2").name("Puls 2").listen();
            status.add(this, "statusPuls3").name("Puls 3").listen();
            status.add(this, "statusPuls4").name("Puls 4").listen();
            status.add(this, "statusPuls5").name("Puls 5+").listen();
            status.add(this, "statusPuls5").name("Puls 5+").listen();
            status.add(this, "statusLedsPower").name("LEDs Power (w)").listen();
            status.add(this, "statusBlindsPower").name("Blinds Power (w)").listen();
            status.add(this, "statusHvacsPower").name("HVACs Power (w)").listen();
            status.add(this, "statusTotalPower").name("Total Power (w)").listen();
            status.add(this, "statusLedsEnergy").name("LEDs Energy (wh)").listen();
            status.add(this, "statusBlindsEnergy").name("Blinds Energy (wh)").listen();
            status.add(this, "statusHvacsEnergy").name("HVACs Energy (wh)").listen();
            status.add(this, "statusTotalEnergy").name("Total Energy (wh)").listen();
            status.add(this, "statusError").name("Error Status").listen();
            status.add(this, "label").name("Cable").listen();
            status.add(this, "statusIp").name("IP").listen();
            status.add(this, "statusMac").name("Mac address").listen();
            status.add(this, "statusDumpFrequency").name("Refresh Frequency (s)").listen();
            status.open();
        }

        ifcInfo(gui){
            var ifc = gui.addFolder("Switch Information");
            ifc.add(this, "ifcModelName").name("Model Name");
            ifc.add(this, "ifcUrl").name("URL");
            ifc.add(this, "ifcVendor").name("Vendor Name");
            ifc.add(this, "ifcProductionYear").name("Production Year");
            ifc.open();
        }

        controlElement(gui){
            var driver = this;
            var controlDr = gui.addFolder("Switch Control");
            controlDr.add({"reset": function(){
                if (confirm("Do you want to reset the switch configuration ?")) {
                    energieip.ResetSwitchCfg(driver);
                }
            }}, "reset").name("Reset");
            controlDr.open();
        }
    };
}
