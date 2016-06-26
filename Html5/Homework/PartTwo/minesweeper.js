//CellInfo
//M:mine S:status N:number
//M false-none true-mine 
//S 0-normal 1-flag 2-ask 3-open 4-mine_no_flag 5-mine_flaged 6-mine_exploded 7-no_mine_but_flaged
//N 0-close >0-show mine number
function CellInfo(m, s, n) {
    this.M = m;
    this.S = s;
    this.N = n;
}
CellInfo.prototype.Clone = function () {
    return new CellInfo(this.M, this.S, this.N);
}

//MineInfo
function MineInfo(x, y, mine, isData) {
    this.X = x;
    this.Y = y;
    this.Mine = mine;
    this.Data = null;
    if (isData != null && isData == false) return;
    this.BuildData();
    this.GenerateMine();
}
MineInfo.prototype.BuildData = function () {
    this.Data = new Array();
    for (var x = 0; x < this.X; x++) {
        this.Data[x] = new Array();
        for (var y = 0; y < this.Y; y++) {
            this.Data[x][y] = new CellInfo(false, 0, 0);
        }
    }
}
MineInfo.prototype.CleanMine = function () {
    if (this.Data == null) return;
    for (var x = 0; x < this.X; x++)
        for (var y = 0; y < this.Y; y++)
            this.Data[x][y].M = false;
}
MineInfo.prototype.GenerateMine = function () {
    if (this.Data == null) return;
    if (this.Mine > this.X * this.Y) return;
    var mine = 0;
    while (mine < this.Mine) {
        var x = parseInt(Math.random() * 10000) % this.X;
        var y = parseInt(Math.random() * 10000) % this.Y;
        if (!this.Data[x][y].M) {
            this.Data[x][y].M = true;
            mine++;
        }
    }
}
MineInfo.prototype.Clone = function () {
    var mineInfo = new MineInfo(this.X, this.Y, this.Mine, false);
    mineInfo.Data = new Array();
    for (var x = 0; x < this.X; x++) {
        mineInfo.Data[x] = new Array();
        for (var y = 0; y < this.Y; y++) {
            mineInfo.Data[x][y] = this.Data[x][y].Clone();
        }
    }
    return mineInfo;
}

//InfoProcess
function InfoProcess(mineInfo, winHandler, loseHandler, cellChangeHandler, cellShakeDownHandler, cellShakeUpHandler, mineChangeHandler, context) {
    this.MineInfo = mineInfo;
    this.CurrentMine = mineInfo.Mine;
    this.WinHandler = winHandler;
    this.LoseHandler = loseHandler;
    this.CellChangeHandler = cellChangeHandler;
    this.CellShakeDownHandler = cellShakeDownHandler;
    this.CellShakeUpHandler = cellShakeUpHandler;
    this.MineChangeHandler = mineChangeHandler;
    this.Context = context;
}
InfoProcess.prototype.HandlerIsValidated = function (handler) {
    return !(handler == null || typeof (handler) != "function");
}
InfoProcess.prototype.CellIsValidated = function (x, y) {
    return !(x < 0 || x >= this.MineInfo.X || y < 0 || y >= this.MineInfo.Y);
}
InfoProcess.prototype.OnCellChange = function (x, y) {
    if (this.HandlerIsValidated(this.CellChangeHandler))
        this.CellChangeHandler(this.MineInfo, x, y, this.Context);
}
InfoProcess.prototype.OnCellShakeDown = function (list) {
    if (this.HandlerIsValidated(this.CellShakeDownHandler))
        this.CellShakeDownHandler(this.MineInfo, list, this.Context);
}
InfoProcess.prototype.OnCellShakeUp = function (list) {
    if (this.HandlerIsValidated(this.CellShakeUpHandler))
        this.CellShakeUpHandler(this.MineInfo, list, this.Context);
}
InfoProcess.prototype.OnLose = function (x, y) {
    if (this.HandlerIsValidated(this.LoseHandler))
        this.LoseHandler(this.MineInfo, x, y, this.Context);
}
InfoProcess.prototype.OnMineChange = function (x, y) {
    if (this.HandlerIsValidated(this.MineChangeHandler))
        this.MineChangeHandler(this.CurrentMine, x, y, this.Context);
}
InfoProcess.prototype.OnWin = function (x, y) {
    if (this.HandlerIsValidated(this.WinHandler))
        this.WinHandler(this.MineInfo, x, y, this.Context);
}
InfoProcess.prototype.GetMineNumber = function (x, y) {
    var result = 0;
    if (this.CellIsValidated(x - 1, y - 1) && this.MineInfo.Data[x - 1][y - 1].M)
        result++;
    if (this.CellIsValidated(x - 1, y) && this.MineInfo.Data[x - 1][y].M)
        result++;
    if (this.CellIsValidated(x - 1, y + 1) && this.MineInfo.Data[x - 1][y + 1].M)
        result++;
    if (this.CellIsValidated(x, y - 1) && this.MineInfo.Data[x][y - 1].M)
        result++;
    if (this.CellIsValidated(x, y + 1) && this.MineInfo.Data[x][y + 1].M)
        result++;
    if (this.CellIsValidated(x + 1, y - 1) && this.MineInfo.Data[x + 1][y - 1].M)
        result++;
    if (this.CellIsValidated(x + 1, y) && this.MineInfo.Data[x + 1][y].M)
        result++;
    if (this.CellIsValidated(x + 1, y + 1) && this.MineInfo.Data[x + 1][y + 1].M)
        result++;
    return result;
}
InfoProcess.prototype.SerachMine = function (x, y) {
    if (!this.CellIsValidated(x, y))
        return;
    if (this.MineInfo.Data[x][y].S != 0)
        return;
    if (!this.MineInfo.Data[x][y].M) {
        var mineNumber = this.GetMineNumber(x, y);
        if (mineNumber == 0) {
            this.MineInfo.Data[x][y].S = 3;
            this.OnCellChange(x, y);
            this.SerachMine(x - 1, y - 1);
            this.SerachMine(x - 1, y);
            this.SerachMine(x - 1, y + 1);
            this.SerachMine(x, y - 1);
            this.SerachMine(x, y + 1);
            this.SerachMine(x + 1, y - 1);
            this.SerachMine(x + 1, y);
            this.SerachMine(x + 1, y + 1);
        }
        else {
            this.MineInfo.Data[x][y].S = 3;
            this.MineInfo.Data[x][y].N = mineNumber;
            this.OnCellChange(x, y);
        }
    }
    else //mine, game over.
    {
        this.MineInfo.Data[x][y].S = 6;
        this.OnCellChange(x, y);
        this.SetLose(x, y);
    }
}
InfoProcess.prototype.SetLose = function (x, y) {
    for (var m = 0; m < this.MineInfo.X; m++)
        for (var n = 0; n < this.MineInfo.Y; n++)
            if (this.MineInfo.Data[m][n].M) {
                if (this.MineInfo.Data[m][n].S != 1 && this.MineInfo.Data[m][n].S != 6) {
                    this.MineInfo.Data[m][n].S = 4;
                    this.OnCellChange(m, n);
                }
                else if (this.MineInfo.Data[m][n].S == 1) {
                    this.MineInfo.Data[m][n].S = 5;
                    this.OnCellChange(m, n);
                }
            }
            else {
                if (this.MineInfo.Data[m][n].S == 1) {
                    this.MineInfo.Data[m][n].S = 7;
                    this.OnCellChange(m, n);
                }
            }
    this.OnLose(x, y);
}
InfoProcess.prototype.JudgeWin = function () {
    if (this.CurrentMine != 0)
        return false;
    for (var x = 0; x < this.MineInfo.X; x++)
        for (var y = 0; y < this.MineInfo.Y; y++)
            if (this.MineInfo.Data[x][y].M && this.MineInfo.Data[x][y].S != 1)
                return false;
    return true;
}
InfoProcess.prototype.MarkMine = function (x, y) {
    if (!this.CellIsValidated(x, y))
        return;
    var isWin = false;
    if (this.MineInfo.Data[x][y].S == 0) {
        this.MineInfo.Data[x][y].S = 1;
        this.CurrentMine--;
        this.OnMineChange(x, y);
        isWin = this.JudgeWin();
    }
    else if (this.MineInfo.Data[x][y].S == 1) {
        this.MineInfo.Data[x][y].S = 2;
        this.CurrentMine++;
        this.OnMineChange(x, y);
        isWin = this.JudgeWin();
    }
    else if (this.MineInfo.Data[x][y].S == 2) {
        this.MineInfo.Data[x][y].S = 0;
    }
    this.OnCellChange(x, y);
    if (isWin)
        this.OnWin(x, y);
}

