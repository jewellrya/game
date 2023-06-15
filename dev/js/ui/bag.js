import { app, Container, Graphics, BitmapText, Sprite } from '../_game.js';
import { getInventory, getInventoryItems, setInventoryItem, getEquippedCubby, getEquippedSlot } from '../playerData.js';
import { getIconSheet } from '../sheets/iconSheet.js';
import { textStyle } from './textStyle.js';
import { itemsMap } from '../itemMap.js';
import { getPopupMenus } from './popupMenus.js';
import { createNewPlayerArmor } from '../player.js';
import { getTooltips } from './tooltips.js';

let bagIconScale = 1.75;
let bagIconMargin = 15;
let bagIcon;

let bagUiBg;
let bagUiMargin = 3;
let cubbySize = 36;
let popupMenus;
let tooltips;
let itemMenuWidth = 150;
let itemMenuHeight = 30;
let bagUiItemScale = 1.75;

export function bagButton_setup() {
    // bagIcon UI Button
    bagIcon = new Sprite(getIconSheet()['iconBag.png']);
    bagIcon.scale.set(bagIconScale, bagIconScale);
    bagIcon.x = app.view.width - bagIcon.width - bagIconMargin;
    bagIcon.y = app.view.height - bagIcon.height - bagIconMargin;
    bagIcon.interactive = true;
    return bagIcon;
}

