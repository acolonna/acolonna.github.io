var isDragging = false;
var dragBubble;
var timeTempChart;
var dragBoundingBox;
var dragBounds;


document.addEventListener('DOMContentLoaded', handlePageLoaded);

function handlePageLoaded(event) {
    /* Info.getLocalIP(handleLocalIPFound); */
    timeTempChart = document.getElementById('timeTempChart');
    
    timeTempChart.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    timeTempChart.addEventListener('touchstart', handleMouseDown);
    window.addEventListener('touchend', handleMouseUp);
}

/* function handleLocalIPFound(myIP) {
    // TODO: populate myIP pill on screen
    const container = document.getElementsByTagName('body')[0];
    const fragment = new DocumentFragment();
    const label = document.createElement('span');
    label.innerHTML = `IP: ${myIP}`;
    const button = document.createElement('button');
    button.type = 'button';
    button.innerHTML = 'X';
    button.onclick = (e) => { e.target.parentElement.remove(); };
    const pill = document.createElement('div');
    pill.className = 'ipPill';
    pill.appendChild(label);
    pill.appendChild(button);
    fragment.appendChild(pill);
    container.appendChild(fragment);
} */

function handleMouseDown(event) {
    console.log('start', event);

    dragBoundingBox = event.target;
    dragBounds = dragBoundingBox.getBoundingClientRect();
    console.log('dragBounds', dragBounds);

    var x, y;
    switch(event.type) {
        case "mousedown":
            x = event.clientX;
            y = event.clientY;
            break;
        case "touchstart":
            console.log(event);
            const touch = event.touches[0];
            x = touch.clientX;
            y = touch.clientY;
            break;
        default:
            return;
    }
    // TODO: change to discriminate between dragging an existing item or creating a new one
    const container = document.getElementsByTagName('body')[0];
    const fragment = new DocumentFragment();
    dragBubble = document.createElement('div');
    dragBubble.id = 'tempDragBubble';
    dragBubble.innerHTML = 70;
    dragBubble.style.left = `${x}px`;
    dragBubble.style.top = `${y}px`;
    fragment.appendChild(dragBubble);
    container.appendChild(fragment);
    isDragging = true;
    timeTempChart.addEventListener('mousemove', handleDrag);
    timeTempChart.addEventListener('touchmove', handleDrag);
}

function handleMouseUp(event) {
    console.log('end');
    // TODO: delete bubble
    if(dragBubble) {
        dragBubble.remove();
        dragBubble = null;
    }
    isDragging = false;
    timeTempChart.removeEventListener('mousemove', handleDrag);
    timeTempChart.removeEventListener('touchmove', handleDrag);
}

function handleDrag(event) {
    var x, y;
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
    console.log('drag');
    dragBubble.style.left = `${x}px`;
    dragBubble.style.top = `${y}px`;
}