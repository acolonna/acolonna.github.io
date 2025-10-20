var isDragging = false;
var dragBubble;
var upperBubble;
var timeTempChart;
var chartLabels;
var dragBoundingBox;
var dragBounds;
var previewVerticalLine;
var previewHorizontalLine;
var horizontalSpan;
var verticalSpan;
var lastMovePosition = [0, 0];
var savedBubbles = [];


document.addEventListener('DOMContentLoaded', handlePageLoaded);

window.oncontextmenu = function (event) {
    // eslint-disable-next-line no-console
    console.log(event); // prints [object PointerEvent]
  
    const pointerEvent = event;
    // eslint-disable-next-line no-console
    console.log(`window.oncontextmenu: ${pointerEvent.pointerType}`);
  
    if (pointerEvent.pointerType === 'touch') {
      // context menu was triggerd by long press
      return false;
    }
  
    // just to show that pointerEvent.pointerType has another value 'mouse' aka right click
    if (pointerEvent.pointerType === 'mouse') {
      // context menu was triggered by right click
      return true;
    }
  
    // returning true will show a context menu for other cases
    return true;
  };

function handlePageLoaded(event) {
    timeTempChart = document.getElementById('timeTempChart');
    chartLabels = document.getElementById('chartLabels');
    dragBounds = timeTempChart.getBoundingClientRect();
    horizontalSpan = dragBounds.width / 12;
    verticalSpan = dragBounds.height / 24;
    drawTimeTempChart(timeTempChart);
    
    timeTempChart.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    timeTempChart.addEventListener('touchstart', handleMouseDown);
    window.addEventListener('touchend', handleMouseUp);
}

function drawTimeTempChart(container) {
    const fragment = new DocumentFragment();
    var i, iLimit = 24, j, jLimit = 12, ySpan = dragBounds.height / iLimit, xSpan = dragBounds.width / jLimit;
    for(i = 0; i <= iLimit; i++) {
        if(i % 4 == 0) {
            // add a line
            const line = document.createElement('div');
            line.className = 'chartLine';
            line.style.top = `${ySpan * i}px`;
            line.style.left = '0px;';
            fragment.appendChild(line);
        } else {
            // add dots
            for(j = 0; j <= jLimit; j++) {
                const dot = document.createElement('div');
                dot.className = 'chartDot';
                dot.style.top = `${ySpan * i}px`;
                dot.style.left = `${xSpan * j}px`;
                fragment.appendChild(dot);
            }
        }
    }
    container.appendChild(fragment);
}

function handleMouseDown(event) {
    dragBoundingBox = event.target;

    var x, y;
    switch(event.type) {
        case "mousedown":
            x = lastMovePosition[0] = event.clientX;
            y = lastMovePosition[1] = event.clientY;
            break;
        case "touchstart":
            console.log(event);
            const touch = event.touches[0];
            x = lastMovePosition[0] = touch.clientX;
            y = lastMovePosition[1] = touch.clientY;
            break;
        default:
            return;
    }

    var oX = x - dragBounds.x;
    var oY = y - dragBounds.y;
    var xPos = Math.round(oX / horizontalSpan);
    var yPos = Math.round(oY / verticalSpan);

    const container = document.getElementsByTagName('body')[0];
    const fragment = new DocumentFragment();
    dragBubble = document.createElement('div');
    dragBubble.id = 'tempDragBubble';
    dragBubble.style.left = `${x}px`;
    dragBubble.style.top = `${y}px`;
    fragment.appendChild(dragBubble);
    upperBubble = document.createElement('div');
    upperBubble.id = 'upperBubble';
    upperBubble.innerText = xPos + 18;
    dragBubble.appendChild(upperBubble);

    previewVerticalLine = document.createElement('div');
    previewVerticalLine.className = 'previewLine';
    previewVerticalLine.style.height = '100%';
    previewVerticalLine.style.left = `${xPos*horizontalSpan}px`;
    timeTempChart.appendChild(previewVerticalLine);
    previewHorizontalLine = document.createElement('div');
    previewHorizontalLine.className = 'previewLine';
    previewHorizontalLine.style.width = '100%';
    previewHorizontalLine.style.top = `${yPos*verticalSpan}px`;
    timeTempChart.appendChild(previewHorizontalLine);
    document.body.appendChild(fragment);
    isDragging = true;
    timeTempChart.addEventListener('mousemove', handleDrag);
    timeTempChart.addEventListener('touchmove', handleDrag);

    var existingBubble = getBubble(xPos, yPos);
    if(existingBubble != null) {
        const bubble = existingBubble.bubble;
        console.log(bubble);
        bubble.style.display = 'none';
        savedBubbles.splice(existingBubble.index, 1);
    }
}