InfoProcess.prototype.GetShakeInfo = function (x, y) {
    if (this.MineInfo.Data[x][y].S == 3 && this.MineInfo.Data[x][y].N == 0)
        return null;

    var list = new Array();
    if (this.CellIsValidated(x - 1, y - 1))
        list.push({ X: x - 1, Y: y - 1 });
    if (this.CellIsValidated(x - 1, y))
        list.push({ X: x - 1, Y: y });
    if (this.CellIsValidated(x - 1, y + 1))
        list.push({ X: x - 1, Y: y + 1 });
    if (this.CellIsValidated(x, y - 1))
        list.push({ X: x, Y: y - 1 });
    if (this.CellIsValidated(x, y + 1))
        list.push({ X: x, Y: y + 1 });
    if (this.CellIsValidated(x + 1, y - 1))
        list.push({ X: x + 1, Y: y - 1 });
    if (this.CellIsValidated(x + 1, y))
        list.push({ X: x + 1, Y: y });
    if (this.CellIsValidated(x + 1, y + 1))
        list.push({ X: x + 1, Y: y + 1 });

    var count = 0;
    var result = new Array();

    for (var i = 0; i < list.length; i++) {
        var status = this.MineInfo.Data[list[i].X][list[i].Y].S;
        if (status == 1)
            count++;
        if (status == 0)
            result.push(list[i]);
    }

    result.Marked = count;
    return result;
}

InfoProcess.prototype.CheckCellHasShake = function (x, y) {
    var result = this.GetShakeInfo(x, y);
    if (result == null || result.length == 0)
        return;

    if (result.Marked != this.MineInfo.Data[x][y].N) {
        this.OnCellShakeDown(result)
    }
}
InfoProcess.prototype.TryShakeCell = function (x, y) {
    var result = this.GetShakeInfo(x, y);
    if (result == null || result.length == 0)
        return;

    if (result.Marked != this.MineInfo.Data[x][y].N) {
        this.OnCellShakeUp(result)
    }
    else {
        for (var i = 0; i < result.length; i++) {
            if (this.MineInfo.Data[result[i].X][result[i].Y].S == 0) {
                this.SerachMine(result[i].X, result[i].Y);
            }
        }
    }
}
InfoProcess.prototype.ResumeCell = function () {
    for (var x = 0; x < this.MineInfo.X; x++)
        for (var y = 0; y < this.MineInfo.Y; y++)
            this.OnCellChange(x, y);
}