export function bag_setup() {
    let uiWindowHeight = 270;
    let uiWindowY = app.view.height - uiWindowHeight - 60;

    popupMenus = getPopupMenus();
    tooltips = getTooltips();

    // Bag UI Window
    let bagUi = new Container();
    bagUi.visible = false;
    bagUiBg = new Graphics();
    bagUiBg.lineStyle(4, 0x000000, .5, 0);
    bagUiBg.beginFill('0x000000', .3);
    bagUiBg.drawRect(0, 0, 168, uiWindowHeight);
    bagUiBg.x = app.view.width - bagUiBg.width - 10;
    bagUiBg.y = uiWindowY;
    bagUi.addChild(bagUiBg);

    let bagUiCurrency = new Container();
    bagUiCurrency.x = bagUiBg.x + 10;
    bagUiCurrency.y = bagUiBg.y + bagUiBg.height - 22;

    // Gold Container for Icon & Amount
    let bagUiCurrencyGold = new Container();
    let bagUiGoldIcon = new Sprite(getIconSheet()['iconGold.png']);
    bagUiGoldIcon.scale.set(.75, .75);
    bagUiCurrencyGold.addChild(bagUiGoldIcon);
    let bagUiGoldText = new BitmapText(getInventory().currency.gold.toString(), textStyle);
    bagUiGoldText.x = bagUiGoldIcon.x + 14;
    bagUiGoldText.y = bagUiGoldIcon.y - 3;
    bagUiCurrencyGold.addChild(bagUiGoldText);
    bagUiCurrency.addChild(bagUiCurrencyGold);

    // Silver Container for Icon & Amount - Try PIXI.BitmapText to use bagUiCurrencyGold.width.
    let bagUiCurrencySilver = new Container();
    bagUiCurrencySilver.x = 35;
    let bagUiSilverIcon = new Sprite(getIconSheet()['iconSilver.png']);
    bagUiSilverIcon.scale.set(.75, .75);
    bagUiCurrencySilver.addChild(bagUiSilverIcon);
    let bagUiSilverText = new BitmapText(getInventory().currency.silver.toString(), textStyle);
    bagUiSilverText.x = bagUiSilverIcon.x + 14;
    bagUiSilverText.y = bagUiSilverIcon.y - 3;
    bagUiCurrencySilver.addChild(bagUiSilverText);
    bagUiCurrency.addChild(bagUiCurrencySilver);

    // Copper Container for Icon & Amount
    let bagUiCurrencyCopper = new Container();
    bagUiCurrencyCopper.x = 70;
    let bagUiCopperIcon = new Sprite(getIconSheet()['iconCopper.png']);
    bagUiCopperIcon.scale.set(.75, .75);
    bagUiCurrencyCopper.addChild(bagUiCopperIcon);
    let bagUiCopperText = new BitmapText(getInventory().currency.copper.toString(), textStyle);
    bagUiCopperText.x = bagUiCopperIcon.x + 14;
    bagUiCopperText.y = bagUiCopperIcon.y - 3;
    bagUiCurrencyCopper.addChild(bagUiCopperText);
    bagUiCurrency.addChild(bagUiCurrencyCopper);

    bagUi.addChild(bagUiCurrency);

    // Bag UI Inventory Cubbies.
    let cubbyRowCount = Math.floor(bagUiBg.height / cubbySize) - 1;
    let cubbiesPerRow = Math.floor(bagUiBg.width / cubbySize);

    // Cubby Row
    let bagCubbyRows = [];
    for (let i = 0; i < cubbyRowCount; i++) {
        bagCubbyRows[i] = new Container();
        let bagCubbyRow = bagCubbyRows[i];
        bagCubbyRow.x = bagUiBg.x + bagUiMargin + bagUiBg.line.width;
        bagCubbyRow.y = bagUiBg.y + bagUiMargin + bagUiBg.line.width;
        bagCubbyRow.width = bagUiBg.width - (bagUiMargin * 2) - (bagUiBg.line.width * 2);
        bagUi.addChild(bagCubbyRow);
    }

    // Individual Cubby
    bagCubbyRows.forEach(function (row, i) {
        for (let j = 0; j < cubbiesPerRow; j++) {
            let bagCubby = new Container();
            bagCubby.interactive = true;
            bagCubby.x = (bagUiMargin * j) + (cubbySize * j);
            bagCubby.y = (bagUiMargin * i) + (cubbySize * i);
            let bagCubbyBg = new Graphics();
            bagCubbyBg.beginFill('0x000000', .5);
            bagCubbyBg.drawRect(0, 0, cubbySize, cubbySize);
            bagCubbyBg.interactive = true;
            bagCubby.addChild(bagCubbyBg);
            row.addChild(bagCubby);
            getInventoryItems(getInventory().items.push(
                {
                    item: null,
                    cubby: bagCubby,
                    icon: null,
                }
            ))
        }
    })

    // Add items to cubbies.
    setInventoryItem(14, 'clothChest');
    setInventoryItem(1, 'clothHands');
    setInventoryItem(20, 'clothShoulders');
    setInventoryItem(3, 'clothFeet');

    // Add Sprites from Inventory to each Cubby Container.
    getInventoryItems().forEach(function (inventoryItem) {
        if (inventoryItem.item) {
            inventoryItem.icon = new Sprite(itemsMap[inventoryItem.item].icon)
            let itemIcon = inventoryItem.icon;
            itemIcon.scale.set(bagUiItemScale);
            itemIcon.x = (cubbySize - itemIcon.width) / 2;
            itemIcon.y = (cubbySize - itemIcon.height) / 2;
            inventoryItem.cubby.addChild(itemIcon);
        }
    })

    let bagUiOpen = false;
    bagIcon.on('click', function () {
        if (!bagUiOpen) {
            bagIcon.texture = getIconSheet()['iconBagSelected.png'];
            bagIcon.x -= bagIconScale;
            bagIcon.y -= bagIconScale;
            bagUi.visible = true;
            bagUiOpen = true;
        } else {
            bagIcon.texture = getIconSheet()['iconBag.png'];
            bagIcon.x += bagIconScale;
            bagIcon.y += bagIconScale;
            bagUi.visible = false;
            bagUiOpen = false;
        }
    })

    return bagUi;
}

