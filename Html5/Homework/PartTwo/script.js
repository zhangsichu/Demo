//Tool function.
Function.prototype.CreateDelegate = function (instance, method) { return function () { return method.apply(instance, arguments); } }

function $(id) { return document.getElementById(id); }

window.addEventListener("load", function () {
    var colorfulClock = new ColorfulClock(
               document.getElementById("colorfulClock"), 600, 250,
               100, 105, 290, 105, 480, 105,
               "#e25f19", 5, "#000",
               "#306ace", 5, "#000",
               "#71a616", 5, "#000",
               80, 60, "#fff", "bolder", "60px", "sans-serif");
    colorfulClock.run();

    var mineSweeper = function() {
        var canvas = $('mineSweeper');
        var cellSize = 20;
        var cellStyle = {
            CellBorderLineWidth: 1,
            CellBorderStyle: "rgba(100,100,100,0.85)",

            IncorrectLineStyle: "rgba(255,0,0,0.7)",
            IncorrectLineWidth: 3,

            EmptyFillStyle: "rgba(188,198,233,1)",
            EmptyShadowStyle: "rgba(255,255,255,1)",

            FlagImage: $("flag"),
            AskImage: $("ask"),
            MineImage: $("mine"),
            ExplodedMineImage: $("explodedMine"),
            NormalImage: $("normal"),
            HighlightImage: $("highlight"),

            ImageOne: $("one"),
            ImageTwo: $("two"),
            ImageThree: $("three"),
            ImageFour: $("four"),
            ImageFive: $("five"),
            ImageSix: $("six"),
            ImageSeven: $("seven"),
            ImageEight: $("eight")
        };
        var mineWidth = 30;
        var mineHeight = 15;
        var mine = 99;

        var mineInfo = new MineInfo(mineWidth, mineHeight, mine);
        var infoProcess = new InfoProcess(mineInfo);
        var mineArea = new MineArea(canvas, cellSize, cellStyle);

        var gameStatus = new GameStatus(false, false, 0);
        var currentGame = new Game(new GameInfo(mineInfo, gameStatus), infoProcess, mineArea);

        var maxSize = 10;
        var storageAreaStyle = {
            StorageCellSize: 5,
            StorageCellBorderLineWidth: 1,
            StorageCellBorderStyle: "rgba(100,100,100,0.85)",

            SavedCellStyle: "#9D9D9D",
            SavedCellFlagStyle: "#952C28",
            SavedCellAskStyle: "#060606",
            SavedCellEmptyStyle: "#C0C0C0",
            SavedCellMineYesStyle: "#7E7E7E",
            SavedCellMineNoStyle: "#5B1918",
            SavedCellMineExplodedStyle: "#E51F1F",
            SavedCellIncorrectFlagStyle: "#CA25E2",

            SavedCellOneStyle: "#0306C7",
            SavedCellTwoStyle: "#0E780C",
            SavedCellThreeStyle: "#E6070A",
            SavedCellFourStyle: "#00035E",
            SavedCellFiveStyle: "#740D11",
            SavedCellSixStyle: "#287378",
            SavedCellSevenStyle: "#000000",
            SavedCellEightStyle: "#7E7E7E"
        };
        var currentGameStorage = new GameStorage(maxSize, storageAreaStyle);

        window.CurrentGame = currentGame;
        window.CurrentGameStorage = currentGameStorage;
        window.CurrentFace = 0;

        currentGame.GenerateUI();
        currentGame.StartGame();
    }
    mineSweeper();
}, false);
