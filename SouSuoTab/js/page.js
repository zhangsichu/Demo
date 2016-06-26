$(function () {
    //Utility Functions
    var traceAjax = function (url, data) {
        try {
            $.ajax({
                type: "POST",
                url: url,
                data: data
            });
        }
        catch (error) {
        }
    };
    var traceClick = function (category, tab, keyword) {
        traceAjax("/api/search-entry", {src:1, domain: category, keyword: keyword})
    };
    var traceDrag = function (event, ui) {
        var id = ui.item.attr("id");
        var domain = "www.baidu.com";
        switch (id) {
            case "icon-baidu":
                domain = "www.baidu.com";
                break;
            case "icon-google":
                domain = "www.google.com.hk";
                break;
            case "icon-sogou":
                domain = "www.sogou.com";
                break;
            case "icon-360":
                domain = "www.so.com";
                break;
            case "icon-jd":
                domain = "www.jd.com";
                break;
            case "icon-amazon":
                domain = "www.amazon.cn";
                break;
            case "icon-taobao":
                domain = "www.taobao.com";
                break;
            case "icon-xun":
                domain = "www.yixun.com";
                break;
            case "icon-dazhong":
                domain = "www.dianping.com";
                break;
            case "icon-tutuso":
                domain = "tutuso.cn";
                break;
            case "icon-etao":
                domain = "www.etao.com";
                break;
            case "icon-qiche":
                domain = "www.autohome.com.cn";
                break;
            case "icon-dou":
                domain = "www.douban.com";
                break;
            case "icon-58":
                domain = "www.58.com";
                break;
        }
        traceAjax("/api/default-engine", { src: 1, domain: domain })
    };
    var backToUtf8 = function () {
        $(document).attr("charset", "utf-8");
    };

    //Whole page UI
    $("#tabs").tabs().addClass("ui-tabs-vertical ui-helper-clearfix");
    $("#tabs li").removeClass("ui-corner-top").addClass("ui-corner-left");
    $("#sortable").sortable({ cursor: "move", update: traceDrag });
    $("#sortable").disableSelection();

    //Logo
    $("#sortable>li").click(function (e) {
        var id = $(this).attr("id");
        $("#search-body>.search-body-show").removeClass("search-body-show").hide();
        $("#search" + id.substr(4)).show().addClass("search-body-show");
    });
    $("#sortable>li").dblclick(function (e) {
        var id = $(this).attr("id");
        var url = "http://www.baidu.com";
        switch (id) {
            case "icon-baidu":
                url = "http://www.baidu.com/";
                break;
            case "icon-google":
                url = "http://www.google.com.hk/";
                break;
            case "icon-sogou":
                url = "http://www.sogou.com/";
                break;
            case "icon-360":
                url = "http://www.so.com/";
                break;
            case "icon-jd":
                url = "http://www.jd.com/";
                break;
            case "icon-amazon":
                url = "http://www.amazon.cn/";
                break;
            case "icon-taobao":
                url = "http://www.taobao.com/";
                break;
            case "icon-xun":
                url = "http://www.yixun.com/";
                break;
            case "icon-dazhong":
                url = "http://www.dianping.com/";
                break;
            case "icon-tutuso":
                url = "http://tutuso.cn/";
                break;
            case "icon-etao":
                url = "http://www.etao.com/";
                break;
            case "icon-qiche":
                url = "http://www.autohome.com.cn/";
                break;
            case "icon-dou":
                url = "http://www.douban.com/";
                break;
            case "icon-58":
                url = "http://www.58.com/";
                break;
        }
        window.open(url);
    });

    //Baidu
    $("#baiduSearch").mousedown(function () {
        $(this).addClass("baidu-button-down");
    }).mouseout(function () {
        $(this).removeClass("baidu-button-down");
    });
    $("#baidu-text>span").click(function () {
        $("#baidu-text>span.normal").removeClass("normal").addClass("link");
        $(this).removeClass("link").addClass("normal");
    });
    $("#baidu-form").submit(function () {
        var target = $("#baidu-text>span.normal");
        var form = $("#baidu-form");
        var input = $("#baidu-input");

        var traceCategory = "www.baidu.com";
        var keyword = $("#baidu-input").val();
        
        switch (target.attr("id")) {
            case "baidu-news":
                form.attr("action", "http://news.baidu.com/ns");
                input.attr("name", "word");
                traceClick(traceCategory, "News", keyword);
                break;
            case "baidu-web":
                form.attr("action", "http://www.baidu.com/s");
                input.attr("name", "word");
                traceClick(traceCategory, "Web", keyword);
                break;
            case "baidu-tieba":
                form.attr("action", "http://tieba.baidu.com/f");
                input.attr("name", "kw");
                traceClick(traceCategory, "TieBa", keyword);
                break;
            case "baidu-zhidao":
                form.attr("action", "http://zhidao.baidu.com/search");
                input.attr("name", "word");
                traceClick(traceCategory, "ZhiDao", keyword);
                break;
            case "baidu-music":
                form.attr("action", "http://music.baidu.com/search");
                input.attr("name", "key");
                traceClick(traceCategory, "Music", keyword);
                break;
            case "baidu-pic":
                form.attr("action", "http://image.baidu.com/i");
                input.attr("name", "word");
                traceClick(traceCategory, "Image", keyword);
                break;
            case "baidu-video":
                form.attr("action", "http://video.baidu.com/v");
                input.attr("name", "word");
                traceClick(traceCategory, "Video", keyword);
                break;
            case "baidu-map":
                form.attr("action", "http://map.baidu.com/m");
                input.attr("name", "word");
                traceClick(traceCategory, "Map", keyword);
                break;
            case "baidu-wenku":
                form.attr("action", "http://wenku.baidu.com/search");
                input.attr("name", "word");
                traceClick(traceCategory, "WenKu", keyword);
                break;
        }

        return true;
    });

    //Google
    $("#googleInput").focus(function () {
        $("#google-input-wrapper").addClass("focus");
    }).blur(function () {
        $("#google-input-wrapper").removeClass("focus");
    });
    $("#google-form").submit(function () {
        var traceCategory = "www.google.com.hk";
        var keyword = $("#googleInput").val();
        traceClick(traceCategory, "Google", keyword);
        return true;
    });

    //Sogou
    $("#sogou-button").mousedown(function () {
        $(this).addClass("sogou-button-down");
    }).mouseout(function () {
        $(this).removeClass("sogou-button-down");
    }).mouseup(function () {
        $(this).removeClass("sogou-button-down");
    });
    $("#sogou-text-line>span").click(function () {
        $("#sogou-text-line>span.normal").removeClass("normal").addClass("link");
        $(this).removeClass("link").addClass("normal");
    });
    $("#sogou-form").submit(function () {
        var target = $("#sogou-text-line>span.normal");
        var form = $("#sogou-form");
        var input = $("#sogou-input");

        var traceCategory = "www.sogou.com";
        var keyword = $("#sogou-input").val();

        switch (target.attr("id")) {
            case "sogou-news":
                form.attr("action", "http://news.sogou.com/news");
                input.attr("name", "query");
                traceClick(traceCategory, "News", keyword);
                break;
            case "sogou-web":
                form.attr("action", "http://www.sogou.com/web");
                input.attr("name", "query");
                traceClick(traceCategory, "Web", keyword);
                break;
            case "sogou-music":
                form.attr("action", "http://mp3.sogou.com/music.so");
                input.attr("name", "query");
                traceClick(traceCategory, "Mp3", keyword);
                break;
            case "sogou-pic":
                form.attr("action", "http://pic.sogou.com/pics");
                input.attr("name", "query");
                traceClick(traceCategory, "Image", keyword);
                break;
            case "sogou-video":
                form.attr("action", "http://v.sogou.com/v");
                input.attr("name", "query");
                traceClick(traceCategory, "Video", keyword);
                break;
            case "sogou-map":
                form.attr("action", "http://map.sogou.com/");
                input.attr("name", "lq");
                traceClick(traceCategory, "Map", keyword);
                break;
            case "sogou-zhishi":
                form.attr("action", "http://zhishi.sogou.com/zhishi");
                input.attr("name", "query");
                traceClick(traceCategory, "ZhiShi", keyword);
                break;
            case "sogou-shop":
                form.attr("action", "http://gouwu.sogou.com/shop");
                input.attr("name", "query");
                traceClick(traceCategory, "Shop", keyword);
                break;
        }
        return true;
    });

    //360
    $("#so-text-line>span").click(function () {
        $("#so-text-line>span.normal").removeClass("normal").addClass("link");
        $(this).removeClass("link").addClass("normal");
    });
    $("#360-form").submit(function () {
        var target = $("#so-text-line>span.normal");
        var form = $("#360-form");
        var input = $("#soInput");

        var traceCategory = "www.so.com";
        var keyword = $("#soInput").val();

        switch (target.attr("id")) {
            case "360-news":
                form.attr("action", "http://news.so.com/ns");
                input.attr("name", "q");
                traceClick(traceCategory, "News", keyword);
                break;
            case "360-web":
                form.attr("action", "http://www.so.com/s");
                input.attr("name", "q");
                traceClick(traceCategory, "Web", keyword);
                break;
            case "360-wenda":
                form.attr("action", "http://wenda.so.com/search/");
                input.attr("name", "q");
                traceClick(traceCategory, "WenDa", keyword);
                break;
            case "360-video":
                form.attr("action", "http://video.so.com/mini.php");
                input.attr("name", "kw");
                traceClick(traceCategory, "Video", keyword);
                break;
            case "360-pic":
                form.attr("action", "http://image.so.com/i");
                input.attr("name", "q");
                traceClick(traceCategory, "Image", keyword);
                break;
            case "360-music":
                form.attr("action", "http://s.music.so.com/s");
                input.attr("name", "q");
                traceClick(traceCategory, "Music", keyword);
                break;
            case "360-map":
                form.attr("action", "http://map.so.com/");
                traceClick(traceCategory, "Map", keyword);
                input.attr("name", "k");
                break;
            case "360-liangyi":
                form.attr("action", "http://ly.so.com/s");
                traceClick(traceCategory, "LiangYi", keyword);
                input.attr("name", "q");
                break;
            case "360-leidian":
                form.attr("action", "http://www.leidian.com/s");
                traceClick(traceCategory, "LeiDian", keyword);
                input.attr("name", "q");
                break;
        }
        return true;
    });

    //JingDong
    $("#jd-form").submit(function () {
        var traceCategory = "www.jd.com";
        var keyword = $("#jd-input").val();
        traceClick(traceCategory, "JingDong", keyword);
        return true;
    });

    //Amazon
    $("#amazon-form").submit(function () {
        var traceCategory = "www.amazon.cn";
        var keyword = $("#amazon-input").val();
        traceClick(traceCategory, "Amazon", keyword);
        return true;
    });

    //Taobao
    $("#taobao-tab-header>li").click(function () {
        $("#taobao-tab-header>li.current").removeClass("current").addClass("normal");
        $(this).removeClass("normal").addClass("current");
    });
    $("#taobao-form").submit(function () {
        var target = $("#taobao-tab-header>li.current");
        var input = $("#taobao-app");
        var form = $("#taobao-form");

        var traceCategory = "www.taobao.com";
        var keyword = $("#taobao-input").val();

        switch (target.attr("id")) {
            case "taobao-baobei":
                traceClick(traceCategory, "BaoBei", keyword);
                form.attr("action", "http://s.taobao.com/search").attr("accept-charset", "utf-8");
                input.val('');
                $(document).attr("charset", "utf-8");
                break;
            case "taobao-dianpu":
                traceClick(traceCategory, "DianPu", keyword);
                form.attr("action", "http://s.taobao.com/search").attr("accept-charset", "utf-8");
                input.val("shopsearch");
                $(document).attr("charset", "utf-8");
                break;
            case "taobao-tianmao":
                traceClick(traceCategory, "TianMao", keyword);
                form.attr("action", "http://list.tmall.com/search_product.htm").attr("accept-charset", "gb2312");
                input.val('');
                $(document).attr("charset", "gb2312");
                break;
        }

        window.setTimeout(backToUtf8, 500);
        return true;
    });

    //Xun
    $("#xun-form").submit(function () {
        var traceCategory = "www.yixun.com";
        var keyword = $("#xun-input").val();

        if (keyword == null || keyword == '')
            $(this).attr("action", "http://www.yixun.com/");
        else
            $(this).attr("action", "http://searchex.yixun.com/html");

        traceClick(traceCategory, "YiXun", keyword);
        return true;
    });

    //Dangzhong
    $("#dazhong-tab-header>li").click(function () {
        $("#dazhong-tab-header>li.current").removeClass("current").addClass("normal");
        $(this).removeClass("normal").addClass("current");
    });
    $("#dazhong-link").click(function (e) {
        var dazhongId = $("#dazhong-tab-header>li.current>span").attr("id");
        var link = "";

        var traceCategory = "www.dianping.com";
        var traceTab = "";
        switch (dazhongId) {
            case "dazhong-index":
                link = "http://www.dianping.com/search/keyword/2/0_";
                traceTab = "Web";
                break;
            case "dazhong-tuangou":
                link = "http://t.dianping.com/beijing?q=";
                traceTab = "TuanGou";
                break;
            case "dazhong-youhui":
                link = "http://www.dianping.com/promo/search/2/0_";
                traceTab = "YouHui";
                break;
            case "dazhong-huiyuan":
                link = "http://www.dianping.com/card/beijing/search/d_c?q=";
                traceTab = "HuiYuan";
                break;
            case "dazhong-shequ":
                link = "http://s.dianping.com/search/1_";
                traceTab = "SheQu";
                break;
        }

        var blankUrl = "http://www.dianping.com";
        var target = $(this);
        var keyword = $("#dazhong-input").val();

        if (keyword == null || keyword == "")
            link = blankUrl;
        else
            link += encodeURIComponent(keyword);

        target.attr("href", link);
        traceClick(traceCategory, traceTab, keyword);
        return true;
    });

    //Tutuso
    $("#tutuso-switch-woman").click(function () {
        $("#tutuso-woman").show();
        $("#tutuso-man").hide();
    });
    $("#tutuso-switch-man").click(function () {
        $("#tutuso-woman").hide();
        $("#tutuso-man").show();
    });
    $("#tutusoWoman-form").submit(function () {
        traceClick("tutuso.cn", "Woman", $("#tutuso-woman-input").val());
        return true;
    });
    $("#tutusoMan-form").submit(function () {
        traceClick("tutuso.cn", "Man", $("#tutuso-man-input").val());
        return true;
    });

    //Etao
    $("#etao-tab>span").click(function () {
        $("#etao-tab>span.normal").removeClass("normal").addClass("link");
        $(this).removeClass("link").addClass("normal");
    });
    $("#etao-form").submit(function () {
        var target = $("#etao-tab>span.normal");
        var input = $("#etao-search-type");
        var form = $("#etao-form");

        var traceCategory = "www.etao.com";
        var keyword = $("#etao-input").val();

        switch (target.attr("id")) {
            case "etao-whole":
                traceClick(traceCategory, "Web", keyword);
                form.attr("action", "http://s.etao.com/search").attr("accept-charset", "utf-8");
                input.val('');
                $(document).attr("charset", "utf-8");
                break;
            case "etao-b2c":
                traceClick(traceCategory, "B2C", keyword);
                form.attr("action", "http://s.etao.com/search").attr("accept-charset", "utf-8");
                input.val("b2c");
                $(document).attr("charset", "utf-8");
                break;
            case "etao-haitao":
                traceClick(traceCategory, "HaiTao", keyword);
                form.attr("action", "http://s.etao.com/search").attr("accept-charset", "utf-8");
                input.val("haiwai");
                $(document).attr("charset", "utf-8");
                break;
            case "etao-jiudian":
                traceClick(traceCategory, "JiuDian", keyword);
                form.attr("action", "http://hotel.etao.com/hotel_list.htm").attr("accept-charset", "gb2312");
                input.val("");
                $(document).attr("charset", "gb2312");
                break;
        }

        window.setTimeout(backToUtf8, 500);
        return true;
    });

    //Qiche
    $("#qiche-input").focus(function () {
        $("#qiche-input-wrapper").addClass("focus");
    }).blur(function () {
        $("#qiche-input-wrapper").removeClass("focus");
    });
    $("#qiche-tab>span").click(function () {
        $("#qiche-tab>span.normal").removeClass("normal").addClass("link");
        $(this).removeClass("link").addClass("normal");
    });
    $("#qiche-form").submit(function () {
        var target = $("#qiche-tab>span.normal");
        var form = $("#qiche-form");

        var traceCategory = "www.autohome.com.cn";
        var keyword = $("#qiche-input").val();

        switch (target.attr("id")) {
            case "qiche-web":
                traceClick(traceCategory, "ZhongHe", keyword);
                form.attr("action", "http://sou.autohome.com.cn/zonghe");
                $(document).attr("charset", "gb2312");
                break;
            case "qiche-luntan":
                traceClick(traceCategory, "LunTan", keyword);
                form.attr("action", "http://sou.autohome.com.cn/luntan");
                $(document).attr("charset", "gb2312");
                break;
            case "qiche-wenzhang":
                traceClick(traceCategory, "WenZhang", keyword);
                form.attr("action", "http://sou.autohome.com.cn/wenzhang");
                $(document).attr("charset", "gb2312");
                break;
            case "qiche-video":
                traceClick(traceCategory, "Video", keyword);
                form.attr("action", "http://sou.autohome.com.cn/shipin");
                $(document).attr("charset", "gb2312");
                break;
            case "qiche-hangqing":
                traceClick(traceCategory, "HangQing", keyword);
                form.attr("action", "http://sou.autohome.com.cn/hangqing");
                $(document).attr("charset", "gb2312");
                break;
        }

        window.setTimeout(backToUtf8, 500);
        return true;
    });

    //Dou
    $("#dou-tab>span").click(function () {
        $("#dou-tab>span.normal").removeClass("normal").addClass("link");
        $(this).removeClass("link").addClass("normal");
    });
    $("#dou-form").submit(function () {
        var target = $("#dou-tab>span.normal");
        var form = $("#dou-form");
        var input = $("#dou-input");
        var category = $("#dou-cat");

        var traceCategory = "www.douban.com";
        var keyword = input.val();

        switch (target.attr("id")) {
            case "dou-web":
                form.attr("action", "http://www.douban.com/search");
                input.attr("name", "q");
                category.val('');
                traceClick(traceCategory, "Web", keyword);
                break;
            case "dou-dushu":
                form.attr("action", "http://book.douban.com/subject_search");
                input.attr("name", "search_text");
                category.val('1001');
                traceClick(traceCategory, "DuShu", keyword);
                break;
            case "dou-music":
                form.attr("action", "http://music.douban.com/subject_search");
                input.attr("name", "search_text");
                category.val('1003');
                traceClick(traceCategory, "Music", keyword);
                break;
            case "dou-group":
                form.attr("action", "http://www.douban.com/group/search");
                input.attr("name", "q");
                category.val('1019');
                traceClick(traceCategory, "XiaoZu", keyword);
                break;
            case "dou-local":
                form.attr("action", "http://www.douban.com/event/search");
                input.attr("name", "search_text");
                category.val('');
                traceClick(traceCategory, "TongCheng", keyword);
                break;
        }

        return true;
    });

    //58
    $("#tc-form").submit(function () {
        var traceCategory = "www.58.com";
        var keyword = $("#tc-input").val();
        traceClick(traceCategory, "58TongCheng", keyword);
        return true;
    });
});

