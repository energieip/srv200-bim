{
    energieip.UpdateSwitchNameCfg = function (driver) {
        var url = energieip.weblink + 'config/switch';
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
            "mac": driver.statusMac,
            "friendlyName": driver.configName,
        };
        xhr.send(JSON.stringify(content));
    }

    energieip.UpdateSwitchCfg = function (driver) {
        var url = energieip.weblink + 'config/sensor';
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
            "mac": driver.statusMac,
            "friendlyName": driver.configName,
            "cluster": parseInt(driver.cluster),
            "dumpFrequency": parseInt(driver.configDumpFrequency)
        };
        xhr.send(JSON.stringify(content));
    }

    energieip.ResetSwitchCfg = function (driver) {
        var url = energieip.weblink + 'config/sensor';
        var xhr = new XMLHttpRequest();
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.onreadystatechange = function() {
            if (this.readyState === XMLHttpRequest.DONE) {
                if (this.status === 200) {
                    alert("Command successfull");
                } else {
                    alert("Command Error");
                }
            }
        }
        var content = {
            "mac": driver.statusMac,
            "isConfigured": false,
        };
        xhr.send(JSON.stringify(content));
    }

    energieip.Switch = class dswitch extends xeogl.Annotation {
        get type() {
            return "energieip.Switch";
        }
 
        init(driverObj) {
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

            this.statusMac = driverObj.driverProperties.status.mac;
            this.statusName = driverObj.driverProperties.status.friendlyName;
            this.statusError = driverObj.driverProperties.status.error;
            this.statusCluster = driverObj.driverProperties.status.cluster;
            this.label = driverObj.label;
            this.statusIp = driverObj.driverProperties.status.ip;
            this.statusIsConfigured = driverObj.driverProperties.status.isConfigured;
            // this.statusSoftwareVersion = driverObj.driverProperties.status.softwareVersion;
            // this.statusHardwareVersion = driverObj.driverProperties.status.hardwareVersion;
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
            this.statusError = driverObj.error;
            this.statusIsConfigured = driverObj.isConfigured;
            // this.statusSoftwareVersion = driverObj.softwareVersion;
            // this.statusHardwareVersion = driverObj.hardwareVersion;
            this.statusDumpFrequency = driverObj.dumpFrequency;

            //Fix default value
            this.configName = this.statusName;
            this.statusCluster = driverObj.cluster;

            this.configCluster = this.statusCluster;
            this.configDumpFrequency = this.statusDumpFrequency;
            this.glyph = this.statusGroup;
        }

        destroy() {
            super.destroy();
        }
    };

    energieip.SwitchSupervision = class switchSupervision extends energieip.Switch {
        init(driverObj) {
            super.init(driverObj);
        }

        updateEvent(driverObj) {
            super.updateEvent(driverObj);
        }
    };

    energieip.SwitchMaintenance = class switchMaintenance extends energieip.Switch {
        init(driverObj) {
            super.init(driverObj);
            this._label.appendChild(this._macElement);
            this._label.appendChild(this._ipElement);

            this.ifcModelName = driverObj.driverProperties.ifc.modelName;
            this.ifcUrl = driverObj.driverProperties.ifc.url;
            this.ifcVendor = driverObj.driverProperties.ifc.vendor;
        }

        updateEvent(driverObj) {
            super.updateEvent(driverObj);
        }
    };
}
