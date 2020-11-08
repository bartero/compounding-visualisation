const backgroundColor = "#F2F7F2";
const strokeColor = "#232623";
const fillColor = "#AAD3BF";
const controlsMargin = 20;
const growthRate = 2;
const yearsToCompute = 10;

let width, height;
let slider;
let growthRateInput;
let unitSquareWidth;

function canvasSizeChanged() {
  unitSquareWidth =
    Math.min(width, height) / Math.pow(growthRate, yearsToCompute / 2);
}

function windowSizeChanged() {
  ({ offsetWidth: width, offsetHeight: height } = document.getElementById(
    "game-canvas"
  ));
  canvasSizeChanged();
}

function windowResized() {
  windowSizeChanged();
  resizeCanvas(width + 2, height + 2);
}

function setup() {
  noLoop()
  angleMode(RADIANS);
  windowSizeChanged();

  createCanvas(width + 2, height + 2).parent("game-canvas");
  slider = createSlider(1, yearsToCompute, 0, 0)
    .parent("game-controls")
    .input(() => {
      redraw();
    });

  let canvas = document.getElementsByTagName("canvas")[0];
  window.canvas = canvas;
}

let lastDrawTime = null;
let lastSecondTime = null;
let redrawsSinceLastSecond;

function shouldDraw(time) {
  if (!lastDrawTime) {
    return true;
  }

  if (time - lastDrawTime > 16) {
    return true;
  }

  return false;
}

function draw() {
  const nowTime = Date.now();

  if (!shouldDraw(nowTime)) {
    return;
  }

  lastDrawTime = nowTime;
  if (!lastSecondTime) {
    lastSecondTime = Date.now();
    redrawsSinceLastSecond = 1;
  } else {
    redrawsSinceLastSecond += 1;
    if (nowTime - lastSecondTime >= 1000) {
      console.log(`redraws in the last second: ${redrawsSinceLastSecond}`);

      lastSecondTime = null;
    }
  }

  background(backgroundColor);

  const rotation = slider.value();
  drawRectangles(rotation);
  drawCaptions();
}

function drawCaptions() {
  textFont("Ubuntu Mono");
  textSize(20);
  fill(strokeColor);

  text(`The growth rate: ${growthRate}`, 20, 70);
  const periodElapsed = Math.floor((slider.value() - 1) * 10) / 10;

  // const yearsElapsed = Math.floor();
  text(`Years elapsed: ${periodElapsed}`, 20, 100);
}

function drawRectangles(factor) {
  push();

  const rectanglesToDraw = [];
  let rectWidth = unitSquareWidth;
  let rectHeight = unitSquareWidth;
  let enlargeWidth = true;
  let f = 1;
  rectanglesToDraw.push({
    width: rectWidth,
    height: rectHeight,
  });

  while (f < factor) {
    const step = Math.min(1, factor - f);
    enlargeWidth = !enlargeWidth;

    f += step;
    if (enlargeWidth) {
      rectWidth *= 1 + step * (growthRate - 1);
    } else {
      rectHeight *= 1 + step * (growthRate - 1);
    }

    rectanglesToDraw.push({
      width: rectWidth,
      height: rectHeight,
      enlargeWidth,
    });
  }

  let rectNo;

  const {
    width: topWidth,
    height: topHeight,
    enlargeWidth: topEnlargeWidth,
  } = rectanglesToDraw[rectanglesToDraw.length - 1];
  translate(width / 2, height / 2);
  rotate(factor * 2 * PI);
  translate(-topWidth / 2, -topHeight / 2);
  if (rectanglesToDraw.length > 1) {
    const { width: underTopWidth, height: underTopHeight } = rectanglesToDraw[
      rectanglesToDraw.length - 2
    ];
    const fadeStrength = topEnlargeWidth
      ? (topWidth - underTopWidth) / ((growthRate - 1) * underTopWidth)
      : (topHeight - underTopHeight) / ((growthRate - 1) * underTopHeight);
    const fadedStrokeColor = color(strokeColor);
    const fadedFillColor = color(fillColor);
    fadedStrokeColor.setAlpha(fadeStrength * 255);
    fadedFillColor.setAlpha(fadeStrength * 255);
    stroke(fadedStrokeColor);
    fill(fadedFillColor);
    rect(0, 0, topWidth, topHeight);

    rectNo = rectanglesToDraw.length - 2;
  } else {
    rectNo = rectanglesToDraw.length - 1;
  }

  stroke(strokeColor);
  fill(fillColor);
  // Now actually draw the rectangles, starting from the end backwards
  for (; rectNo >= 0; rectNo -= 1) {
    const { width, height } = rectanglesToDraw[rectNo];
    rect(0, 0, width, height);
  }

  pop();
}
