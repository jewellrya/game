import { app } from '../_game.js';

export let uiData;

let windowHeight = 270;
export function uiData_setup() {
    uiData = {
        uiWindow: {
            height: windowHeight,
            y: app.view.height - windowHeight - 60,
            margin: 3,
        },
        uiButton: {
            scale: 1.75,
            margin: 15,
        },
        cubby: {
            size: 36,
            itemScale: 1.75,
        },
        popupMenu: {
            width: 150,
            height: 30,
        },
        tooltip: {
            width: 250,
            height: 30,
        }
    }
};