//GameStatus
function GameStatus(isStart, isPause, costTime) {
    this.IsStart = isStart;
    this.IsPause = isPause;
    this.CostTime = costTime;
}
GameStatus.prototype.Clone = function () {
    return new GameStatus(this.IsStart, this.IsPause, this.CostTime);
}

//GameInfo
function GameInfo(mineInfo, gameStatus) {
    this.MineInfo = mineInfo;
    this.GameStatus = gameStatus;
}
GameInfo.prototype.Clone = function () {
    return new GameInfo(this.MineInfo.Clone(), this.GameStatus.Clone());
}

function MineArea(canvas, cellSize, cellStyle, cellDoubleDownHandler, cellDoubleUpHandler, cellLeftDownHandler, cellLeftUpHandler, cellRightDownHandler, cellRightUpHandler, beforeActiveCellChangeHandler, afterActiveCellChangeHandler, mineAreaMouseOutHandler) {
    this.Canvas = canvas;
    this.CellSize = cellSize;
    this.CellStyle = cellStyle;

    this.CellDoubleDownHandler = cellDoubleDownHandler;
    this.CellDoubleUpHandler = cellDoubleUpHandler;
    this.CellLeftDownHandler = cellLeftDownHandler;
    this.CellLeftUpHandler = cellLeftUpHandler;
    this.CellRightDownHandler = cellRightDownHandler;
    this.CellRightUpHandler = cellRightUpHandler;
    this.BeforeActiveCellChangeHandler = beforeActiveCellChangeHandler;
    this.AfterActiveCellChangeHandler = afterActiveCellChangeHandler;
    this.MineAreaMouseOutHandler = mineAreaMouseOutHandler;

    this.Canvas.addEventListener('mousemove', Function.CreateDelegate(this, this.MouseMove), false);
    this.Canvas.addEventListener('mousedown', Function.CreateDelegate(this, this.MouseDown), false);
    this.Canvas.addEventListener('mouseup', Function.CreateDelegate(this, this.MouseUp), false);
    this.Canvas.addEventListener('mouseout', Function.CreateDelegate(this, this.MouseOut), false);

    this.LastActiveCell = null;
    this.InnerRender = new CellRender(this.Canvas.getContext('2d'), this.CellSize, this.CellStyle);
    this.ClickCount = 0;
}

MineArea.prototype.Render = function (mineWidth, mineHeight) {
    this.Canvas.width = mineWidth * this.CellSize;
    this.Canvas.height = mineHeight * this.CellSize;

    for (var i = 0; i < mineHeight; i++) {
        for (var j = 0; j < mineWidth; j++) {
            this.InnerRender.RenderNormal(j, i);
        }
    }
}

MineArea.prototype.GetMineAreaCellRender = function () {
    return this.InnerRender;
}
MineArea.prototype.ResetCellSizeTo = function (cellSize) {
    this.CellSize = cellSize;
    this.InnerRender.CellSize = cellSize;
}
MineArea.prototype.HandlerIsValidated = function (handler) {
    return !(handler == null || typeof (handler) != "function");
}

MineArea.prototype.OnCellDoubleDown = function (lastActiveCell) {
    if (this.HandlerIsValidated(this.CellDoubleDownHandler))
        this.CellDoubleDownHandler(lastActiveCell);
}

MineArea.prototype.OnCellDoubleUp = function (lastActiveCell) {
    if (this.HandlerIsValidated(this.CellDoubleUpHandler))
        this.CellDoubleUpHandler(lastActiveCell);
}

MineArea.prototype.OnCellLeftDown = function (lastActiveCell) {
    if (this.HandlerIsValidated(this.CellLeftDownHandler))
        this.CellLeftDownHandler(lastActiveCell);
}

MineArea.prototype.OnCellLeftUp = function (lastActiveCell) {
    if (this.HandlerIsValidated(this.CellLeftUpHandler))
        this.CellLeftUpHandler(lastActiveCell);
}

MineArea.prototype.OnCellRightDown = function (lastActiveCell) {
    if (this.HandlerIsValidated(this.CellRightDownHandler))
        this.CellRightDownHandler(lastActiveCell);
}

MineArea.prototype.OnCellRightUp = function (lastActiveCell) {
    if (this.HandlerIsValidated(this.CellRightUpHandler))
        this.CellRightUpHandler(lastActiveCell);
}

MineArea.prototype.OnCellRightUp = function (lastActiveCell) {
    if (this.HandlerIsValidated(this.CellRightUpHandler))
        this.CellRightUpHandler(lastActiveCell);
}

MineArea.prototype.OnCellRightUp = function (lastActiveCell) {
    if (this.HandlerIsValidated(this.CellRightUpHandler))
        this.CellRightUpHandler(lastActiveCell);
}

MineArea.prototype.OnBeforeActiveCellChange = function (lastActiveCell) {
    if (this.HandlerIsValidated(this.BeforeActiveCellChangeHandler))
        this.BeforeActiveCellChangeHandler(lastActiveCell);
}

MineArea.prototype.OnAfterActiveCellChange = function (lastActiveCell) {
    if (this.HandlerIsValidated(this.AfterActiveCellChangeHandler))
        this.AfterActiveCellChangeHandler(lastActiveCell);
}

MineArea.prototype.OnMineAreaMouseOut = function (lastActiveCell) {
    if (this.HandlerIsValidated(this.MineAreaMouseOutHandler))
        this.MineAreaMouseOutHandler(lastActiveCell);
}

