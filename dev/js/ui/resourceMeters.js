import { Container, Graphics, app } from '../_game.js';
import { playerStats } from '../playerData.js';

let resourceMeters = {
    types: {
        health: {},
        fatigue: {},
        soul: {},
    }
};

export function resourceMeters_setup() {

    let resourceMetersContainer = new Container();

    resourceMeters.y = 16;
    resourceMeters.margin = 4;
    resourceMeters.height = 5;
    resourceMeters.innerOffset = 0;

    function drawResourceMeter(resourceName, color) {
        resourceMeters.types[resourceName] = {};
        let meter = resourceMeters.types[resourceName];

        meter.outer = new Graphics();
        meter.outer.beginFill('0x000000', .5);
        meter.outer.drawRect(0, 0, playerStats[resourceName] * 2, resourceMeters.height);
        resourceMetersContainer.addChild(meter.outer);

        meter.inner = new Graphics();
        meter.inner.beginFill(color);
        meter.inner.drawRect(0, 0, playerStats[resourceName] * 2 - resourceMeters.innerOffset * 2, resourceMeters.height - resourceMeters.innerOffset * 2);
        meter.inner.width = playerStats[resourceName] * 2 - resourceMeters.innerOffset * 2;
        meter.inner.height = resourceMeters.height - resourceMeters.innerOffset * 2;
        meter.inner.endFill();
        resourceMetersContainer.addChild(meter.inner);
    }

    drawResourceMeter('soul', '0x00d9ff');
    drawResourceMeter('fatigue', '0xffff00');
    drawResourceMeter('health', '0xff0000');

    resourceMeters.types.soul.outer.y = app.view.height - resourceMeters.types.soul.outer.height - resourceMeters.y;
    resourceMeters.types.soul.inner.y = resourceMeters.types.soul.outer.y + resourceMeters.innerOffset;
    resourceMeters.types.fatigue.outer.y = resourceMeters.types.soul.outer.y - resourceMeters.types.fatigue.outer.height - resourceMeters.margin;
    resourceMeters.types.fatigue.inner.y = resourceMeters.types.fatigue.outer.y + resourceMeters.innerOffset;
    resourceMeters.types.health.outer.y = resourceMeters.types.fatigue.outer.y - resourceMeters.types.health.outer.height - resourceMeters.margin;
    resourceMeters.types.health.inner.y = resourceMeters.types.health.outer.y + resourceMeters.innerOffset;
    resourceMeters.x = Math.min((app.view.width - resourceMeters.types.fatigue.outer.width) / 2, (app.view.width - resourceMeters.types.health.outer.width) / 2, (app.view.width - resourceMeters.types.soul.outer.width) / 2);

    function calcResourceX(width) {
        let biggestResourceWidth = Math.max(resourceMeters.types.fatigue.outer.width, resourceMeters.types.soul.outer.width, resourceMeters.types.health.outer.width);
        if (width === biggestResourceWidth) {
            return resourceMeters.x;
        } else {
            return resourceMeters.x + ((biggestResourceWidth - width) / 2);
        }
    }

    Object.keys(resourceMeters.types).map(type => {
        resourceMeters.types[type].outer.x = calcResourceX(resourceMeters.types[type].outer.width);
        resourceMeters.types[type].inner.x = calcResourceX(resourceMeters.types[type].inner.width);
    });

    return resourceMetersContainer;
};

export let getResourceMeters = () => resourceMeters;
export let setFatigue = (val) => (resourceMeters.types.fatigue.inner.width = val);
export let setHealth = (val) => (resourceMeters.types.health.inner.width = val);
export let setSoul = (val) => (resourceMeters.types.soul.inner.width = val);