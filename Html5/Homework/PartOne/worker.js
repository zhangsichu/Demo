self.onmessage = function (event) {
    if (event != null && event.data != null && event.data.command == "start") {
        var reader = new FileReader();
        reader.onprogress = function (e) {
            if (e.lengthComputable) {
                self.postMessage({ status: "Loading" });
            }
        };
        reader.onloadstart = function (e) {
            self.postMessage({ status: "Start" });
        };
        reader.onload = function (e) {
            self.postMessage({ status: "Finished", data: e.target.result });
        };
        reader.readAsDataURL(event.data.files[0]);
        reader = null;
    }
};