export function inventoryCubbyMenus() {
    getInventoryItems().forEach(function (inventoryItem, i) {
        let cubby = inventoryItem.cubby;

        // Generate Cubby Menu
        let popupMenu = new Container();
        popupMenu.visible = false;
        popupMenu.x = bagUiBg.x + cubby.x + (bagUiMargin * 2) + (cubbySize / 2) - itemMenuWidth;
        popupMenu.y = bagUiBg.y + cubby.y + cubbySize + (bagUiMargin * 2) + 1;
        popupMenus.addChild(popupMenu);

        let menuItems = [
            {
                label: 'equip',
                menuItem: {},
            },
            {
                label: 'destroy',
                menuItem: {},
            }
        ]

        // Generate Cubby Menu Items
        menuItems.forEach(function (item, i) {
            item.menuItem = new Container();
            item.menuItem.y = (itemMenuHeight * i);
            let itemBg = new Graphics();
            itemBg.beginFill('0x000000');
            itemBg.drawRect(0, 0, itemMenuWidth, itemMenuHeight);
            itemBg.interactive = true;
            let itemText = new BitmapText(item.label, textStyle);
            itemText.x = 10;
            itemText.y = 8;
            item.menuItem.addChild(itemBg);
            item.menuItem.addChild(itemText);
            popupMenu.addChild(item.menuItem);
            itemBg.on('mouseover', function () {
                itemBg.clear();
                itemBg.beginFill('0x707070');
                itemBg.drawRect(0, 0, itemMenuWidth, itemMenuHeight);
            })
            itemBg.on('mouseout', function () {
                itemBg.clear();
                itemBg.beginFill('0x000000');
                itemBg.drawRect(0, 0, itemMenuWidth, itemMenuHeight);
            })
        })
    })
}

export function inventoryCubbyTooltips() {
    getInventoryItems().forEach(function (inventoryItem, i) {
        let cubby = inventoryItem.cubby;
        let tooltipWidth = 250;
        let tooltipHeight = 30;

        let tooltip = new Container();
        tooltip.visible = false;
        tooltip.x = bagUiBg.x + cubby.x + bagUiBg.line.width + bagUiMargin - tooltipWidth + (cubbySize / 2);
        tooltip.y = bagUiBg.y + cubby.y + cubbySize + bagUiBg.line.width + bagUiMargin;
        if (inventoryItem.item) {

            // Name plate for Inventory Item
            let tooltipName = new Container();
            let tooltipNameBg = new Graphics();
            tooltipNameBg.beginFill('0x000000', .75);
            tooltipNameBg.drawRect(0, 0, tooltipWidth, tooltipHeight);
            tooltipName.addChild(tooltipNameBg);

            let itemName = itemsMap[inventoryItem.item].name;
            let tooltipNameText = new BitmapText(itemName, textStyle);
            tooltipNameText.x = 10;
            tooltipNameText.y = 7;
            tooltipNameText.tint = '0x52fc03';
            tooltipName.addChild(tooltipNameText);

            tooltip.addChild(tooltipName);

            // Stat Plates for Each Stat with a value;
            let itemStats = itemsMap[inventoryItem.item].stats;
            let itemStatsArray = [];
            Object.keys(itemStats).map(function (stat, i) {
                if (itemStats[stat] > 0) {
                    itemStatsArray.push(stat + ' ' + itemStats[stat]);
                }
            })
            itemStatsArray.forEach(function (statString, i) {
                let tooltipStat = new Container();
                tooltipStat.y = tooltipHeight + ((tooltipHeight / 1.2) * i);
                let tooltipStatBg = new Graphics();
                tooltipStatBg.beginFill('0x000000', .75);
                tooltipStatBg.drawRect(0, 0, tooltipWidth, tooltipHeight / 1.2);
                tooltipStat.addChild(tooltipStatBg);

                let tooltipStatText = new BitmapText(statString, textStyle);
                tooltipStatText.x = tooltipNameText.x;
                tooltipStatText.y = 3;
                tooltipStat.addChild(tooltipStatText);
                tooltip.addChild(tooltipStat);
            })
        }

        tooltips.addChild(tooltip);

        cubby.on('mouseover', function () {
            if (inventoryItem.item && !popupMenus.children[i].visible) {
                tooltips.visible = true;
                tooltips.children[i].visible = true;
            }
        })
        cubby.on('mouseout', function () {
            if (inventoryItem.item) {
                tooltips.visible = false;
                tooltips.children[i].visible = false;
            }
        })
        cubby.on('click', function () {
            if (inventoryItem.item) {
                if (tooltips.children[i].visible) {
                    tooltips.visible = false;
                    tooltips.children[i].visible = false;
                } else {
                    tooltips.visible = true;
                    tooltips.children[i].visible = true;
                }
            }
        })
    })
}

