import { app, Sprite, Graphics, Container, BitmapText } from '../../_game.js';
import { uiLayout, uiStyle } from '../ui_design.js';
import { createNewPlayerArmor, destroyPlayerArmor } from '../../player/player.js';
import {
    playerName, playerStats,
    setEquippedCubby, getEquippedCubby, getEquipped, getEquippedSlot
} from '../../data/playerData.js';
import { getIconSheet } from '../../sheets/iconSheet.js';
import { getPopupMenus } from './popupMenus.js';
import { getTooltips } from './tooltips.js';
import { cubbyState } from './cubby.js';
import { inventoryPopulateNewItem } from './bag.js';
import { itemData } from '../../data/itemData.js';

let characterIcon;
let characterUiBg;
let characterUiNamePlate;
let characterUiArmor;
let popupMenus;
let tooltips;

export function characterButton_setup() {
    // characterIcon UI Button    
    characterIcon = new Sprite(getIconSheet()['iconCharacter.png']);
    characterIcon.scale.set(uiLayout.uiButton.scale, uiLayout.uiButton.scale);
    characterIcon.x = uiLayout.uiButton.margin;
    characterIcon.y = app.view.height - characterIcon.height - uiLayout.uiButton.margin;
    characterIcon.interactive = true;
    return characterIcon;
}

