(function () {
    var encoder = {};
    encoder.init = function () {
        encoder.dragPanel = document.getElementById("dragPanel");
        encoder.infoText = document.getElementById("infoText");
        encoder.urlArea = document.getElementById("urlArea");
        encoder.dragPanel.addEventListener("dragenter", function (e) { e.stopPropagation(); e.preventDefault(); }, false);
        encoder.dragPanel.addEventListener("dragover", function (e) { e.stopPropagation(); e.preventDefault(); }, false);
        encoder.dragPanel.addEventListener("drop", function (e) { encoder.handleFiles(e); e.stopPropagation(); e.preventDefault(); }, false);
    };
    encoder.handleFilesWithWorker = function (e) {
        var worker = new Worker('worker.js');
        worker.onmessage = function (result) {
            if (result.data.status == "Finished") {
                encoder.urlArea.value = result.data.data;
                encoder.infoText.innerHTML = "Drag Here";
                encoder.dragPanel.style.backgroundImage = "url(" + result.data.data + ")";
                encoder.dragPanel.style.cursor = "move";
                encoder.dragPanel.draggable = "true";
                encoder.notify(result.data.data, "Finished", "Drag Process Finished From Worker!");
            }
            else {
                encoder.infoText.innerHTML = result.data.status;
            }
        };
        worker.postMessage({ command: "start", files: e.dataTransfer.files });
    };
    encoder.handleFiles = function (e) {
        var files = e.dataTransfer.files;
        for (var i = 0; i < files.length; i++) {
            var reader = new FileReader();

            reader.onprogress = function (e) {
                if (e.lengthComputable) {
                    encoder.infoText.innerHTML = "Loading";
                }
            };

            reader.onloadstart = function (e) {
                encoder.infoText.innerHTML = "Start";
            };

            reader.onload = function (e) {
                encoder.urlArea.value = e.target.result;
                encoder.infoText.innerHTML = "Drag Here";
                encoder.dragPanel.style.backgroundImage = "url(" + e.target.result + ")";
                encoder.dragPanel.style.cursor = "move";
                encoder.dragPanel.draggable = "true";
                encoder.notify(e.target.result, "Finished", "Drag Process Finished!");
            };
            reader.readAsDataURL(files[i]);
        }
    };
    encoder.notify = function (pic, title, text) {
        if (window.webkitNotifications.checkPermission() == 0) {
            window.webkitNotifications.createNotification(pic, title, text).show();
        } else {
            window.webkitNotifications.requestPermission();
        }
    };


    var fileOperator = {};
    fileOperator.init = function () {
        fileOperator.fileAPI = document.getElementById("fileAPI");
        if (window.URL) {
            fileOperator.fileAPI.addEventListener('change', fileOperator.handleFiles, false);
        }
        else {
            document.getElementById("fileAPIShow").onclick = fileOperator.showImage;
        }
    };
    fileOperator.handleFiles = function (e) {
        var item = e.target;
        if (fileOperator.img == null) {
            fileOperator.img = document.createElement("img");
            fileOperator.img.id = "fileAPI-img";
            e.target.parentElement.appendChild(fileOperator.img);
        }

        if (window.URL) {
            if (item.files && item.files.length) {
                fileOperator.img.src = window.URL.createObjectURL(item.files[0]);
            }
        }
    };

    fileOperator.showImage = function (e) {
        if (fileOperator.img == null) {
            fileOperator.img = document.createElement("img");
            fileOperator.img.id = "fileAPI-img";
            this.parentElement.appendChild(fileOperator.img);
        }
        fileOperator.img.src = fileOperator.fileAPI.value;
    };

    if (!!window.ActiveXObject) {
        fileOperator.init();
    }
    else {
        window.addEventListener("load", function () {
            encoder.init();
            fileOperator.init();
        }, false);
    }
})();
