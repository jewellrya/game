import { app, Sprite, Graphics, Container, BitmapText } from '../_game.js';
import { getIconSheet } from '../sheets/iconSheet.js';
import { playerName, playerStats, setEquippedCubby, getEquippedCubby, getEquipped, getEquippedSlot } from '../playerData.js';
import { textStyle } from './textStyle.js';
import { uiData } from './ui.js';

let characterIcon;
let characterUi;

export function characterButton_setup() {
    // characterIcon UI Button    
    characterIcon = new Sprite(getIconSheet()['iconCharacter.png']);
    characterIcon.scale.set(uiData.uiButton.scale, uiData.uiButton.scale);
    characterIcon.x = uiData.uiButton.margin;
    characterIcon.y = app.view.height - characterIcon.height - uiData.uiButton.margin;
    characterIcon.interactive = true;
    return characterIcon;
}

export function character_setup() {

    // Character UI Window
    characterUi = new Container();
    characterUi.visible = false;
    let characterUiBg = new Graphics();
    characterUiBg.lineStyle(4, 0x000000, .5, 0);
    characterUiBg.beginFill('0x000000', .3);
    characterUiBg.drawRect(0, 0, 250, uiData.uiWindow.height);
    characterUiBg.x = 10;
    characterUiBg.y = uiData.uiWindow.y;
    characterUi.addChild(characterUiBg);

    // Charater Name plate at the top of the Character UI
    let characterUiNamePlate = new Container();
    characterUiNamePlate.x = characterUiBg.x;
    characterUiNamePlate.y = characterUiBg.y;
    let characterUiNamePlateBg = new Graphics();
    characterUiNamePlateBg.beginFill('0x000000');
    characterUiNamePlateBg.drawRect(0, 0, characterUiBg.width, 30);
    characterUiNamePlate.addChild(characterUiNamePlateBg);
    let characterUiNamePlateText = new BitmapText(playerName, textStyle);
    characterUiNamePlateText.x = 10;
    characterUiNamePlateText.y = 7;
    characterUiNamePlate.addChild(characterUiNamePlateText);
    characterUi.addChild(characterUiNamePlate);

    // Section that shows player stats
    let characterUiStats = new Container();
    characterUiStats.x = characterUiBg.x + 7;
    characterUiStats.y = characterUiBg.y + characterUiNamePlateBg.height + uiData.uiWindow.margin;
    let characterUiStatsBg = new Graphics();
    characterUiStatsBg.beginFill('0x000000', .5);
    characterUiStatsBg.drawRect(0, 0, 85, 175);
    characterUiStats.addChild(characterUiStatsBg);
    Object.keys(playerStats).map(function (stat, i) {
        if (i <= 6) {
            let statCount = new Container();
            statCount.x = 10;
            statCount.y = (characterUiStatsBg.height / 6) + (15 * i);
            let label = new BitmapText(stat.slice(0, 3), textStyle);
            statCount.addChild(label);
            let amount = new BitmapText(playerStats[stat].toString(), textStyle);
            amount.x = 40;
            statCount.addChild(amount);
            characterUiStats.addChild(statCount);
        }
    })
    characterUi.addChild(characterUiStats);
    let characterUiArmor = new Container();
    characterUiArmor.x = characterUiStats.x + characterUiStatsBg.width + uiData.uiWindow.margin;
    characterUiArmor.y = characterUiStats.y;

    // Generate Cubbies for Equipped Items
    function createEquippedCubby(slot, defaultSprite, x, y) {
        setEquippedCubby(slot, new Container());
        let cubby = getEquippedCubby(slot);

        cubby.x = x + ((characterUiBg.width - characterUiStatsBg.width - (characterUiBg.line.width * 2) - ((uiData.cubby.size * 2) + (uiData.uiWindow.margin * 4))) / 2);
        cubby.y = y + characterUiStatsBg.height - (characterUiBg.line.width * 2) - (((uiData.cubby.size * 4) + (uiData.uiWindow.margin * 4)));
        let cubbyBg = new Graphics();
        cubbyBg.beginFill('0x000000', .5);
        cubbyBg.drawRect(0, 0, uiData.cubby.size, uiData.cubby.size);
        cubby.addChild(cubbyBg);
        let cubbyDefaultIcon = new Sprite(getIconSheet()[defaultSprite]);
        cubbyDefaultIcon.scale.set(1.5, 1.5);
        cubbyDefaultIcon.x = ((cubby.width - cubbyDefaultIcon.width) / 2);
        cubbyDefaultIcon.y = ((cubby.height - cubbyDefaultIcon.height) / 2);
        cubby.addChild(cubbyDefaultIcon);
        characterUiArmor.addChild(cubby);
    }

    createEquippedCubby('head', 'iconHead.png', 0, 0);
    createEquippedCubby('shoulders', 'iconShoulders.png', uiData.cubby.size + uiData.uiWindow.margin, 0);
    createEquippedCubby('chest', 'iconChest.png', 0, uiData.cubby.size + uiData.uiWindow.margin);
    createEquippedCubby('hands', 'iconHands.png', uiData.cubby.size + uiData.uiWindow.margin, uiData.cubby.size + uiData.uiWindow.margin);
    createEquippedCubby('legs', 'iconLegs.png', 0, (uiData.cubby.size + 3) * 2);
    createEquippedCubby('feet', 'iconFeet.png', uiData.cubby.size + uiData.uiWindow.margin, (uiData.cubby.size + uiData.uiWindow.margin) * 2);
    createEquippedCubby('rightHand', 'iconWeapon.png', (-uiData.cubby.size / 2), (uiData.cubby.size + uiData.uiWindow.margin) * 3);
    createEquippedCubby('leftHand', 'iconShield.png', (-uiData.cubby.size / 2) + uiData.cubby.size + uiData.uiWindow.margin, (uiData.cubby.size + uiData.uiWindow.margin) * 3);
    createEquippedCubby('resourceItem', 'iconArrow.png', (-uiData.cubby.size / 2) + ((uiData.cubby.size + uiData.uiWindow.margin) * 2), (uiData.cubby.size + uiData.uiWindow.margin) * 3);

    characterUi.addChild(characterUiArmor);

    let characterUiExtra = new Container();
    characterUiExtra.x = characterUiStats.x;
    characterUiExtra.y = (characterUiStats.y + characterUiStatsBg.height + uiData.uiWindow.margin);
    let characterUiExtraBg = new Graphics();
    characterUiExtraBg.beginFill('0x000000', .5);
    characterUiExtraBg.drawRect(0, 0, characterUiBg.width - (uiData.uiWindow.margin * 2) - (characterUiBg.line.width * 2), characterUiBg.height - characterUiStatsBg.height - characterUiNamePlateBg.height - (uiData.uiWindow.margin * 2) - (characterUiBg.line.width * 2));
    characterUiExtra.addChild(characterUiExtraBg);
    characterUi.addChild(characterUiExtra);

    // Populate Equipped Items Cubbies
    Object.keys(getEquipped()).map(function (slot) {
        let equippedObject = getEquippedSlot(slot);
        let cubby = getEquippedCubby(slot);
        if (equippedObject.item) {
            cubby.removeChild(cubby.children[1]);
            let sprite = new Sprite(getIconSheet()['icon' + getEquippedSlot(slot).item.replace(/^(.)/, s => s.toUpperCase()) + '.png']);
            sprite.scale.set(uiData.uiButton.scale, uiData.uiButton.scale);
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
            characterIcon.x -= uiData.uiButton.scale;
            characterIcon.y -= uiData.uiButton.scale;
            characterUi.visible = true;
            characterUiOpen = true;
        } else {
            characterIcon.texture = getIconSheet()['iconCharacter.png'];
            characterIcon.x += uiData.uiButton.scale;
            characterIcon.y += uiData.uiButton.scale;
            characterUi.visible = false;
            characterUiOpen = false;
        }
    })

    return (characterUi);
}