export function character_setup() {
    popupMenus = getPopupMenus();
    tooltips = getTooltips();

    // Character UI Window
    let characterUi = new Container();
    characterUi.visible = false;
    characterUiBg = new Graphics();
    characterUiBg.lineStyle(4, 0x000000, .5, 0);
    characterUiBg.beginFill(uiStyle.colors.black, .3);
    characterUiBg.drawRect(0, 0, 250, uiLayout.uiWindow.height);
    characterUiBg.x = 10;
    characterUiBg.y = uiLayout.uiWindow.y;
    characterUi.addChild(characterUiBg);

    // Charater Name plate at the top of the Character UI
    characterUiNamePlate = new Container();
    characterUiNamePlate.x = characterUiBg.x;
    characterUiNamePlate.y = characterUiBg.y;
    let characterUiNamePlateBg = new Graphics();
    characterUiNamePlateBg.beginFill(uiStyle.colors.black);
    characterUiNamePlateBg.drawRect(0, 0, characterUiBg.width, 30);
    characterUiNamePlate.addChild(characterUiNamePlateBg);
    let characterUiNamePlateText = new BitmapText(playerName, uiStyle.text);
    characterUiNamePlateText.x = 10;
    characterUiNamePlateText.y = 7;
    characterUiNamePlate.addChild(characterUiNamePlateText);
    characterUi.addChild(characterUiNamePlate);

    // Section that shows player stats
    let characterUiStats = new Container();
    characterUiStats.x = characterUiBg.x + 7;
    characterUiStats.y = characterUiBg.y + characterUiNamePlateBg.height + uiLayout.uiWindow.margin;
    let characterUiStatsBg = new Graphics();
    characterUiStatsBg.beginFill(uiStyle.colors.black, .5);
    characterUiStatsBg.drawRect(0, 0, 85, 175);
    characterUiStats.addChild(characterUiStatsBg);
    Object.keys(playerStats).map(function (stat, i) {
        if (i <= 6) {
            let statCount = new Container();
            statCount.x = 10;
            statCount.y = (characterUiStatsBg.height / 6) + (15 * i);
            let label = new BitmapText(stat.slice(0, 3), uiStyle.text);
            statCount.addChild(label);
            let amount = new BitmapText(playerStats[stat].toString(), uiStyle.text);
            amount.x = 40;
            statCount.addChild(amount);
            characterUiStats.addChild(statCount);
        }
    })
    characterUi.addChild(characterUiStats);
    characterUiArmor = new Container();
    characterUiArmor.x = characterUiStats.x + characterUiStatsBg.width + uiLayout.uiWindow.margin;
    characterUiArmor.y = characterUiStats.y;

    // Generate Cubbies for Equipped Items
    function createEquippedCubby(slot, defaultSprite, x, y) {
        setEquippedCubby(slot, new Container());
        let cubby = getEquippedCubby(slot);

        cubby.interactive = true;
        cubby.x = x + ((characterUiBg.width - characterUiStatsBg.width - (characterUiBg.line.width * 2) - ((uiLayout.cubby.size * 2) + (uiLayout.uiWindow.margin * 4))) / 2);
        cubby.y = y + characterUiStatsBg.height - (characterUiBg.line.width * 2) - (((uiLayout.cubby.size * 4) + (uiLayout.uiWindow.margin * 4)));
        let cubbyBg = new Graphics();
        cubbyBg.interactive = true;
        cubbyState(cubbyBg, 'default');
        cubby.addChild(cubbyBg);
        let cubbyDefaultIcon = new Sprite(getIconSheet()[defaultSprite]);
        cubbyDefaultIcon.scale.set(1.5, 1.5);
        cubbyDefaultIcon.x = ((cubby.width - cubbyDefaultIcon.width) / 2);
        cubbyDefaultIcon.y = ((cubby.height - cubbyDefaultIcon.height) / 2);
        cubby.addChild(cubbyDefaultIcon);
        characterUiArmor.addChild(cubby);
    }

    createEquippedCubby('head', 'iconHead.png', 0, 0);
    createEquippedCubby('shoulders', 'iconShoulders.png', uiLayout.cubby.size + uiLayout.uiWindow.margin, 0);
    createEquippedCubby('chest', 'iconChest.png', 0, uiLayout.cubby.size + uiLayout.uiWindow.margin);
    createEquippedCubby('hands', 'iconHands.png', uiLayout.cubby.size + uiLayout.uiWindow.margin, uiLayout.cubby.size + uiLayout.uiWindow.margin);
    createEquippedCubby('legs', 'iconLegs.png', 0, (uiLayout.cubby.size + 3) * 2);
    createEquippedCubby('feet', 'iconFeet.png', uiLayout.cubby.size + uiLayout.uiWindow.margin, (uiLayout.cubby.size + uiLayout.uiWindow.margin) * 2);
    createEquippedCubby('rightHand', 'iconWeapon.png', (-uiLayout.cubby.size / 2), (uiLayout.cubby.size + uiLayout.uiWindow.margin) * 3);
    createEquippedCubby('leftHand', 'iconShield.png', (-uiLayout.cubby.size / 2) + uiLayout.cubby.size + uiLayout.uiWindow.margin, (uiLayout.cubby.size + uiLayout.uiWindow.margin) * 3);
    createEquippedCubby('resourceItem', 'iconArrow.png', (-uiLayout.cubby.size / 2) + ((uiLayout.cubby.size + uiLayout.uiWindow.margin) * 2), (uiLayout.cubby.size + uiLayout.uiWindow.margin) * 3);

    characterUi.addChild(characterUiArmor);

    let characterUiExtra = new Container();
    characterUiExtra.x = characterUiStats.x;
    characterUiExtra.y = (characterUiStats.y + characterUiStatsBg.height + uiLayout.uiWindow.margin);
    let characterUiExtraBg = new Graphics();
    characterUiExtraBg.beginFill(uiStyle.colors.black, .5);
    characterUiExtraBg.drawRect(0, 0, characterUiBg.width - (uiLayout.uiWindow.margin * 2) - (characterUiBg.line.width * 2), characterUiBg.height - characterUiStatsBg.height - characterUiNamePlateBg.height - (uiLayout.uiWindow.margin * 2) - (characterUiBg.line.width * 2));
    characterUiExtra.addChild(characterUiExtraBg);
    characterUi.addChild(characterUiExtra);

    // Populate Equipped Items Cubbies
    Object.keys(getEquipped()).map(function (slot) {
        let equippedObject = getEquippedSlot(slot);
        let cubby = getEquippedCubby(slot);
        if (equippedObject.item) {
            cubby.removeChild(cubby.children[1]);
            let sprite = new Sprite(getIconSheet()['icon' + getEquippedSlot(slot).item.replace(/^(.)/, s => s.toUpperCase()) + '.png']);
            sprite.scale.set(uiLayout.uiButton.scale, uiLayout.uiButton.scale);
            sprite.x = ((cubby.width - sprite.width) / 2);
            sprite.y = ((cubby.height - sprite.height) / 2);
            cubby.addChild(sprite);
        }
    })

    // Opening and Closing Character UI
    let characterUiOpen = false;
    characterIcon.on('click', function () {
        if (!characterUiOpen) {
            characterIcon.texture = getIconSheet()['iconCharacterSelected.png'];
            characterIcon.x -= uiLayout.uiButton.scale;
            characterIcon.y -= uiLayout.uiButton.scale;
            characterUi.visible = true;
            characterUiOpen = true;
        } else {
            characterIcon.texture = getIconSheet()['iconCharacter.png'];
            characterIcon.x += uiLayout.uiButton.scale;
            characterIcon.y += uiLayout.uiButton.scale;
            characterUi.visible = false;
            characterUiOpen = false;
        }
    })

    return (characterUi);
}

