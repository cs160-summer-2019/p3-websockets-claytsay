paper.install(window);
// Colour values taken from Minecraft: https://minecraft.gamepedia.com/Dye#Item_data
var colours = {
  "Ink Sac": "#1D1D21",
  "Red Dye": "#B02E26",
  "Green Dye": "#5E7C16",
  "Cocoa Beans": "#835432",
  "Lapis Lazuli": "#3C44AA",
  "Purple Dye": "#8932B8",
  "Cyan Dye": "#169C9C",
  "Light Gray Dye": "#9D9D97",
  "Gray Dye": "#474F52",
  "Pink Dye": "#F38BAA",
  "Lime Dye": "#80C71F",
  "Yellow Dye": "#FED83D",
  "Light Blue Dye": "#3AB3DA",
  "Magenta Dye": "#C74EBD",
  "Orange Dye": "#F9801D"
  // "Bone Meal": "#F9FFFE",  // Some colours don't work
  // "Black Dye": "#1D1D21",
  // "Brown Dye": "#835432",
  // "Blue Dye": "#3C44AA",
  // "White Dye": "#F9FFFE"
}

window.onload = function() {
  // Set up the WebSocket connection
  var socket = new WebSocket("wss://p3-websockets-claytsay-claytsay.codeanyapp.com/ws/draw");

  // Set up the Paper.js project
  // (Literally copy-pasted from the Paper.js website)
  var project = new paper.Project("myCanvas");
  project.ids = [];

  // Figure out which type of screen is being used
  var urlParams = new URLSearchParams(window.location.search);
  const size = urlParams.get("size");

  if (size === "large") {
    // Figure out what to do when WebSocket information is received
    socket.onmessage = function(message) {
      let data = JSON.parse(message.data);
      if (!(data.id in project.ids)) {
        let newLayer = new paper.Layer();
        project.addLayer(newLayer.importJSON(data.layer));
        project.ids.push(data.id);
      } else {
        let pathArray = data.layer[1].children;
        let newPath = pathArray.get[pathArray.length - 1];
        project.layers[project.ids.indexOf(data.id)][1].importJSON(newPath);
      }
    }
    
    // Update the description
    $("#colourDescription").html("");

  } else if (size === "small") {
    // Establish an ID
    var id = Math.round(Math.random() * 9000);
    // project.ids.push(id);

    // Select a colour
    // Taken from StackOverflow: https://stackoverflow.com/questions/2532218/pick-random-property-from-a-javascript-object
    let keys = Object.keys(colours);
    let randKey = keys[keys.length * Math.random() << 0];
    var colour = colours[randKey];
    $("#colourText").css("color", colour).html(randKey);

    // Create a simple drawing tool:
    var tool = new Tool();
    var path;

    // Define a mouse handlers
    tool.onMouseDown = function(event) {
      path = new Path();
      path.strokeColor = colour;
      path.strokeWidth = 6;
      path.add(event.point);
    }

    tool.onMouseDrag = function(event) {
      path.add(event.point);
    }

    tool.onMouseUp = function(event) {
      // After the stroke is completed, log it to the WebSocket
      // console.log(`To send: {"id": ${id}, "layer": ${JSON.stringify(project.activeLayer)}}`);
      socket.send(`{"id": ${id}, "layer": ${JSON.stringify(project.activeLayer)}}`);
    }

  } else {
    console.error(`Invalid query parameter for 'size': ${size}`);
  }

}

/*

// setting up the canvas and one paper tool

paper.setup(canvas);
var tool = new paper.Tool();

// getting the URL (you may want to use for Exercise 3)
var url = window.location.href;

// var socket = new WebSocket(
//     'wss://<your url here>/ws/draw');

*/