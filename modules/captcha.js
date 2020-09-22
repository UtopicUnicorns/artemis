const Canvas = require("canvas");

const randomText = () => Math.random().toString(36).replace(/[^a-z]|[rk]+/gi, "").substring(0, 6).toUpperCase(),
  shuffleArray = (arr) => {
    let i = arr.length,
      temp, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== i) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * i);
      i -= 1;
      // And swap it with the current element.
      temp = arr[i];
      arr[i] = arr[randomIndex];
      arr[randomIndex] = temp;
    }

    return arr;
  }

class Captcha2 {
  constructor() {

    // Initialize canvas
    this._canvas = Canvas.createCanvas(250, 75);
    let ctx = this._canvas.getContext('2d');

    // Set background color
    ctx.globalAlpha = 1;
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.fillRect(0, 0, 250, 75);

    // Draw background noise
    for (let i = 0; i < 10000; i++) {
      ctx.beginPath();
      let color = "#";
      while (color.length < 7) color += Math.round(Math.random() * 16).toString(16);
      ctx.fillStyle = color;
      ctx.arc(
        Math.round(Math.random() * 250), // X coordinate
        Math.round(Math.random() * 75), // Y coordinate
        Math.random(), // Radius
        0, // Start angle
        Math.PI * 2 // End angle
      );
      ctx.fill();
    }

    // Set style for circles
    ctx.fillStyle = "#FFF";
    ctx.lineWidth = 0;

    // Draw 80 circles
    for (let i = 0; i < 80; i++) {
      ctx.beginPath();
      ctx.arc(
        Math.round(Math.random() * 180) + 10, // X coordinate
        Math.round(Math.random() * 180) + 10, // Y coordinate
        Math.round(Math.random() * 7), // Radius
        0, // Start angle
        Math.PI * 2 // End angle
      );
      ctx.fill();
    }

    // Fill all the plotted line strokes
    ctx.stroke();

    // Set style for text
    ctx.font = '45px Zelda';
    ctx.fillStyle = '#222';
    ctx.shadowBlur = 4;

    // Set text value and print it to canvas
    ctx.beginPath();
    this._value = "";
    while (this._value.length !== 6) this._value = randomText();
    ctx.fillText(this._value, 10, 60);

  };

  get value() {
    return this._value;
  }

  get PNGStream() {
    return this._canvas.createPNGStream();
  }

}

module.exports = Captcha2;
