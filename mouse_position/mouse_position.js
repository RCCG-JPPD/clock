const robot = require('robotjs');

// Get the mouse position.
const mouse = robot.getMousePos();
console.log(`Mouse is at x: ${mouse.x}, y: ${mouse.y}`);

setInterval(() => {
    const mouse = robot.getMousePos();
    console.log(`Mouse is at x: ${mouse.x}, y: ${mouse.y}`);
}, 1000); // Print the mouse position every 1000 milliseconds (1 second)