MineArea.prototype.MouseMove = function (e) {
    var x, y;
    if (e.pageX || e.pageX == 0) {
        x = e.pageX - this.Canvas.offsetLeft;
        y = e.pageY - this.Canvas.offsetTop;
    }
    else if (e.offsetX || e.offsetX == 0) {
        x = e.offsetX;
        y = e.offsetY;
    }
    var indexX = x / this.CellSize;
    var indexY = y / this.CellSize;

    indexX = Math.floor(indexX);
    indexY = Math.floor(indexY);

    if (this.LastActiveCell == null ||
                this.LastActiveCell.X != indexX || this.LastActiveCell.Y != indexY) {
        this.ClickCount = 0;

        if (this.LastActiveCell != null)
            this.OnBeforeActiveCellChange(this.LastActiveCell);

        this.LastActiveCell = { X: indexX, Y: indexY };

        this.OnAfterActiveCellChange(this.LastActiveCell);
    }
}

MineArea.prototype.MouseDown = function (e) {
    e.preventDefault();
    this.ClickCount++;
    if (this.ClickCount == 2) { // two button click
        this.OnCellDoubleDown(this.LastActiveCell);
    }
    else if (this.ClickCount == 1) { // one button click
        if (e == null) e = window.event;
        if (e.button != 2)
            this.OnCellLeftDown(this.LastActiveCell); // left button
        else
            this.OnCellRightDown(this.LastActiveCell); // right button
    }
}

MineArea.prototype.MouseUp = function (e) {
    e.preventDefault();
    if (this.ClickCount == 2) { // two button click
        this.ClickCount = 0;
        this.OnCellDoubleUp(this.LastActiveCell);
    }
    else if (this.ClickCount == 1) { // one button click
        this.ClickCount = 0;
        if (e == null) e = window.event;
        if (e.button != 2)
            this.OnCellLeftUp(this.LastActiveCell); // left button
        else
            this.OnCellRightUp(this.LastActiveCell); // right button
    }
    this.ClickCount = 0;
}
MineArea.prototype.MouseOut = function (e) {
    if (this.LastActiveCell != null)
        this.OnMineAreaMouseOut(this.LastActiveCell);
    this.LastActiveCell = null;
}

//CellRender
function CellRender(context, cellSize, cellStyle) {
    this.Context = context;
    this.CellSize = cellSize;
    this.CellStyle = cellStyle;
}

CellRender.prototype.RenderCellBorder = function (x, y) {
    this.Context.lineWidth = this.CellStyle.CellBorderLineWidth;
    this.Context.strokeStyle = this.CellStyle.CellBorderStyle;
    this.Context.strokeRect(x * this.CellSize, y * this.CellSize, this.CellSize, this.CellSize);
}

CellRender.prototype.RenderCellImage = function (image, x, y) {
    this.Context.drawImage(image, x * this.CellSize, y * this.CellSize, this.CellSize, this.CellSize);
    this.RenderCellBorder(x, y);
}

CellRender.prototype.RenderIncorrect = function (x, y) {
    this.Context.strokeStyle = this.CellStyle.IncorrectLineStyle;
    this.Context.lineWidth = this.CellStyle.IncorrectLineWidth;

    this.Context.beginPath();
    this.Context.moveTo(x * this.CellSize, y * this.CellSize);
    this.Context.lineTo(x * this.CellSize + this.CellSize, y * this.CellSize + this.CellSize);
    this.Context.stroke();

    this.Context.beginPath();
    this.Context.moveTo(x * this.CellSize, y * this.CellSize + this.CellSize);
    this.Context.lineTo(x * this.CellSize + this.CellSize, y * this.CellSize);
    this.Context.stroke();
}

CellRender.prototype.RenderNormal = function (x, y) {
    this.RenderCellImage(this.CellStyle.NormalImage, x, y);
}

CellRender.prototype.RenderEmpty = function (x, y) {
    this.Context.fillStyle = this.CellStyle.EmptyFillStyle;
    this.Context.fillRect(x * this.CellSize, y * this.CellSize, this.CellSize, this.CellSize);
    this.RenderCellBorder(x, y);
    this.Context.strokeStyle = this.CellStyle.EmptyShadowStyle;
    this.Context.lineWidth = this.CellStyle.CellBorderLineWidth;
    this.Context.strokeRect(x * this.CellSize + this.CellStyle.CellBorderLineWidth, y * this.CellSize + this.CellStyle.CellBorderLineWidth, this.CellSize - 2 * this.CellStyle.CellBorderLineWidth, this.CellSize - 2 * this.CellStyle.CellBorderLineWidth);
}

CellRender.prototype.RenderFlag = function (x, y) {
    this.RenderCellImage(this.CellStyle.FlagImage, x, y);
}

CellRender.prototype.RenderIncorrectFlag = function (x, y) {
    this.RenderFlag(x, y);
    this.RenderIncorrect(x, y);
}

CellRender.prototype.RenderAsk = function (x, y) {
    this.RenderCellImage(this.CellStyle.AskImage, x, y);
}

CellRender.prototype.RenderMine = function (x, y) {
    this.RenderCellImage(this.CellStyle.MineImage, x, y);
}

CellRender.prototype.RenderIncorrectMine = function (x, y) {
    this.RenderCellImage(this.CellStyle.MineImage, x, y);
    this.RenderIncorrect(x, y);
}

CellRender.prototype.RenderExplodedMine = function (x, y) {
    this.RenderCellImage(this.CellStyle.ExplodedMineImage, x, y);
}

