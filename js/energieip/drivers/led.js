{
    energieip.UpdateLedCfg = function (dled) {
        var url = energieip.weblink + 'setup/led';
        var xhr = new XMLHttpRequest();
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.onreadystatechange = function() {
            if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
            }
        }
        var content = {
            "mac": dled.mac,
            "group": parseInt(dled.group),
            "friendlyName": dled.friendlyName,
        };
        xhr.send(JSON.stringify(content));
    }

    energieip.Led = class led extends energieip.Driver {
        get type() {
            return "energieip.Led";
        }
 
        init(sensorObj) {
            super.init(sensorObj);
            
            this._deviceType = "Led";
            this._typeElement.innerHTML = this._deviceType;
        }

    };
}