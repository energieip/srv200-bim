{
    energieip.Driver = class driver extends xeogl.Annotation {
        get type() {
            return "energieip.Driver";
        }
 
        init(driverObj) {
            super.init(driverObj);

            this.default_color = "xeogl-annotation-pin";
            this.error_color = "xeogl-annotation-pin-error";
            this.not_available_color = "xeogl-annotation-pin-not-present";
            this.deviceType = energieip.driver;

            this._typeElement = document.createElement('div');
            this._typeElement.innerHTML = this.deviceType;
            this._typeElement.className = "xeogl-annotation-group";
            this._label.appendChild(this._typeElement);

            this._groupElement = document.createElement('div');
            this._groupElement.className = "xeogl-annotation-group";
            this._label.appendChild(this._groupElement);

            this._ipElement = document.createElement('div');
            this._ipElement.className = "xeogl-annotation-group";

            this._macElement = document.createElement('div');
            this._macElement.className = "xeogl-annotation-mac";

            this._friendlyNameElement = document.createElement('div');
            this._friendlyNameElement.className = "xeogl-annotation-alias";
            this._label.appendChild(this._friendlyNameElement);

            this.statusGroup = driverObj.driverProperties.status.group;
            this.statusMac = driverObj.driverProperties.status.mac;
            this.statusName = driverObj.driverProperties.status.friendlyName;
            this.statusError = driverObj.driverProperties.status.error;
            this.label = driverObj.label;
            this.statusIp = driverObj.driverProperties.status.ip;

            this.configName = "";

            this.GroupControlLight = 0;
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

        set statusGroup(gr) {
            if (this._status_group === gr) {
                return;
            }
            this._status_group = gr || "0";
            this._groupElement.innerHTML = "Group: " +  this._status_group;
            this.fire("group", this);
        }

        get statusGroup() {
            return this._status_group;
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
    
        getJSON() {
            var json = super.getJSON();
            json.mac = this.mac;
            json.group = this._group;
            json.friendlyName = this._friendlyName;
            return json;
        }

        destroy() {
            super.destroy();
        }

        updateEvent(driverObj) {
            console.log("update", driverObj);
            this.statusGroup = driverObj.group;
            this.statusName = driverObj.friendlyName;
            this.statusIp = driverObj.ip;
            this.statusError = driverObj.error;
        }
    };
}