CellRender.prototype.RenderHighlight = function (x, y) {
    this.RenderCellImage(this.CellStyle.HighlightImage, x, y);
}

CellRender.prototype.RenderOne = function (x, y) {
    this.RenderCellImage(this.CellStyle.ImageOne, x, y);
}

CellRender.prototype.RenderTwo = function (x, y) {
    this.RenderCellImage(this.CellStyle.ImageTwo, x, y);
}

CellRender.prototype.RenderThree = function (x, y) {
    this.RenderCellImage(this.CellStyle.ImageThree, x, y);
}

CellRender.prototype.RenderFour = function (x, y) {
    this.RenderCellImage(this.CellStyle.ImageFour, x, y);
}

CellRender.prototype.RenderFive = function (x, y) {
    this.RenderCellImage(this.CellStyle.ImageFive, x, y);
}

CellRender.prototype.RenderSix = function (x, y) {
    this.RenderCellImage(this.CellStyle.ImageSix, x, y);
}

CellRender.prototype.RenderSeven = function (x, y) {
    this.RenderCellImage(this.CellStyle.ImageSeven, x, y);
}

CellRender.prototype.RenderEight = function (x, y) {
    this.RenderCellImage(this.CellStyle.ImageEight, x, y);
}

function Game(gameInfo, infoProcess, mineArea, gameTimeLapseHandler, startGameHandler, stopGameHandler, pauseGameHandler, resumeGameHandler, winHandler, loseHandler, mineChangeHandler, generateUIHandler) {
    this.GameInfo = gameInfo;
    this.InfoProcess = infoProcess;
    this.MineArea = mineArea;
    this.TimeLapseTicket = null;

    this.GameTimeLapseHandler = gameTimeLapseHandler;
    this.StartGameHandler = startGameHandler;
    this.StopGameHandler = stopGameHandler;
    this.PauseGameHandler = pauseGameHandler;
    this.ResumeGameHandler = resumeGameHandler;

    this.WinHandler = winHandler;
    this.LoseHandler = loseHandler;
    this.MineChangeHandler = mineChangeHandler;
    this.GenerateUIHandler = generateUIHandler;

    //================================
    //InfoProcess: winHandler, loseHandler, cellChangeHandler, cellShakeDownHandler, cellShakeUpHandler, mineChangeHandler;
    //================================
    this.InfoProcess.WinHandler = Function.prototype.CreateDelegate(this, function (mineInfo, x, y, context) {
        this.StopGame();
        this.OnWin(mineInfo, this.GameInfo.GameStatus.CostTime, x, y, context);
    });

    this.InfoProcess.LoseHandler = Function.prototype.CreateDelegate(this, function (mineInfo, x, y, context) {
        this.StopGame();
        this.OnLose(mineInfo, this.GameInfo.GameStatus.CostTime, x, y, context);
    });

    this.InfoProcess.CellChangeHandler = Function.prototype.CreateDelegate(this, function (mineInfo, x, y, context) {
        this.RenderOneCellByMineInfo(mineInfo, x, y, this.MineArea.GetMineAreaCellRender());
    });

    this.InfoProcess.CellShakeDownHandler = Function.prototype.CreateDelegate(this, function (mineInfo, list, context) {
        var cellRender = this.MineArea.GetMineAreaCellRender();
        for (var i = 0; i < list.length; i++) {
            cellRender.RenderEmpty(list[i].X, list[i].Y);
        }
    });

    this.InfoProcess.CellShakeUpHandler = Function.prototype.CreateDelegate(this, function (mineInfo, list, context) {
        var cellRender = this.MineArea.GetMineAreaCellRender();
        for (var i = 0; i < list.length; i++) {
            this.RenderOneCellByMineInfo(mineInfo, list[i].X, list[i].Y, this.MineArea.GetMineAreaCellRender());
        }
    });

    this.InfoProcess.MineChangeHandler = Function.prototype.CreateDelegate(this, function (currentMine, x, y, context) {
        this.OnMineChange(currentMine, x, y, context);
    });

    //================================
    //MineArea: cellDoubleDownHandler, cellDoubleUpHandler, cellLeftDownHandler, cellLeftUpHandler, cellRightDownHandler, cellRightUpHandler, beforeActiveCellChangeHandler, afterActiveCellChangeHandler;
    //================================
    this.MineArea.CellDoubleDownHandler = Function.prototype.CreateDelegate(this, function (lastActiveCell) {
        if (!this.GameIsAlive())
            return;

        this.InfoProcess.CheckCellHasShake(lastActiveCell.X, lastActiveCell.Y);
    });

    this.MineArea.CellDoubleUpHandler = Function.prototype.CreateDelegate(this, function (lastActiveCell) {
        if (!this.GameIsAlive())
            return;

        this.InfoProcess.TryShakeCell(lastActiveCell.X, lastActiveCell.Y);
    });

    this.MineArea.CellLeftDownHandler = Function.prototype.CreateDelegate(this, function (lastActiveCell) {
        if (!this.GameIsAlive())
            return;

        if (this.GameInfo.MineInfo.Data[lastActiveCell.X][lastActiveCell.Y].S != 0)
            return;

        this.MineArea.GetMineAreaCellRender().RenderEmpty(lastActiveCell.X, lastActiveCell.Y);
    });

    this.MineArea.CellLeftUpHandler = Function.prototype.CreateDelegate(this, function (lastActiveCell) {
        if (!this.GameIsAlive())
            return;

        this.InfoProcess.SerachMine(lastActiveCell.X, lastActiveCell.Y);
    });

    this.MineArea.CellRightDownHandler = Function.prototype.CreateDelegate(this, function (lastActiveCell) {
        if (!this.GameIsAlive())
            return;

        if (this.GameInfo.MineInfo.Data[lastActiveCell.X][lastActiveCell.Y].S != 0)
            return;

        this.MineArea.GetMineAreaCellRender().RenderEmpty(lastActiveCell.X, lastActiveCell.Y);
    });

    this.MineArea.CellRightUpHandler = Function.prototype.CreateDelegate(this, function (lastActiveCell) {
        if (!this.GameIsAlive())
            return;

        this.InfoProcess.MarkMine(lastActiveCell.X, lastActiveCell.Y);
    });

    this.MineArea.BeforeActiveCellChangeHandler = Function.prototype.CreateDelegate(this, function (lastActiveCell) {
        if (!this.GameIsAlive())
            return;

        if (lastActiveCell.X >= this.GameInfo.MineInfo.X || lastActiveCell.Y >= this.GameInfo.MineInfo.Y)
            return;

        if (this.GameInfo.MineInfo.Data[lastActiveCell.X][lastActiveCell.Y].S == 0) {
            this.MineArea.GetMineAreaCellRender().RenderNormal(lastActiveCell.X, lastActiveCell.Y);
        }
    });

    this.MineArea.AfterActiveCellChangeHandler = Function.prototype.CreateDelegate(this, function (lastActiveCell) {
        if (!this.GameIsAlive())
            return;

        if (lastActiveCell.X >= this.GameInfo.MineInfo.X || lastActiveCell.Y >= this.GameInfo.MineInfo.Y)
            return;

        if (this.GameInfo.MineInfo.Data[lastActiveCell.X][lastActiveCell.Y].S == 0) {
            this.MineArea.GetMineAreaCellRender().RenderHighlight(lastActiveCell.X, lastActiveCell.Y);
        }
    });

    this.MineArea.MineAreaMouseOutHandler = Function.prototype.CreateDelegate(this, function (lastActiveCell) {
        if (!this.GameIsAlive())
            return;

        if (lastActiveCell.X >= this.GameInfo.MineInfo.X || lastActiveCell.Y >= this.GameInfo.MineInfo.Y)
            return;

        if (this.GameInfo.MineInfo.Data[lastActiveCell.X][lastActiveCell.Y].S == 0) {
            this.MineArea.GetMineAreaCellRender().RenderNormal(lastActiveCell.X, lastActiveCell.Y);
        }
    });
    this.OnMineChange(this.InfoProcess.CurrentMine);
    this.OnTimeLapse(this.GameInfo.GameStatus.CostTime);
}

