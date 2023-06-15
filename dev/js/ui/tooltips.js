import { Container } from '../_game.js';

let tooltips;

export function tooltips_setup() {
    tooltips = new Container();
    tooltips.visible = false;
    return tooltips;
}

export let getTooltips = () => tooltips;