export function characterPopupMenus_setup() {
    let popupMenusCharacter = new Container();
    Object.keys(getEquipped()).map(function (equippedItem) {
        let cubby = getEquippedCubby(equippedItem);

        // Generate Cubby Menu
        let popupMenu = new Container();
        popupMenu.visible = false;
        popupMenu.x = cubby.x + characterUiArmor.x + (uiLayout.cubby.size / 2);
        popupMenu.y = cubby.y + characterUiNamePlate.y + (uiLayout.cubby.size * 2) - uiLayout.uiWindow.margin;
        popupMenusCharacter.addChild(popupMenu);

        let menuItems = [
            {
                label: 'unequip',
                menuItem: {},
            },
            {
                label: 'destroy',
                menuItem: {},
            }
        ]

        // Draw Menu Items
        menuItems.forEach(function (item, i) {
            item.menuItem = new Container();
            item.menuItem.x = 0;
            item.menuItem.y = (uiLayout.popupMenu.height * i);
            let itemBg = new Graphics();
            itemBg.beginFill(uiStyle.colors.black);
            itemBg.drawRect(0, 0, uiLayout.popupMenu.width, uiLayout.popupMenu.height);
            itemBg.interactive = true;
            let itemText = new BitmapText(item.label, uiStyle.text);
            itemText.x = 10;
            itemText.y = 8;
            item.menuItem.addChild(itemBg);
            item.menuItem.addChild(itemText);
            popupMenu.addChild(item.menuItem);
            itemBg.on('mouseover', function () {
                itemBg.clear();
                itemBg.beginFill(uiStyle.colors.gray);
                itemBg.drawRect(0, 0, uiLayout.popupMenu.width, uiLayout.popupMenu.height);
            })
            itemBg.on('mouseout', function () {
                itemBg.clear();
                itemBg.beginFill(uiStyle.colors.black);
                itemBg.drawRect(0, 0, uiLayout.popupMenu.width, uiLayout.popupMenu.height);
            })
        })
    })
    popupMenus.characterUi = popupMenusCharacter;
    popupMenus.characterUi.visible = false;
    return popupMenus.characterUi;
}

function tooltipStats(tooltip, itemName) {
    let itemStats = itemData[itemName].stats;
    let itemStatsArray = [];
    Object.keys(itemStats).map(function (stat, i) {
        if (itemStats[stat] > 0) {
            itemStatsArray.push(stat + ' ' + itemStats[stat]);
        }
    })
    itemStatsArray.forEach(function (statString, i) {
        let tooltipStat = new Container();
        tooltipStat.y = uiLayout.tooltip.height + ((uiLayout.tooltip.height / 1.2) * i);
        let tooltipStatBg = new Graphics();
        tooltipStatBg.beginFill(uiStyle.colors.black, .75);
        tooltipStatBg.drawRect(0, 0, uiLayout.tooltip.width, uiLayout.tooltip.height / 1.2);
        tooltipStat.addChild(tooltipStatBg);

        let tooltipStatText = new BitmapText(statString, uiStyle.text);
        tooltipStatText.x = 10;
        tooltipStatText.y = 3;
        tooltipStat.addChild(tooltipStatText);
        tooltip.addChild(tooltipStat);
    })
}

