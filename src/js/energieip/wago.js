{
    energieip.UpdateWagoNameCfg = function (driver) {
        var url = energieip.weblink + 'config/wago';
        var data = {
            "mac": driver.statusMac,
            "friendlyName": driver.configName,
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

    energieip.UpdateWagoCfg = function (driver) {
        var url = energieip.weblink + 'config/wago';
        var data = {
            "mac": driver.statusMac,
            "friendlyName": driver.configName,
            "cluster": parseInt(driver.cluster)
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

    energieip.ResetWagoCfg = function (driver) {
        var url = energieip.weblink + 'config/wago';
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

    energieip.Wago = class wago extends xeogl.Annotation {
        get type() {
            return "energieip.Wago";
        }
 
        init(driverObj) {
            super.init(driverObj);
            this.error_color = "xeogl-annotation-pin-error";
            this.not_available_color = "xeogl-annotation-pin-not-present";
            this.default_color = "xeogl-annotation-pin-wago";

            this._spot.className = this.default_color;

            this.deviceType = energieip.wagoDevice;
            this._typeElement = document.createElement('div');
            this._typeElement.innerHTML = "Wago: " + this.deviceType;
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
            this.statusIsConfigured = driverObj.driverProperties.status.isConfigured;
            this.statusSoftwareVersion = driverObj.driverProperties.status.softwareVersion|| 0;

            this.statusProg = {}
            for (var i in driverObj.driverProperties.status.cronJobs){
                this.statusProg[driverObj.driverProperties.status.cronJobs[i].action] = driverObj.driverProperties.status.cronJobs[i].status;
            }

            this.configName = this.statusName;
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
            console.log("update Wago", driverObj);
            this.statusName = driverObj.friendlyName;
            this.statusIp = driverObj.ip;
            this.statusMac = driverObj.mac;
            if (driverObj.hasOwnProperty("error")) {
                this.statusError = driverObj.error;
            }
            this.statusIsConfigured = driverObj.isConfigured;
            this.statusSoftwareVersion = driverObj.softwareVersion;

            this.statusCluster = driverObj.cluster;
            this.statusProg = {}
            for (var i in driverObj.cronJobs){
                this.statusProg[driverObj.cronJobs[i].action] = driverObj.cronJobs[i].status;
            }
            this.glyph = this.statusCluster;
        }

        destroy() {
            super.destroy();
        }

        statusElement(gui){
            var status = gui.addFolder("Wago Status");
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
            var configuration = gui.addFolder("Wago Configuration");
            configuration.add(this, "configName").name("Name");
            configuration.add({"OK":function(){ energieip.UpdateWagoCfg(driver); }}, "OK").name("Apply");
            configuration.open();
        }
    };

    energieip.WagoSupervision = class wagoSupervision extends energieip.Wago {
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

    energieip.WagoMaintenance = class wagoMaintenance extends energieip.Wago {
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
            for (var k in this.statusProg){
                status.add(this.statusProg, k).name(k).listen();
            }
            status.add(this, "statusError").name("Error Status").listen();
            status.add(this, "label").name("Cable").listen();
            status.add(this, "statusIp").name("IP").listen();
            status.add(this, "statusMac").name("Mac address").listen();
            status.add(this, "statusCluster").name("Cluster").listen();
            status.add(this, "statusSoftwareVersion").name("Software Version").listen();
            status.open();
        }

        ifcInfo(gui){
            var ifc = gui.addFolder("Wago Information");
            ifc.add(this, "ifcModelName").name("Model Name");
            ifc.add(this, "ifcUrl").name("URL");
            ifc.add(this, "ifcVendor").name("Vendor Name");
            ifc.add(this, "ifcProductionYear").name("Production Year");
            ifc.open();
        }

        controlElement(gui){
            var driver = this;
            var controlDr = gui.addFolder("Wago Control");
            controlDr.add({"reset": function(){
                if (confirm("Do you want to reset the wago configuration ?")) {
                    energieip.ResetWagoCfg(driver);
                }
            }}, "reset").name("Reset");
            controlDr.open();
        }
    };
}
