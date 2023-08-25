import { getWorldCoords, setWorldCoordX, setWorldCoordY, redrawCoordinates } from '../../map/utilities/map_utilities.js';
import { chunkSampleSize } from '../../map/macro/shaderMaps.js';

let cumulativeDeltaX = 0;
let cumulativeDeltaY = 0;

export function updateCoordinates(xSpeed, ySpeed) {
    let worldCoords = getWorldCoords();

    // Update cumulative movement
    if (xSpeed > 0) {
        cumulativeDeltaX += xSpeed;
        while (cumulativeDeltaX >= chunkSampleSize) {
            setWorldCoordX(worldCoords.x + 1);
            cumulativeDeltaX -= chunkSampleSize;
        }
    } else if (xSpeed < 0) {
        cumulativeDeltaX += xSpeed;  // xSpeed is negative, so this is subtraction
        while (cumulativeDeltaX <= -chunkSampleSize) {
            setWorldCoordX(worldCoords.x - 1);
            cumulativeDeltaX += chunkSampleSize;
        }
    }

    if (ySpeed > 0) {
        cumulativeDeltaY += ySpeed;
        while (cumulativeDeltaY >= chunkSampleSize) {
            setWorldCoordY(worldCoords.y + 1);
            cumulativeDeltaY -= chunkSampleSize;
        }
    } else if (ySpeed < 0) {
        cumulativeDeltaY += ySpeed;  // ySpeed is negative, so this is subtraction
        while (cumulativeDeltaY <= -chunkSampleSize) {
            setWorldCoordY(worldCoords.y - 1);
            cumulativeDeltaY += chunkSampleSize;
        }
    }

    redrawCoordinates();
}