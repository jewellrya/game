import { uiLayout, uiStyle } from '../ui_design.js';

export function cubbyState(graphic, state) {
    if (state === 'hover') {
        graphic.beginFill(uiStyle.colors.gray);
        graphic.drawRect(0, 0, uiLayout.cubby.size, uiLayout.cubby.size);
    }
    else if (state === 'selected') {
        graphic.beginFill(uiStyle.colors.cyan);
        graphic.drawRect(0, 0, uiLayout.cubby.size, uiLayout.cubby.size);
    }
    else if (state === 'default') {
        // Default
        graphic.beginFill(uiStyle.colors.black, .5);
        graphic.drawRect(0, 0, uiLayout.cubby.size, uiLayout.cubby.size);
    }
}