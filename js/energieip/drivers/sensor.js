/*
EIP API
*/

{
    energieip.UpdateSensorCfg = function (dsensor) {
        var url = energieip.weblink + 'sensor/' + dsensor.mac;
        var xhr = new XMLHttpRequest();
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.onreadystatechange = function() {
            if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
            }
        }
        var content = {
            "mac": dsensor.mac,
            "group": parseInt(dsensor.group),
            "friendlyName": dsensor.friendlyName,
        };
        xhr.send(JSON.stringify(content));
    }

    energieip.SensorDevice = function (mesh, label, flyTo, onConfigChanged) {
        var Http = new XMLHttpRequest();
        var url = energieip.weblink + 'modelInfo/' + label;
        console.log("=== send " + url);
        Http.open("GET", url, false); //synchrone request
        Http.send();

        if (Http.status === 200){
            console.log("get response", Http.responseText);
            obj = JSON.parse(Http.responseText);
            var i = 0;
            var group = "0";
            var friendlyName = "";
            var mac = "";
         
            if (obj.hasOwnProperty("group")){
                group = obj["group"].toString();
            }
            if (obj.hasOwnProperty("friendlyName")){
                friendlyName = obj["friendlyName"].toString();
            }
            if (obj.hasOwnProperty("mac")){
                mac = obj["mac"].toString();
            }
            sensor = new energieip.Sensor({
                label: label,
                mesh: mesh,
                occludable: true,
                glyph: mac,
                title: "",
                desc: "",
                mac: mac,
                friendlyName: friendlyName,
                group: group,
                pinShown: true,
                labelShown: true
            });
            sensor.on("pinClicked", flyTo);
            sensor.on("group", onConfigChanged);
            sensor.on("friendlyName", onConfigChanged);
            return sensor;
        }
    }

    energieip.Sensor = class sensor extends xeogl.Annotation {
        get type() {
            return "energieip.Sensor";
        }
 
        init(sensorObj) {
            super.init(sensorObj);
            
            this._groupElement = document.createElement('div');
            this._groupElement.className = "xeogl-annotation-group";
            this._groupElement.innerHTML = sensorObj.group || "0";
            this._label.appendChild(this._groupElement);

            this._macElement = document.createElement('div');
            this._macElement.className = "xeogl-annotation-mac";
            this._macElement.innerHTML = sensorObj.mac || "";
            this._label.appendChild(this._macElement);

            this._friendlyNameElement = document.createElement('div');
            this._friendlyNameElement.className = "xeogl-annotation-alias";
            this._friendlyNameElement.innerHTML = sensorObj.friendlyName || "";
            this._label.appendChild(this._friendlyNameElement);

            this.group = sensorObj.group;
            this.mac = sensorObj.mac;
            this.friendlyName = sensorObj.friendlyName;
            this.label = sensorObj.label;
        }

        set group(gr) {
            if (this._group === gr) {
                return;
            }
            this._group = gr || "0";
            this._groupElement.innerHTML = this._group;
            this.fire("group", this);
        }

        get group() {
            return this._group;
        }

        set mac(mc) {
            if (this._mac === mc) {
                return;
            }
            this._mac = mc || "";
            this._macElement.innerHTML = this._mac;
            this.fire("mac", this);
        }

        get mac() {
            return this._mac;
        }

        set friendlyName(fr) {
            if (this._friendlyName === fr) {
                return;
            }
            this._friendlyName = fr || "";
            this._friendlyNameElement.innerHTML = this._friendlyName;
            this.fire("friendlyName", this);
        }

        get friendlyName() {
            return this._friendlyName;
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
    };
}