function tooltipsEvents(equippedItem, i) {
    let cubby = getEquippedCubby(equippedItem);
    cubby.on('mouseover', function () {
        if (getEquippedSlot(equippedItem).item && !popupMenus.characterUi.children[i].visible) {
            tooltips.characterUi.visible = true;
            tooltips.characterUi.children[i].visible = true;
        }
    })
    cubby.on('mouseout', function () {
        if (getEquippedSlot(equippedItem).item) {
            tooltips.characterUi.visible = false;
            tooltips.characterUi.children[i].visible = false;
        }
    })
    if (getEquippedSlot(equippedItem).item) {
        cubby.on('click', function () {
            if (tooltips.characterUi.children[i].visible) {
                tooltips.characterUi.visible = false;
                tooltips.characterUi.children[i].visible = false;
            } else {
                tooltips.characterUi.visible = true;
                tooltips.characterUi.children[i].visible = true;
            }
        })
    }
}

export function characterTooltips_setup() {
    let tooltipsCharacter = new Container();
    Object.keys(getEquipped()).forEach(function (equippedItem, i) {
        let cubby = getEquippedSlot(equippedItem).cubby;

        let tooltip = new Container();
        tooltip.visible = false;
        tooltip.x = cubby.x + characterUiArmor.x + (uiLayout.cubby.size / 2);
        tooltip.y = cubby.y + characterUiNamePlate.y + (uiLayout.cubby.size * 2) - uiLayout.uiWindow.margin;

        // Name plate for Inventory Item
        let tooltipName = new Container();
        let tooltipNameBg = new Graphics();
        tooltipNameBg.beginFill(uiStyle.colors.black, .75);
        tooltipNameBg.drawRect(0, 0, uiLayout.tooltip.width, uiLayout.tooltip.height);
        tooltipName.addChild(tooltipNameBg);

        let itemName = getEquippedSlot(equippedItem).item ? itemData[getEquippedSlot(equippedItem).item].name : 'No Item';
        let tooltipNameText = new BitmapText(itemName, uiStyle.text);
        tooltipNameText.x = 10;
        tooltipNameText.y = 7;
        tooltipNameText.tint = uiStyle.colors.green;
        tooltipName.addChild(tooltipNameText);

        tooltip.addChild(tooltipName);

        // Stat Plates for Each Stat with a value;
        if (getEquippedSlot(equippedItem).item) {
            tooltipStats(tooltip, getEquippedSlot(equippedItem).item);
        }
        tooltipsCharacter.addChild(tooltip);

        tooltips.characterUi = tooltipsCharacter;
        tooltips.characterUi.visible = false;

        tooltipsEvents(equippedItem, i);
    });
    return tooltips.characterUi;
}

function popupMenuEvents(cubby, i) {
    let cubbyBg = cubby.children[0];
    let popupMenu = popupMenus.characterUi.children[i];

    cubby.on('click', function () {
        if (!popupMenu.visible) {
            let clonedPopupMenus = popupMenus.characterUi.children.slice();
            clonedPopupMenus.splice(i, 1);
            clonedPopupMenus.forEach(function (menu) {
                menu.visible = false;
            })
            Object.keys(getEquipped()).forEach(function (equippedSlot) {
                let equippedSlotItem = getEquippedSlot(equippedSlot);
                let otherCubbyBg = equippedSlotItem.cubby.children[0];
                otherCubbyBg.clear();
                cubbyState(otherCubbyBg, 'default');
            })
            popupMenu.visible = true;
            popupMenus.characterUi.visible = true;
            cubbyBg.clear();
            cubbyState(cubbyBg, 'selected');
        } else {
            popupMenu.visible = false;
            popupMenus.characterUi.visible = false;
            cubbyBg.clear();
            cubbyState(cubbyBg, 'hover');
        }
    })

    cubby.on('mouseover', function () {
        if (!popupMenu.visible) {
            cubbyBg.clear();
            cubbyState(cubbyBg, 'hover');
        }
    })

    cubby.on('mouseout', function () {
        if (!popupMenu.visible) {
            cubbyBg.clear();
            cubbyState(cubbyBg, 'default');
        }
    })
}