Game.prototype.RenderOneCellByMineInfo = function (mineInfo, x, y, cellRender) {
    if (mineInfo.Data[x][y].S == 0)
        cellRender.RenderNormal(x, y);
    else if (mineInfo.Data[x][y].S == 1)
        cellRender.RenderFlag(x, y);
    else if (mineInfo.Data[x][y].S == 2)
        cellRender.RenderAsk(x, y);
    else if (mineInfo.Data[x][y].S == 3)
        if (mineInfo.Data[x][y].N > 0)
            switch (mineInfo.Data[x][y].N) {
                case 1:
                    cellRender.RenderOne(x, y);
                    break;
                case 2:
                    cellRender.RenderTwo(x, y);
                    break;
                case 3:
                    cellRender.RenderThree(x, y);
                    break;
                case 4:
                    cellRender.RenderFour(x, y);
                    break;
                case 5:
                    cellRender.RenderFive(x, y);
                    break;
                case 6:
                    cellRender.RenderSix(x, y);
                    break;
                case 7:
                    cellRender.RenderSeven(x, y);
                    break;
                case 8:
                    cellRender.RenderEight(x, y);
                    break;
                default:
                    break;
            }
        else
            cellRender.RenderEmpty(x, y);
    else if (mineInfo.Data[x][y].S == 4)
        cellRender.RenderMine(x, y);
    else if (mineInfo.Data[x][y].S == 5)
        cellRender.RenderIncorrectMine(x, y);
    else if (mineInfo.Data[x][y].S == 6)
        cellRender.RenderExplodedMine(x, y);
    else if (mineInfo.Data[x][y].S == 7)
        cellRender.RenderIncorrectFlag(x, y);
}

Game.prototype.HandlerIsValidated = function (handler) {
    return !(handler == null || typeof (handler) != "function");
}

