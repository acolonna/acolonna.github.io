var isDragging = false;
var dragBubble;
var upperBubble;
var timeTempChart;
var dragBoundingBox;
var dragBounds;
var previewVerticalLine;
var previewHorizontalLine;
var horizontalSpan;
var verticalSpan;
var lastMovePosition = [0, 0];


document.addEventListener('DOMContentLoaded', handlePageLoaded);

function handlePageLoaded(event) {
    timeTempChart = document.getElementById('timeTempChart');
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

    const container = document.getElementsByTagName('body')[0];
    const fragment = new DocumentFragment();
    dragBubble = document.createElement('div');
    dragBubble.id = 'tempDragBubble';
    dragBubble.style.left = `${x}px`;
    dragBubble.style.top = `${y}px`;
    fragment.appendChild(dragBubble);
    upperBubble = document.createElement('div');
    upperBubble.id = 'upperBubble';
    upperBubble.innerText = Math.round((x - dragBounds.x) / horizontalSpan) + 18;
    dragBubble.appendChild(upperBubble);

    previewVerticalLine = document.createElement('div');
    previewVerticalLine.className = 'previewLine';
    previewVerticalLine.style.height = '100%';
    previewVerticalLine.style.left = `${Math.round((x-dragBounds.x)/horizontalSpan)*horizontalSpan}px`;
    timeTempChart.appendChild(previewVerticalLine);
    previewHorizontalLine = document.createElement('div');
    previewHorizontalLine.className = 'previewLine';
    previewHorizontalLine.style.width = '100%';
    previewHorizontalLine.style.top = `${Math.round((y-dragBounds.y)/verticalSpan)*verticalSpan}px`;
    timeTempChart.appendChild(previewHorizontalLine);
    container.appendChild(fragment);
    isDragging = true;
    timeTempChart.addEventListener('mousemove', handleDrag);
    timeTempChart.addEventListener('touchmove', handleDrag);
}

function handleMouseUp(event) {
    console.log('end');
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


    var x = lastMovePosition[0] - dragBounds.x, y = lastMovePosition[1] - dragBounds.y, xPos, yPos;
    
    var xPos = Math.round(x / horizontalSpan);
    var yPos = Math.round(y / verticalSpan);

    const fragment = new DocumentFragment();
    const bubble = document.createElement('div');
    bubble.id = 'tempBubble';
    bubble.innerHTML = xPos + 18;
    bubble.style.left = `${xPos*horizontalSpan}px`;
    bubble.style.top = `${yPos*verticalSpan}px`;
    fragment.appendChild(bubble);
    timeTempChart.appendChild(fragment);
    console.log(bubble);
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
    if(oX > 0 && oX < dragBounds.width && oY > 0 && oY < dragBounds.height) {
        lastMovePosition[0] = x;
        lastMovePosition[1] = y;
        dragBubble.style.left = `${x}px`;
        dragBubble.style.top = `${y}px`;
        const tempValue = Math.round(oX / horizontalSpan) + 18;
        upperBubble.innerText = tempValue;
        previewVerticalLine.style.left = `${Math.round(oX/horizontalSpan)*horizontalSpan}px`;
        previewHorizontalLine.style.top = `${Math.round(oY/verticalSpan)*verticalSpan}px`;
    }
}