export function characterPopulateMenus() {
    Object.keys(getEquipped()).forEach(function (equippedSlot, i) {
        let equippedSlotItem = getEquippedSlot(equippedSlot);
        let equippedItem = equippedSlotItem.item;
        if (equippedItem) {
            let cubby = equippedSlotItem.cubby;
            popupMenuEvents(cubby, i);
        }
    });
}

export function characterPopupMenuInteraction() {
    Object.keys(getEquipped()).forEach(function (equippedSlot, i) {
        let popupMenu = popupMenus.characterUi.children[i];

        let unequip = popupMenu.children[0].children[0];
        unequip.on('click', function () {
            let cubby = getEquippedCubby(equippedSlot);
            let itemName = getEquippedSlot(equippedSlot).item;
            let itemIcon = cubby.children[1];
            itemIcon.destroy();
            let defaultIcon = new Sprite(getIconSheet()[getEquippedSlot(equippedSlot).defaultSprite]);
            defaultIcon.scale.set(1.5, 1.5);
            defaultIcon.x = ((cubby.width - defaultIcon.width) / 2);
            defaultIcon.y = ((cubby.height - defaultIcon.height) / 2);
            cubby.addChild(defaultIcon);

            popupMenu.visible = false;
            cubby.removeAllListeners();

            let cubbyBg = cubby.children[0];
            cubbyBg.clear();
            cubbyState(cubbyBg, 'default');

            // Remove Sprite from player
            destroyPlayerArmor(equippedSlot);

            // Populate in bags function.
            inventoryPopulateNewItem(itemName);
        });

        let destroy = popupMenu.children[1].children[0];
        destroy.on('click', function () {
            let cubby = getEquippedCubby(equippedSlot);
            let itemIcon = cubby.children[1];
            itemIcon.destroy();
            let defaultIcon = new Sprite(getIconSheet()[getEquippedSlot(equippedSlot).defaultSprite]);
            defaultIcon.scale.set(1.5, 1.5);
            defaultIcon.x = ((cubby.width - defaultIcon.width) / 2);
            defaultIcon.y = ((cubby.height - defaultIcon.height) / 2);
            cubby.addChild(defaultIcon);

            popupMenu.visible = false;
            cubby.removeAllListeners();

            let cubbyBg = cubby.children[0];
            cubbyBg.clear();
            cubbyState(cubbyBg, 'default');

            // Remove Sprite from player
            destroyPlayerArmor(equippedSlot);
        })
    });
}

export function equippedPopulateNewItem(itemName) {
    let itemSlot = itemData[itemName].slot;
    let equippedSlot = getEquippedSlot(itemSlot);
    equippedSlot.cubby.children[1].destroy();
    equippedSlot.item = itemName;

    let newIcon = new Sprite(itemData[itemName].icon);
    newIcon.scale.set(uiLayout.cubby.itemScale);
    newIcon.x = (uiLayout.cubby.size - newIcon.width) / 2;
    newIcon.y = (uiLayout.cubby.size - newIcon.height) / 2;
    equippedSlot.cubby.addChild(newIcon);

    // Reinstate Popup Menus and Tooltip
    let cubby = equippedSlot.cubby;
    let i = Object.keys(getEquipped()).map(function (e) { return e }).indexOf(itemSlot);
    popupMenuEvents(cubby, i);
    let tooltip = tooltips.characterUi.children[i];
    let tooltipNameText = tooltip.children[0].children[1];
    tooltipNameText.text = itemData[itemName].name;
    if (tooltips.characterUi.children[i].children.length <= 1) {
        tooltipStats(tooltip, itemName);
    }
    tooltipsEvents(itemSlot, i);
    createNewPlayerArmor(itemSlot);
}