export function inventoryOccupiedCubbies() {
    getInventoryItems().forEach(function (inventoryItem, i) {
        if (inventoryItem.item) {
            let cubby = inventoryItem.cubby;
            let cubbyBg = cubby.children[0];
            let popupMenu = popupMenus.children[i];

            cubby.on('click', function () {
                if (!popupMenu.visible) {
                    let clonedPopupMenus = popupMenus.children.slice();
                    clonedPopupMenus.splice(i, 1);
                    clonedPopupMenus.forEach(function (menu) {
                        menu.visible = false;
                    })
                    getInventoryItems().forEach(function (inventoryItem) {
                        let otherCubbyBg = inventoryItem.cubby.children[0];
                        otherCubbyBg.clear();
                        otherCubbyBg.beginFill('0x000000', .5);
                        otherCubbyBg.drawRect(0, 0, cubbySize, cubbySize);
                    })
                    popupMenu.visible = true;
                    popupMenus.visible = true;
                    cubbyBg.clear();
                    cubbyBg.beginFill('0x00d9ff');
                    cubbyBg.drawRect(0, 0, cubbySize, cubbySize);
                } else {
                    popupMenu.visible = false;
                    popupMenus.visible = false;
                    cubbyBg.clear();
                    cubbyBg.beginFill('0x707070');
                    cubbyBg.drawRect(0, 0, cubbySize, cubbySize);
                }
            });

            cubby.on('mouseover', function () {
                if (!popupMenu.visible) {
                    cubbyBg.clear();
                    cubbyBg.beginFill('0x707070');
                    cubbyBg.drawRect(0, 0, cubbySize, cubbySize);
                }
            })

            cubby.on('mouseout', function () {
                if (!popupMenu.visible) {
                    cubbyBg.clear();
                    cubbyBg.beginFill('0x000000', .5);
                    cubbyBg.drawRect(0, 0, cubbySize, cubbySize);
                }
            })
        }
    })

}

export function inventoryCubbyMenuFunctions() {
    getInventoryItems().forEach(function (inventoryItem, i) {
        let cubby = inventoryItem.cubby;
        let popupMenu = popupMenus.children[i];
        let equip = popupMenu.children[0].children[0];
        let itemName = getInventoryItems()[i].item;
        equip.on('click', function () {
            let itemSlot = itemsMap[itemName].slot;
            let equippedSlot = getEquippedSlot(itemSlot);
            equippedSlot.item = itemName;

            let newIcon = new Sprite(itemsMap[itemName].icon);
            newIcon.scale.set(bagUiItemScale);
            newIcon.x = (cubbySize - newIcon.width) / 2;
            newIcon.y = (cubbySize - newIcon.height) / 2;
            equippedSlot.cubby.addChild(newIcon);

            createNewPlayerArmor(itemSlot);

            let oldIcon = getInventoryItems()[i].icon;
            setInventoryItem(i, null);
            oldIcon.destroy();
            popupMenu.visible = false;
            cubby.removeAllListeners();

            let cubbyBg = cubby.children[0];
            cubbyBg.clear();
            cubbyBg.beginFill('0x000000', .5);
            cubbyBg.drawRect(0, 0, cubbySize, cubbySize);
        })

        let destroy = popupMenu.children[1].children[0];
        destroy.on('click', function () {
            let itemIcon = getInventoryItems()[i].icon;
            setInventoryItem(i, null);
            itemIcon.destroy();
            popupMenu.visible = false;
            cubby.removeAllListeners();

            let cubbyBg = cubby.children[0];
            cubbyBg.clear();
            cubbyBg.beginFill('0x000000', .5);
            cubbyBg.drawRect(0, 0, cubbySize, cubbySize);
        })
    });
}