window.addEventListener('mousedown', mouseDown);
window.addEventListener('mouseup', mouseUp);
window.addEventListener('mousemove', mouseMove, {once: true});

let cursor = {
    x: 0,
    y: 0
}

export let click = {};

function mouseDown(e) {
    click['mouse'] = true;
}

function mouseUp(e) {
    click['mouse'] = false;
}

function mouseMove(e) {
    cursor.x = e.offsetX;
    cursor.y = e.offsetY;
}

// Cursor
export const defaultCursor = "url('../../assets/cursor.png'),auto";
export const attackCursor = "url('../../assets/cursorAttack.png'),auto";