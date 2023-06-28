import { Container } from '../_game.js';
import { resourceMeters_setup } from './modules/resourceMeters.js';
import { bagButton_setup, bag_setup, bagPopupMenus_setup, bagPopulateMenus, bagPopupMenuInteraction, bagTooltips_setup } from './modules/bag.js';
import { characterButton_setup, character_setup, characterPopupMenus_setup, characterPopulateMenus, characterPopupMenuInteraction, characterTooltips_setup } from './modules/character.js';

export function ui_setup() {
    let ui = new Container();

    let resourceMeters = resourceMeters_setup();
    ui.addChild(resourceMeters);

    let bagButton = bagButton_setup();
    ui.addChild(bagButton);
    let bag = bag_setup();
    ui.addChild(bag);

    let characterButton = characterButton_setup();
    ui.addChild(characterButton);
    let character = character_setup();
    ui.addChild(character);

    // Create Popup Menu's Containers
    let bagPopupMenus = bagPopupMenus_setup();
    ui.addChild(bagPopupMenus);
    bagPopulateMenus();
    bagPopupMenuInteraction();
    let bagTooltips = bagTooltips_setup();
    ui.addChild(bagTooltips);

    let characterPopupMenus = characterPopupMenus_setup();
    ui.addChild(characterPopupMenus);
    characterPopulateMenus();
    characterPopupMenuInteraction();
    let characterTooltips = characterTooltips_setup();
    ui.addChild(characterTooltips);

    return ui;
}