function handleMouseUp(event) {
    if(dragBubble) {
        dragBubble.remove();
        dragBubble = null;
    }
    if(previewVerticalLine) {
        previewVerticalLine.remove();
        previewVerticalLine = null;
    }
    if(previewHorizontalLine) {
        previewHorizontalLine.remove();
        previewHorizontalLine = null;
    }
    isDragging = false;
    timeTempChart.removeEventListener('mousemove', handleDrag);
    timeTempChart.removeEventListener('touchmove', handleDrag);


    var x = lastMovePosition[0] - dragBounds.x, y = lastMovePosition[1] - dragBounds.y;
    var xPos = Math.round(x / horizontalSpan);
    var yPos = Math.round(y / verticalSpan);
    
    if(!bubbleAtSameTime(yPos)) {
        const fragment = new DocumentFragment();
        const bubble = document.createElement('div');
        bubble.className = 'tempBubble';
        bubble.innerHTML = xPos + 18;
        bubble.style.left = `${xPos*horizontalSpan}px`;
        bubble.style.top = `${yPos*verticalSpan}px`;
        fragment.appendChild(bubble);
        timeTempChart.appendChild(fragment);
        savedBubbles.push([xPos, yPos, bubble]);
    }

    cleanUpChart();
}

function handleDrag(event) {
    var x, y, oX, oY;
    switch(event.type) {
        case "mousemove":
            x = event.clientX;
            y = event.clientY;
            break;
        case "touchmove":
            const touch = event.touches[0];
            x = touch.clientX;
            y = touch.clientY;
            break;
        default:
            return;
    }
    oX = x - dragBounds.x;
    oY = y - dragBounds.y;
    var xPos = Math.round(oX / horizontalSpan);
    var yPos = Math.round(oY / verticalSpan);
    if(oX > 0 && oX < dragBounds.width && oY > 0 && oY < dragBounds.height) {
        lastMovePosition[0] = x;
        lastMovePosition[1] = y;
        dragBubble.style.left = `${x}px`;
        dragBubble.style.top = `${y}px`;
        const tempValue = Math.round(oX / horizontalSpan) + 18;
        upperBubble.innerText = tempValue;
        previewVerticalLine.style.left = `${xPos*horizontalSpan}px`;
        previewHorizontalLine.style.top = `${yPos*verticalSpan}px`;
        if(bubbleAtSameTime(yPos)) {
            previewHorizontalLine.style.display = 'none';
            previewVerticalLine.style.display = 'none';
        } else {
            previewHorizontalLine.style.display = 'block';
            previewVerticalLine.style.display = 'block';
        }
    }
}

function getBubble(xPos, yPos) {
    var result = null;
    var i, limit = savedBubbles.length;
    for(i=0; i<limit; i++) {
        const bubble = savedBubbles[i];
        if(bubble[0] == xPos && bubble[1] == yPos) {
            result = {index: i, bubble: bubble[2]};
            break;
        }
    }
    return result;
}

function bubbleAtSameTime(yPos) {
    var result = false;
    var i, limit = savedBubbles.length;
    for(i=0; i<limit; i++) {
        const bubble = savedBubbles[i];
        if(bubble[1] == yPos) {
            result = true;
            break;
        }
    }
    return result;
}

function cleanUpChart() {
    console.log('cleanUpChart');
    const allBubbles = timeTempChart.querySelectorAll('div.tempBubble');
    console.log('found bubbles', allBubbles.length);
    allBubbles.forEach(child => {
        const computedStyle = window.getComputedStyle(child);
        if(computedStyle.display == 'none') {
            console.log('removing child');
            child.remove();
            child = null;
        }
    });
}