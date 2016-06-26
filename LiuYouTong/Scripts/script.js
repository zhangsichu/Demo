$(document).ready(function () {
	var isWorking = false;
    $("img[info]").bind('mouseover', function (event) {
        event.currentTarget.src = "Images/_" + event.currentTarget.getAttribute("info") + ".png";
    });
    $("img[info]").bind('mouseout', function (event) {
        event.currentTarget.src = "Images/" + event.currentTarget.getAttribute("info") + ".png";
    });
    $("img[info]").bind('click', function (event) {
		if(isWorking)
			return;
		
		isWorking = true;
        //1. get the current app item.
        var currentItem = null;
        var list = $(".iPhoneApp");
        for (var i = 0; i < list.length; i++) {
            if (!jQuery(list[i]).hasClass("iPhoneAppHide")) {
                currentItem = jQuery(list[i]);
                break;
            }
        }

        //no current item.
        if (currentItem == null){
            isWorking = false;
			return;
		}

        //set some values;
        var timeSpan = 300;
        var timeSpanMenu = 1000;
        var targetInfo = event.currentTarget.getAttribute("info");
        var targetItem = $("#" + targetInfo + "App");

        //2. hide the menu.
        var menuList = $("#iPhoneMenu");
        menuList.attr("disabled", "disabled");
        menuList.hide("fade", { percent: 0 }, timeSpan, function () {
            menuList.show("fade", { percent: 100 }, timeSpanMenu, function () {
                menuList.removeAttr("disabled");
            });
        });

        //3. slide app item.
        currentItem.hide("slide", { direction: "left" }, timeSpan, function () {
            currentItem.addClass("iPhoneAppHide");
            targetItem.removeClass("iPhoneAppHide");
            targetItem.show("slide", { direction: "right" }, timeSpan, function(){
				isWorking = false;
			});
        });
    });
});