Game.prototype.GameIsAlive = function () {
    return this.GameInfo.GameStatus.IsStart && !this.GameInfo.GameStatus.IsPause;
}
Game.prototype.GenerateUI = function () {
    this.OnGenerateUI(this.GameInfo.MineInfo, this.MineArea);
    this.MineArea.Render(this.GameInfo.MineInfo.X, this.GameInfo.MineInfo.Y);
    window.document.oncontextmenu = function () { return false; };
    window.document.ondragstart = function () { return false; };
}
Game.prototype.StartGame = function () {
    this.GameInfo.GameStatus.IsPause = false;
    this.GameInfo.GameStatus.IsStart = true;
    this.TimeLapseTicket = window.setInterval(Function.CreateDelegate(this, this.InnerTimeLapseHandler), 1000);
    this.OnTimeLapse(this.GameInfo.GameStatus.CostTime);
    this.OnMineChange(this.InfoProcess.CurrentMine);
    this.OnStartGame();
}
Game.prototype.StopGame = function () {
    this.GameInfo.GameStatus.IsStart = false;
    if (this.TimeLapseTicket != null)
        window.clearInterval(this.TimeLapseTicket);
    this.OnStopGame();
}
Game.prototype.PauseGame = function () {
    this.GameInfo.GameStatus.IsPause = true;
    if (this.TimeLapseTicket != null)
        window.clearInterval(this.TimeLapseTicket);
    this.OnPauseGame();
}
Game.prototype.ResetGame = function () {
    this.StopGame();
    for (var y = 0; y < this.GameInfo.MineInfo.Y; y++)
        for (var x = 0; x < this.GameInfo.MineInfo.X; x++) {
            this.MineArea.GetMineAreaCellRender().RenderNormal(x, y);
            this.GameInfo.MineInfo.Data[x][y].S = 0;
            this.GameInfo.MineInfo.Data[x][y].N = 0;
        }
    this.GameInfo.GameStatus.CostTime = 0;
    this.InfoProcess.CurrentMine = this.GameInfo.MineInfo.Mine;
    this.StartGame();
}
Game.prototype.NewRound = function () {
    this.GameInfo.MineInfo.CleanMine();
    this.GameInfo.MineInfo.GenerateMine();
    this.ResetGame();
}
Game.prototype.NewGame = function (x, y, mine) {
    this.StopGame();
    var mineInfo = new MineInfo(x, y, mine);
    var gameStatus = new GameStatus(false, false, 0);
    this.GameInfo = new GameInfo(mineInfo, gameStatus);
    this.InfoProcess.MineInfo = mineInfo;
    this.InfoProcess.CurrentMine = mine;
    this.GenerateUI();
    this.StartGame();
}
Game.prototype.RandomGame = function () {
    var x = y = mine = 0;
    while (true) {
        x = parseInt(Math.random() * 10000) % 30;
        y = parseInt(Math.random() * 10000) % 30;
        mine = parseInt(Math.random() * 10000) % 30;
        if (x > 20 && y > 10 && y < 18 && mine > 10 && x * y > mine)
            break;
    }
    this.NewGame(x, y, mine);
}
Game.prototype.ResumeGame = function (storageInfo) {
    this.StopGame();
    this.GameInfo = storageInfo.GameInfo;
    this.InfoProcess.MineInfo = storageInfo.GameInfo.MineInfo;
    this.InfoProcess.CurrentMine = storageInfo.CurrentMine;
    this.GenerateUI();
    this.InfoProcess.ResumeCell();
    this.OnResumeGame(storageInfo);
    this.OnTimeLapse(storageInfo.GameInfo.GameStatus.CostTime);
    this.OnMineChange(storageInfo.CurrentMine);
    if (storageInfo.GameInfo.GameStatus.IsPause)
        this.PauseGame();
    else if (storageInfo.GameInfo.GameStatus.IsStart)
        this.StartGame();
}

Game.prototype.InnerTimeLapseHandler = function () {
    if (!this.GameInfo.GameStatus.IsStart || this.GameInfo.GameStatus.IsPause) return;
    this.GameInfo.GameStatus.CostTime++;
    this.OnTimeLapse(this.GameInfo.GameStatus.CostTime);
}

Game.prototype.OnTimeLapse = function (costTime) {
    if (this.HandlerIsValidated(this.GameTimeLapseHandler))
        this.GameTimeLapseHandler(costTime);
}
Game.prototype.OnStartGame = function () {
    if (this.HandlerIsValidated(this.StartGameHandler))
        this.StartGameHandler();
}
Game.prototype.OnStopGame = function () {
    if (this.HandlerIsValidated(this.StopGameHandler))
        this.StopGameHandler();
}
Game.prototype.OnPauseGame = function () {
    if (this.HandlerIsValidated(this.PauseGameHandler))
        this.PauseGameHandler();
}
Game.prototype.OnResumeGame = function (storageInfo) {
    if (this.HandlerIsValidated(this.ResumeGameHandler))
        this.ResumeGameHandler(storageInfo);
}
Game.prototype.OnWin = function (mineInfo, costTime, x, y, context) {
    if (this.HandlerIsValidated(this.WinHandler))
        this.WinHandler(mineInfo, costTime, x, y, context);
}
Game.prototype.OnLose = function (mineInfo, costTime, x, y, context) {
    if (this.HandlerIsValidated(this.LoseHandler))
        this.LoseHandler(mineInfo, costTime, x, y, context);
}
Game.prototype.OnMineChange = function (currentMine, x, y, context) {
    if (this.HandlerIsValidated(this.MineChangeHandler))
        this.MineChangeHandler(currentMine, x, y, context);
}
Game.prototype.OnGenerateUI = function (mineInfo, mineArea) {
    if (this.HandlerIsValidated(this.GenerateUIHandler))
        this.GenerateUIHandler(mineInfo, mineArea);
}

//StorageInfo
function StorageInfo(gameInfo, currentMine, currentFace) {
    this.GameInfo = gameInfo;
    this.CurrentMine = currentMine;
    this.CurrentFace = currentFace;
}
StorageInfo.prototype.Clone = function () {
    return new StorageInfo(this.GameInfo.Clone(), this.CurrentMine, this.CurrentFace);
}

