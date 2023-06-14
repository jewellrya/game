import { Container } from '../_game.js';

let popupMenus;

export function popupMenus_setup() {
    popupMenus = new Container();
    popupMenus.visible = false;
    return popupMenus;
}

export let getPopupMenus = () => popupMenus;