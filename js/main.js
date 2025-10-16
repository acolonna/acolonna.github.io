document.addEventListener('DOMContentLoaded', handlePageLoaded);

function handlePageLoaded(event) {
    Info.getLocalIP(handleLocalIPFound);
}

function handleLocalIPFound(myIP) {
    // TODO: populate myIP pill on screen
    const container = document.getElementsByTagName('body')[0];
    const fragment = new DocumentFragment();
    const label = document.createElement('span');
    label.innerHTML = `IP: ${myIP}`;
    const button = document.createElement('button');
    button.type = 'button';
    button.innerHTML = 'X';
    button.onclick = (e) => {e.target.parentElement.remove();};
    const pill = document.createElement('div');
    pill.className = 'ipPill';
    pill.appendChild(label);
    pill.appendChild(button);
    fragment.appendChild(pill);
    container.appendChild(fragment);
}