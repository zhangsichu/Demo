//Class ColorfulRing
function ColorfulRing(context, positionX, positionY, radius, radiusInner, threshold, fillColor, borderWidth, borderColor, textColor, textWeight, textSize, textFamily) {
    this.context = context;
    this.positionX = positionX;
    this.positionY = positionY;
    this.radius = radius;
    this.radiusInner = radiusInner;
    this.threshold = threshold;
    this.fillColor = fillColor;
    this.borderWidth = borderWidth;
    this.borderColor = borderColor;
    this.textColor = textColor;
    this.textWeight = textWeight;
    this.textSize = textSize;
    this.textFamily = textFamily;
    this.value = -1;
}

ColorfulRing.prototype.drawValue = function (value) {

    var angleStart = 1.5 * Math.PI;
    var angleEnd = value / this.threshold * 2 * Math.PI + 1.5 * Math.PI;
    var clearSafe = 10;

    this.context.save();
    this.context.clearRect(this.positionX - this.radius - clearSafe, this.positionY - this.radius - clearSafe, (this.radius + clearSafe) * 2, (this.radius + clearSafe) * 2);
    this.context.beginPath();
    this.context.arc(this.positionX, this.positionY, this.radius, angleStart, angleEnd, false);
    this.context.lineTo(this.positionX + Math.cos(angleEnd) * this.radiusInner, this.positionY + Math.sin(angleEnd) * this.radiusInner);
    this.context.arc(this.positionX, this.positionY, this.radiusInner, angleEnd, angleStart, true);
    this.context.lineTo(this.positionX + Math.cos(angleStart) * this.radius, this.positionY + Math.sin(angleStart) * this.radius);
    this.context.closePath();

    this.context.strokeStyle = this.borderColor;
    this.context.lineWidth = this.borderWidth;
    this.context.stroke();

    this.context.fillStyle = this.fillColor;
    this.context.fill();

    this.context.fillStyle = this.textColor;
    this.context.font = this.textWeight + " " + this.textSize + " " + this.textFamily;
    this.context.fillText(value < 10 ? "0" + value : value, this.positionX - parseInt(this.textSize) / 2 - parseInt(this.textSize) / 14, this.positionY + parseInt(this.textSize) / 3 + parseInt(this.textSize) / 14);
    this.context.restore();

    this.value = value;
}

//ColorfulClock
function ColorfulClock(canvas, width, height,
    hourX, hourY, minuteX, minuteY, secondX, secondY,
    hourfillColor, hourborderWidth, hourborderColor,
    minutefillColor, minuteborderWidth, minuteborderColor,
    secondfillColor, secondborderWidth, secondborderColor,
    radius, radiusInner, textColor, textWeight, textSize, textFamily) {
    this.canvas = canvas;
    this.context = canvas.getContext('2d');
    this.canvas.width = width;
    this.canvas.height = height;
    this.hour = new ColorfulRing(this.context, hourX, hourY, radius, radiusInner, 24, hourfillColor, hourborderWidth, hourborderColor, textColor, textWeight, textSize, textFamily);
    this.minute = new ColorfulRing(this.context, minuteX, minuteY, radius, radiusInner, 60, minutefillColor, minuteborderWidth, minuteborderColor, textColor, textWeight, textSize, textFamily);
    this.second = new ColorfulRing(this.context, secondX, secondY, radius, radiusInner, 60, secondfillColor, secondborderWidth, secondborderColor, textColor, textWeight, textSize, textFamily);
}

ColorfulClock.prototype.run = function () {
    var drawATick = function () {
        var now = new Date();
        var hour = now.getHours();
        var minute = now.getMinutes();
        var second = now.getSeconds();

        if (hour != this.hour.value)
            this.hour.drawValue(hour);

        if (minute != this.minute.value)
            this.minute.drawValue(minute);

        if (second != this.second.value)
            this.second.drawValue(second);
    }

    var delegate = Function.CreateDelegate(this, drawATick);

    delegate();

    window.setInterval(delegate, 1000);
}
