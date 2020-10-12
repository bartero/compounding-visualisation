const width = 600;
const height = 500;
const multiplier = 2;
const stepsAvailable = 8;
const unitSquareWidth =
  Math.min(width, height) / Math.pow(multiplier, stepsAvailable / 2);

const backgroundColor = "#F2F7F2";
const strokeColor = "#232623";
const fillColor = "#AAD3BF";

let slider;

function setup() {
  noLoop();
  angleMode(RADIANS);
  createCanvas(width + 2, height + 2);

  slider = createSlider(1, stepsAvailable, 0, 0)
    .size(width - 30)
    .style("margin-top", "15px")
    .style("margin-left", "15px");
  slider.elt.addEventListener("input", () => {
    redraw();
  });
}

function draw() {
  background(backgroundColor);
  strokeWeight(1);

  const rotation = slider.value();
  drawRectangles(rotation);
  drawCaptions();
}

function drawCaptions() {
  textFont("Ubuntu Mono");
  textSize(20);
  fill(strokeColor);

  text(`The growth rate: ${multiplier}`, 20, 20);
  const yearsElapsed = Math.floor(slider.value() - 1);
  text(`Full years elapsed: ${yearsElapsed}`, 20, 45);
}

function drawRectangles(factor) {
  push();

  const rectanglesToDraw = [];
  let rectWidth = unitSquareWidth;
  let rectHeight = unitSquareWidth;
  let enlargeWidth = false;
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
      rectWidth *= 1 + step * (multiplier - 1);
    } else {
      rectHeight *= 1 + step * (multiplier - 1);
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
      ? (topWidth - underTopWidth) / ((multiplier - 1) * underTopWidth)
      : (topHeight - underTopHeight) / ((multiplier - 1) * underTopHeight);
    // (multiplier - 1) - (multiplier * underTopWidth - topWidth) /  topWidth  :
    // (multiplier - 1) - (multiplier * underTopHeight - topHeight) / topHeight
    console.log({
      topWidth,
      topHeight,
      underTopWidth,
      underTopHeight,
      fadeStrength,
    });
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
  // actually draw the rectangles, starting from the last one backwards
  for (; rectNo >= 0; rectNo -= 1) {
    const { width, height } = rectanglesToDraw[rectNo];

    rect(
      0,
      // Math.floor(-1 * width / 2),
      0, // Math.floor(-1 * height / 2),
      width,
      height
    );
  }

  pop();
}
