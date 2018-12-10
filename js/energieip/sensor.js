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

    energieip.SensorNotification = function () {
        var ws = new WebSocket("ws://"+energieip.address+"/sensors/events");

        ws.onmessage = function (evt) {
            console.log("=== Received " + evt.data);
        };

        ws.onclose = function() {
            console.log("connection close ");
        };

        ws.onerror = function() {
            console.log("connection on erreur ");
        };

    }

    energieip.Sensors = function () {
        var Http = new XMLHttpRequest();
        var url = energieip.weblink + 'sensors';
        Http.open("GET", url);
        Http.send();
        var sensors = [];
    
        Http.onreadystatechange = function() {
            if(this.readyState==4 && this.status == 200){
                obj = JSON.parse(Http.responseText);
                var i = 0;
                for(var key in obj){
                    if (obj.hasOwnProperty(key)){
                        var value = obj[key];
                        var group = "0";
                        var friendlyName = "";
                        i ++;
                        for(var k in value){
                            if (value.hasOwnProperty("group")){
                                group = value[k].toString();
                            }
                            if (value.hasOwnProperty("friendlyName")){
                                friendlyName = value[k].toString();
                            }
                        }

                        sensors.push(new energieip.Sensor({
                            primIndex: i,
                            bary: [0.05, 0.16, 0.79],
                            occludable: true,
                            glyph: key,
                            title: "",
                            desc: "",
                            mac: key,
                            friendlyName: friendlyName,
                            group: group,
                            eye: [-0.66, 20.84, -21.59],
                            look: [-0.39, 6.84, -9.18],
                            up: [0.01, 0.97, 0.24],
                            pinShown: true,
                            labelShown: true
                        }));
                    }
                }
            }
        }
        return sensors;
    }

    energieip.Sensor = class sensor extends xeogl.Annotation {
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