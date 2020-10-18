const { offsetWidth: width, offsetHeight: height } = document.getElementById(
  "game-main"
);
console.log(width, height)

// const width = window.innerWidth;
// const height = window.innerHeight;
const growthRate = 2;
const yearsToCompute = 10;
const unitSquareWidth =
  Math.min(width, height) / Math.pow(growthRate, yearsToCompute / 2);

const backgroundColor = "#F2F7F2";
const strokeColor = "#232623";
const fillColor = "#AAD3BF";

const controlsMargin = 20;

let slider;
let growthRateInput;

function setup() {
  noLoop();
  angleMode(RADIANS);

  createCanvas(width + 2, height + 2).parent("game-main");
  slider = createSlider(1, yearsToCompute, 0, 0)
    .parent("game-controls")
    // .size(width - 30)
    // .style("margin-top", `${controlsMargin}px`)
    // .style("margin-left", `${controlsMargin}px`)
    .input(() => {
      redraw();
    });
  // console.log(slider);

  // input = createInput('Enter the growth rate')

  let canvas = document.getElementsByTagName("canvas")[0];
  window.canvas = canvas;
}

// function getInputValues() {
//   const inputValues = {};

//   const inputElements = document
//     .getElementById("game-div")
//     .getElementsByTagName("input");

//   for (const { name, value } of inputElements) {
//     inputValues[name] = value;
//   }

//   return inputValues;
// }

function draw() {
  background(backgroundColor);
  strokeWeight(1);

  const rotation = slider.value();
  drawRectangles(rotation);
  // drawArrow();
  // drawCaptions();
}

function drawArrow() {
  push();

  console.log(slider.height);
  console.log(slider);

  fill(strokeColor);
  textFont("Ubuntu Mono");
  textStyle(BOLD);
  textSize(14);
  const x = slider.width / (yearsToCompute - 1);
  line(
    controlsMargin + x,
    controlsMargin - 0.1 * slider.height,
    controlsMargin + x,
    controlsMargin + 5.2 * slider.height
  );
  text(
    "1 year",
    controlsMargin + x - 10,
    controlsMargin + 1.2 * slider.height + 14
  );

  pop();
}

function drawCaptions() {
  textFont("Ubuntu Mono");
  textSize(20);
  fill(strokeColor);

  text(`The growth rate: ${growthRate}`, 20, 20);
  const yearsElapsed = Math.floor(slider.value() - 1);
  text(`Full years elapsed: ${yearsElapsed}`, 20, 45);
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
