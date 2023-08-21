import { getWorldCoords, setWorldCoordX, setWorldCoordY, redrawCoordinates } from '../../map/utilities/map_utilities.js';
import { tileSize } from '../../map/chunk/noiseMap_chunk.js';

let cumulativeDeltaX = 0;
let cumulativeDeltaY = 0;

export function updateCoordinates(xSpeed, ySpeed) {
    let worldCoords = getWorldCoords();

    // Update cumulative movement
    if (xSpeed > 0) {
        cumulativeDeltaX += xSpeed;
        while (cumulativeDeltaX >= tileSize) {
            setWorldCoordX(worldCoords.x + 1);
            cumulativeDeltaX -= tileSize;
        }
    } else if (xSpeed < 0) {
        cumulativeDeltaX += xSpeed;  // xSpeed is negative, so this is subtraction
        while (cumulativeDeltaX <= -tileSize) {
            setWorldCoordX(worldCoords.x - 1);
            cumulativeDeltaX += tileSize;
        }
    }

    if (ySpeed > 0) {
        cumulativeDeltaY += ySpeed;
        while (cumulativeDeltaY >= tileSize) {
            setWorldCoordY(worldCoords.y + 1);
            cumulativeDeltaY -= tileSize;
        }
    } else if (ySpeed < 0) {
        cumulativeDeltaY += ySpeed;  // ySpeed is negative, so this is subtraction
        while (cumulativeDeltaY <= -tileSize) {
            setWorldCoordY(worldCoords.y - 1);
            cumulativeDeltaY += tileSize;
        }
    }

    redrawCoordinates();
}