//GameStorage
function GameStorage(maxSize, storageAreaStyle, storageAreaMouseOverHandler, storageAreaMouseOutHandler, storageAreaMouseUpHandler, maxHandler, saveHandler, deleteHandler) {
    this.MaxSize = maxSize;
    this.StorageAreaStyle = storageAreaStyle;

    this.StorageAreaMouseOverHandler = storageAreaMouseOverHandler;
    this.StorageAreaMouseOutHandler = storageAreaMouseOutHandler;
    this.StorageAreaMouseUpHandler = storageAreaMouseUpHandler;

    this.MaxHandler = maxHandler;
    this.SaveHandler = saveHandler;
    this.DeleteHandler = deleteHandler;

    this.List = new Array();
}
GameStorage.prototype.HandlerIsValidated = function (handler) {
    return !(handler == null || typeof (handler) != "function");
}
GameStorage.prototype.OnMax = function (index) {
    if (this.HandlerIsValidated(this.MaxHandler))
        this.MaxHandler(index);
}
GameStorage.prototype.OnSave = function (index, storageArea) {
    if (this.HandlerIsValidated(this.SaveHandler))
        this.SaveHandler(index, storageArea);
}
GameStorage.prototype.OnDelete = function (index) {
    if (this.HandlerIsValidated(this.DeleteHandler))
        this.DeleteHandler(index);
}
GameStorage.prototype.SaveGame = function (storageInfo) {
    if (this.List.length >= this.MaxSize) {
        this.OnMax(this.List.length);
    }
    else {
        this.List.push(storageInfo.Clone());
        var storageArea = this.CreateOneStorageArea(storageInfo, this.StorageAreaStyle);

        if (this.HandlerIsValidated(this.StorageAreaMouseOverHandler))
            storageArea.addEventListener('mouseover', this.StorageAreaMouseOverHandler, false);
        if (this.HandlerIsValidated(this.StorageAreaMouseOutHandler))
            storageArea.addEventListener('mouseout', this.StorageAreaMouseOutHandler, false);
        if (this.HandlerIsValidated(this.StorageAreaMouseUpHandler))
            storageArea.addEventListener('mouseup', this.StorageAreaMouseUpHandler, false);
        this.OnSave(this.List.Length - 1, storageArea);
    }
}
GameStorage.prototype.DeleteGame = function (index) {
    var storageInfo = this.List[index];
    this.List.splice(index, 1);
    this.OnDelete(index);
}
GameStorage.prototype.GetGame = function (index) {
    return this.List[index];
}

GameStorage.prototype.CreateOneStorageArea = function (storageInfo, storageAreaStyle) {
    var canvas = window.document.createElement("CANVAS");
    var storageCellSize = storageAreaStyle.StorageCellSize;

    canvas.width = storageInfo.GameInfo.MineInfo.X * storageCellSize
    canvas.height = storageInfo.GameInfo.MineInfo.Y * storageCellSize;

    var context = canvas.getContext('2d');
    context.lineWidth = storageAreaStyle.StorageCellBorderLineWidth;
    context.strokeStyle = storageAreaStyle.StorageCellBorderStyle;

    for (var i = 0; i < storageInfo.GameInfo.MineInfo.X; i++) {
        for (var j = 0; j < storageInfo.GameInfo.MineInfo.Y; j++) {
            var x = i * storageCellSize;
            var y = j * storageCellSize;
            switch (storageInfo.GameInfo.MineInfo.Data[i][j].S) {
                case 0:
                    context.fillStyle = storageAreaStyle.SavedCellStyle;
                    break;
                case 1:
                    context.fillStyle = storageAreaStyle.SavedCellFlagStyle;
                    break;
                case 2:
                    context.fillStyle = storageAreaStyle.SavedCellAskStyle;
                    break;
                case 3:
                    if (storageInfo.GameInfo.MineInfo.Data[i][j].N > 0) {
                        switch (storageInfo.GameInfo.MineInfo.Data[i][j].N) {
                            case 1:
                                context.fillStyle = storageAreaStyle.SavedCellOneStyle;
                                break;
                            case 2:
                                context.fillStyle = storageAreaStyle.SavedCellTwoStyle;
                                break;
                            case 3:
                                context.fillStyle = storageAreaStyle.SavedCellThreeStyle;
                                break;
                            case 4:
                                context.fillStyle = storageAreaStyle.SavedCellFourStyle;
                                break;
                            case 5:
                                context.fillStyle = storageAreaStyle.SavedCellFiveStyle;
                                break;
                            case 6:
                                context.fillStyle = storageAreaStyle.SavedCellSixStyle;
                                break;
                            case 7:
                                context.fillStyle = storageAreaStyle.SavedCellSevenStyle;
                                break;
                            case 8:
                                context.fillStyle = storageAreaStyle.SavedCellEightStyle;
                                break;
                            default:
                                context.fillStyle = storageAreaStyle.SavedCellStyle;
                                break;
                        }
                    }
                    else {
                        context.fillStyle = storageAreaStyle.SavedCellEmptyStyle;
                    }
                    break;
                case 4:
                    context.fillStyle = storageAreaStyle.SavedCellMineYesStyle;
                    break;
                case 5:
                    context.fillStyle = storageAreaStyle.SavedCellMineNoStyle;
                    break;
                case 6:
                    context.fillStyle = storageAreaStyle.SavedCellMineExplodedStyle;
                    break;
                case 7:
                    context.fillStyle = storageAreaStyle.SavedCellIncorrectFlagStyle;
                    break;
                default:
                    context.fillStyle = storageAreaStyle.SavedCellStyle;
                    break;
            }
            context.fillRect(x, y, storageCellSize, storageCellSize);
            context.strokeRect(x, y, storageCellSize, storageCellSize);
        }
    }
    return canvas;
}
