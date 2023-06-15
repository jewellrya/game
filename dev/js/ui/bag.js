import { app, Container, Graphics, BitmapText, Sprite } from '../_game.js';
import { getInventory, getInventoryItems, setInventoryItem, getEquippedSlot } from '../playerData.js';
import { getIconSheet } from '../sheets/iconSheet.js';
import { textStyle } from './textStyle.js';
import { itemsMap } from '../itemMap.js';
import { getPopupMenus } from './popupMenus.js';
import { createNewPlayerArmor } from '../player.js';
import { getTooltips } from './tooltips.js';
import { uiLayout, uiStyle } from './uiDesign.js';
import { cubbyState } from './cubby.js';

let bagIcon;
let bagUiBg;
let popupMenus;
let tooltips;

export function bagButton_setup() {
    // bagIcon UI Button
    bagIcon = new Sprite(getIconSheet()['iconBag.png']);
    bagIcon.scale.set(uiLayout.uiButton.scale, uiLayout.uiButton.scale);
    bagIcon.x = app.view.width - bagIcon.width - uiLayout.uiButton.margin;
    bagIcon.y = app.view.height - bagIcon.height - uiLayout.uiButton.margin;
    bagIcon.interactive = true;
    return bagIcon;
}

export function bag_setup() {
    popupMenus = getPopupMenus();
    tooltips = getTooltips();

    // Bag UI Window
    let bagUi = new Container();
    bagUi.visible = false;
    bagUiBg = new Graphics();
    bagUiBg.lineStyle(4, 0x000000, .5, 0);
    bagUiBg.beginFill(uiStyle.colors.black, .3);
    bagUiBg.drawRect(0, 0, 168, uiLayout.uiWindow.height);
    bagUiBg.x = app.view.width - bagUiBg.width - 10;
    bagUiBg.y = uiLayout.uiWindow.y;
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
    let cubbyRowCount = Math.floor(bagUiBg.height / uiLayout.cubby.size) - 1;
    let cubbiesPerRow = Math.floor(bagUiBg.width / uiLayout.cubby.size);

    // Cubby Row
    let bagCubbyRows = [];
    for (let i = 0; i < cubbyRowCount; i++) {
        bagCubbyRows[i] = new Container();
        let bagCubbyRow = bagCubbyRows[i];
        bagCubbyRow.x = bagUiBg.x + uiLayout.uiWindow.margin + bagUiBg.line.width;
        bagCubbyRow.y = bagUiBg.y + uiLayout.uiWindow.margin + bagUiBg.line.width;
        bagCubbyRow.width = bagUiBg.width - (uiLayout.uiWindow.margin * 2) - (bagUiBg.line.width * 2);
        bagUi.addChild(bagCubbyRow);
    }

    // Individual Cubby
    bagCubbyRows.forEach(function (row, i) {
        for (let j = 0; j < cubbiesPerRow; j++) {
            let cubby = new Container();
            cubby.interactive = true;
            cubby.x = (uiLayout.uiWindow.margin * j) + (uiLayout.cubby.size * j);
            cubby.y = (uiLayout.uiWindow.margin * i) + (uiLayout.cubby.size * i);
            let cubbyBg = new Graphics();
            cubbyState(cubbyBg);
            cubbyBg.interactive = true;
            cubby.addChild(cubbyBg);
            row.addChild(cubby);
            getInventoryItems(getInventory().items.push(
                {
                    item: null,
                    cubby: cubby,
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
            itemIcon.scale.set(uiLayout.cubby.itemScale);
            itemIcon.x = (uiLayout.cubby.size - itemIcon.width) / 2;
            itemIcon.y = (uiLayout.cubby.size - itemIcon.height) / 2;
            inventoryItem.cubby.addChild(itemIcon);
        }
    })

    let bagUiOpen = false;
    bagIcon.on('click', function () {
        if (!bagUiOpen) {
            bagIcon.texture = getIconSheet()['iconBagSelected.png'];
            bagIcon.x -= uiLayout.uiButton.scale;
            bagIcon.y -= uiLayout.uiButton.scale;
            bagUi.visible = true;
            bagUiOpen = true;
        } else {
            bagIcon.texture = getIconSheet()['iconBag.png'];
            bagIcon.x += uiLayout.uiButton.scale;
            bagIcon.y += uiLayout.uiButton.scale;
            bagUi.visible = false;
            bagUiOpen = false;
        }
    })
    return bagUi;
}

export function bagPopupMenus_setup() {
    let popupMenusBag = new Container();
    getInventoryItems().forEach(function (inventoryItem, i) {
        let cubby = inventoryItem.cubby;

        // Generate Cubby Menu
        let popupMenu = new Container();
        popupMenu.visible = false;
        popupMenu.x = bagUiBg.x + cubby.x + (uiLayout.uiWindow.margin * 2) + (uiLayout.cubby.size / 2) - uiLayout.popupMenu.width;
        popupMenu.y = bagUiBg.y + cubby.y + uiLayout.cubby.size + (uiLayout.uiWindow.margin * 2) + 1;
        popupMenusBag.addChild(popupMenu);

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
            item.menuItem.y = (uiLayout.popupMenu.height * i);
            let itemBg = new Graphics();
            itemBg.beginFill(uiStyle.colors.black);
            itemBg.drawRect(0, 0, uiLayout.popupMenu.width, uiLayout.popupMenu.height);
            itemBg.interactive = true;
            let itemText = new BitmapText(item.label, textStyle);
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
    popupMenus.bagUi = popupMenusBag;
    popupMenus.bagUi.visible = false;
    return popupMenus.bagUi;
}

export function bagTooltips_setup() {
    getInventoryItems().forEach(function (inventoryItem, i) {
        let cubby = inventoryItem.cubby;

        let tooltip = new Container();
        tooltip.visible = false;
        tooltip.x = bagUiBg.x + cubby.x + bagUiBg.line.width + uiLayout.uiWindow.margin - uiLayout.tooltip.width + (uiLayout.cubby.size / 2);
        tooltip.y = bagUiBg.y + cubby.y + uiLayout.cubby.size + bagUiBg.line.width + uiLayout.uiWindow.margin;
        if (inventoryItem.item) {

            // Name plate for Inventory Item
            let tooltipName = new Container();
            let tooltipNameBg = new Graphics();
            tooltipNameBg.beginFill(uiStyle.colors.black, .75);
            tooltipNameBg.drawRect(0, 0, uiLayout.tooltip.width, uiLayout.tooltip.height);
            tooltipName.addChild(tooltipNameBg);

            let itemName = itemsMap[inventoryItem.item].name;
            let tooltipNameText = new BitmapText(itemName, textStyle);
            tooltipNameText.x = 10;
            tooltipNameText.y = 7;
            tooltipNameText.tint = uiStyle.colors.green;
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
                tooltipStat.y = uiLayout.tooltip.height + ((uiLayout.tooltip.height / 1.2) * i);
                let tooltipStatBg = new Graphics();
                tooltipStatBg.beginFill(uiStyle.colors.black, .75);
                tooltipStatBg.drawRect(0, 0, uiLayout.tooltip.width, uiLayout.tooltip.height / 1.2);
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
            if (inventoryItem.item && !popupMenus.bagUi.children[i].visible) {
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

export function bagPopulateCubbies() {
    getInventoryItems().forEach(function (inventoryItem, i) {
        if (inventoryItem.item) {
            let cubby = inventoryItem.cubby;
            let cubbyBg = cubby.children[0];
            let popupMenu = popupMenus.bagUi.children[i];

            cubby.on('click', function () {
                if (!popupMenu.visible) {
                    let clonedPopupMenus = popupMenus.bagUi.children.slice();
                    clonedPopupMenus.splice(i, 1);
                    clonedPopupMenus.forEach(function (menu) {
                        menu.visible = false;
                    })
                    getInventoryItems().forEach(function (inventoryItem) {
                        let otherCubbyBg = inventoryItem.cubby.children[0];
                        otherCubbyBg.clear();
                        otherCubbyBg.beginFill(uiStyle.colors.black, .5);
                        otherCubbyBg.drawRect(0, 0, uiLayout.cubby.size, uiLayout.cubby.size);
                    })
                    popupMenu.visible = true;
                    popupMenus.bagUi.visible = true;
                    cubbyBg.clear();
                    cubbyState(cubbyBg, 'selected');
                } else {
                    popupMenu.visible = false;
                    popupMenus.bagUi.visible = false;
                    cubbyBg.clear();
                    cubbyState(cubbyBg, 'hover');
                }
            });

            cubby.on('mouseover', function () {
                if (!popupMenu.visible) {
                    cubbyBg.clear();
                    cubbyState(cubbyBg, 'hover');
                }
            })

            cubby.on('mouseout', function () {
                if (!popupMenu.visible) {
                    cubbyBg.clear();
                    cubbyState(cubbyBg);
                }
            })
        }
    })

}

export function bagPopupMenuInteraction() {
    getInventoryItems().forEach(function (inventoryItem, i) {
        let cubby = inventoryItem.cubby;
        let popupMenu = popupMenus.bagUi.children[i];
        let equip = popupMenu.children[0].children[0];
        let itemName = getInventoryItems()[i].item;
        equip.on('click', function () {
            let itemSlot = itemsMap[itemName].slot;
            let equippedSlot = getEquippedSlot(itemSlot);
            equippedSlot.item = itemName;

            let newIcon = new Sprite(itemsMap[itemName].icon);
            newIcon.scale.set(uiLayout.cubby.itemScale);
            newIcon.x = (uiLayout.cubby.size - newIcon.width) / 2;
            newIcon.y = (uiLayout.cubby.size - newIcon.height) / 2;
            equippedSlot.cubby.addChild(newIcon);

            createNewPlayerArmor(itemSlot);

            let oldIcon = getInventoryItems()[i].icon;
            setInventoryItem(i, null);
            oldIcon.destroy();
            popupMenu.visible = false;
            cubby.removeAllListeners();

            let cubbyBg = cubby.children[0];
            cubbyBg.clear();
            cubbyState(cubbyBg);;
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
            cubbyState(cubbyBg, 'hover');
        })
    });
}