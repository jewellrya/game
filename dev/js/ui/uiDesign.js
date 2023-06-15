import { app } from '../_game.js';

export let uiLayout;
export let uiStyle;

let windowHeight = 270;
export function uiData_setup() {
    uiStyle = {
        colors: {
            black: '0x000000',
            gray: '0x707070',
            red: '0xff0000',
            orange: '0xff9d00',
            yellow: '0xffff00',
            green: '0x52fc03',
            cyan: '0x00d9ff',
            blue: '0x0004ff',
            violet: '0x8c00ff',
        }
    };

    uiLayout = {
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
    };
};