var view = paper.view;
var boundingRect = view.bounds;

var rectHeight = 75;
var rectWidth = 75;
var width = 7;

var path;
var paths = [];
var items = [];
// const angles = [];

function onMouseDown(event) {
  path = new Path({
    strokeColor: 'black',
    strokeWidth: width,
  });
  if (path.length === 0) { // Add starting point
    path.add(snapLine(event));
  }
  path.add(snapLine(event));

  paths.push(path);
}

function onMouseDrag(event) {
  path.lastSegment.point = snapLine(event);
}

function onMouseUp() {
  // Draws the length for each segment.
  var textPosition;
  if (path.segments.length > 2) {
    textPosition = (path.lastSegment.point + path.lastSegment.previous.point) / 2;
  } else {
    textPosition = path.position;
  }

  /* Disable text
  var text = new PointText({
    point: textPosition + new Point(25, 25),
    content: (Math.floor(path.length * 1000) / 1000).toFixed(2),
    fillColor: 'black',
    justification: 'center',
  });
  items.push(text);

  /*
    Angle calculation
    if (path.segments.length > 2) {
        for (var segment in path.segments) {
            point1 = segment.previous.point.subtract(segment.point);
            point2 = segment.next.point.subtract(segment.point);
            angle = point1.getDirectedAngle(point2);
            document.getElementById('angles').innerHTML += angle + ", ";
        }
    }
    */
}

function snapLine(event) {
  // Readjusts the position of the last point to the closest grid point.
  var snapX = event.point.x;
  var snapY = event.point.y;
  var adjX = snapX % 75;
  var adjY = snapY % 75;
  var snapPoint = new Point();

  if (adjX < 37.5 && adjY < 37.5) { // Upper left
    snapPoint.x = snapX - adjX;
    snapPoint.y = snapY - adjY;
  } else if (adjX >= 37.5 && adjY < 37.5) { // Upper right
    snapPoint.x = snapX + 75 - adjX;
    snapPoint.y = snapY - adjY;
  } else if (adjX < 37.5 && adjY >= 37.5) { // Bottom left
    snapPoint.x = snapX - adjX;
    snapPoint.y = snapY + 75 - adjY;
  } else { // Bottom right
    snapPoint.x = snapX + 75 - adjX;
    snapPoint.y = snapY + 75 - adjY;
  }

  return snapPoint;
}

// Draw grid.
function drawGridLines(num_rectangles_wide, num_rectangles_tall, boundingRect) {
  var width_per_rectangle = rectHeight;
  var height_per_rectangle = rectWidth;
  
  // Adjust bounding rect to expand outside canvas.
  boundingRect.bottom *= 2;
  boundingRect.top = -boundingRect.bottom;
  boundingRect.right *= 2;
  boundingRect.left = -boundingRect.right;

  for (var i = 0; i <= num_rectangles_wide; i++) {
    var xPos = boundingRect.left + i * width_per_rectangle;
    var topPoint = new paper.Point(xPos, boundingRect.top);
    var bottomPoint = new paper.Point(xPos, boundingRect.bottom);
    var aLine = new paper.Path.Line(topPoint, bottomPoint);
    aLine.strokeColor = 'black';
  }
  for (var i = 0; i <= num_rectangles_tall; i++) {
    var yPos = boundingRect.top + i * height_per_rectangle;
    var leftPoint = new paper.Point(boundingRect.left, yPos);
    var rightPoint = new paper.Point(boundingRect.right, yPos);
    var aLine = new paper.Path.Line(leftPoint, rightPoint);
    aLine.strokeColor = 'black';
  }

  // Draw points
  for (var i = 1; i < num_rectangles_wide; i++) {
    var xPos = boundingRect.left + i * width_per_rectangle;
    for (var j = 1; j < num_rectangles_tall; j++) {
      var yPos = boundingRect.top + j * height_per_rectangle;
      var myCircle = new Path.Circle(new Point(xPos, yPos), 3);
      myCircle.fillColor = 'black';
    }
  }
}

function clearCanvas() {
  paper.project.clear();

  drawGridLines(100, 100, boundingRect);
}

// Clears the canvas on click.
document.getElementById('clearCanvas').onclick = function () {
  clearCanvas();
};

// Undoes the last drawn line.
document.getElementById('undo').onclick = function () {
  if (paths.length > 0) {
    // Removes it from our list of paths, and then from the canvas.
    paths.pop().remove();
  }

  // Removes the length label.
  /*
  items[items.length - 1].remove();
  items.pop();
  */
};

// Decreases the grid size and redraws.
document.getElementById('decrease').onclick = function () {
  // Use View scrollby to resize?
  var currSize = document.getElementById('gridSize').innerHTML;
  if (currSize > 0) {
    document.getElementById('gridSize').innerHTML = parseInt(currSize) - 10;
    view.zoom *= 1.1;
    console.log(view.zoom);
  }
};

// Increases the grid size and redraws.
document.getElementById('increase').onclick = function () {
  // Use View scrollby to resize?
  var currSize = document.getElementById('gridSize').innerHTML;
  if (currSize < 100) {
    document.getElementById('gridSize').innerHTML = parseInt(currSize) + 10;
    view.zoom /= 1.1;
  }
};

// Initialization.
drawGridLines(100, 100, boundingRect);