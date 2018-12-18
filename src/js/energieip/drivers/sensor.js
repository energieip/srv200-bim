{
    energieip.UpdateSensorCfg = function (dsensor) {
        var url = energieip.weblink + 'setup/sensor';
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

    energieip.Sensor = class sensor extends energieip.Driver {
        get type() {
            return "energieip.Sensor";
        }
 
        init(sensorObj) {
            super.init(sensorObj);
            
            this._deviceType = "Sensor";
            this._typeElement.innerHTML = this._deviceType;
        }
    };
}