const screenshot = require('screenshot-desktop');
const fs = require('fs');
const { createWorker } = require('tesseract.js');
const Jimp = require('jimp');
const { Board, SerialPort } = require('johnny-five');

// Constants
const SCREENSHOT_PATH = 'C:\\Users\\razor\\Documents\\GitHub\\arduino clock scramble\\screenshot.jpg';
const SCREENSHOT_FORMAT = 'jpg';
const SCREENSHOT_DISPLAY_ID = '\\\\.\\DISPLAY2';
const SCREENSHOT_INTERVAL_MS = 3000;

// Print the list of available displays
async function giveDisplays() {
  const displays = await screenshot.listDisplays();
  const displayIds = displays.map(display => `'${display.id}'`);
  console.log(`Available displays: ${displayIds.join(' and ')}\n`);
}
var last = '';

// Take a screenshot and process it
async function takeScreenshot(displayId, outputPath, board) {
  try {

    // Take the screenshot
    const imgPath = await screenshot({ filename: outputPath, format: SCREENSHOT_FORMAT, screen: displayId });

    // Load the screenshot using Jimp
    const image = await Jimp.read(SCREENSHOT_PATH);

    // Modify the image
    image.contrast(0.5);

    // Crop the image to the desired region
    const cropped = image.crop(325, 140, 925, 97.5);

    // Convert the cropped image to a Buffer
    const buffer = await cropped.getBufferAsync(Jimp.MIME_JPEG);

    cropped.writeAsync('screenshotmod.jpg');

    // Initialize a Tesseract.js worker
    const worker = await createWorker({
      load_system_dawg: false,
      load_freq_dawg: false,
    });

    // Set up the worker
    await worker.loadLanguage('eng');
    await worker.initialize('eng');

    // Recognize the text in the cropped image
    const { data: { text } } = await worker.recognize(buffer);
    let scram = text.replace(/T/g, "1").replace(/O/g, "0").replace(/l/g, "1").replace(/S/g, "5").replace(/(.)\1+/g, '$1').replace(/11/g, '1').replace(/S5/g, '5');

    if (scram !== last) {
      console.log(scram);
      last = scram;

      // Send the message to Arduino
      board.serial.write(scram + '1');
    }

    await worker.terminate();
  } catch (error) {
    console.error(error);
  }
}

// Start the program
async function start() {
  await giveDisplays();

  // Set up Arduino board
  const board = new Board({
    port: new SerialPort('COM3', { baudRate: 9600 }) // Replace 'COM3' with the correct serial port of your Arduino Uno
  });

  board.on('ready', () => {
    setInterval(() => takeScreenshot(SCREENSHOT_DISPLAY_ID, SCREENSHOT_PATH, board), SCREENSHOT_INTERVAL_MS);
  });
}

start();
