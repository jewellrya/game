import { gameScene } from '../../_game.js';
import { getBg, setBgX, setBgY } from '../../map/bg.js';
import { entities } from '../../entities/entities.js';

export function moveEnvironment(x, y) {
    setBgX(getBg().x += x);
    setBgY(getBg().y += y);

    entities.forEach(entity => {
        entity.x += x;
        entity.y += y;
        entity.interactBox.x += x;
        entity.interactBox.y += y;
        if (entity.aggroBox) {
            entity.aggroBox.x += x;
            entity.aggroBox.y += y;
        }
    })

    gameScene.children.sort((a, b) => {
        return a.interactBox.y - b.interactBox.y;
    })
}