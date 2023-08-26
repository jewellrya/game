import { getWorldCoords, setWorldCoordX, setWorldCoordY, getPlayerChunkCoords, setPlayerChunkCoordX, setPlayerChunkCoordY, redrawCoordinates, checkPlayerChunk } from '../../map/utilities/map_utilities.js';
import { chunkTileSize } from '../../map/macro/shaderMaps.js';

let cumulativeDeltaX = 0;
let cumulativeDeltaY = 0;

export function updateCoordinates(xSpeed, ySpeed) {
    let worldCoords = getWorldCoords();
    let playerChunkCoords = getPlayerChunkCoords();

    // Update cumulative movement
    if (xSpeed > 0) {
        cumulativeDeltaX += xSpeed;
        while (cumulativeDeltaX >= chunkTileSize) {
            setWorldCoordX(worldCoords.x + 1);
            setPlayerChunkCoordX(playerChunkCoords.x + 1);
            cumulativeDeltaX -= chunkTileSize;
        }
    } else if (xSpeed < 0) {
        cumulativeDeltaX += xSpeed;  // xSpeed is negative, so this is subtraction
        while (cumulativeDeltaX <= -chunkTileSize) {
            setWorldCoordX(worldCoords.x - 1);
            setPlayerChunkCoordX(playerChunkCoords.x - 1);
            cumulativeDeltaX += chunkTileSize;
        }
    }

    if (ySpeed > 0) {
        cumulativeDeltaY += ySpeed;
        while (cumulativeDeltaY >= chunkTileSize) {
            setWorldCoordY(worldCoords.y + 1);
            setPlayerChunkCoordY(playerChunkCoords.y + 1);
            cumulativeDeltaY -= chunkTileSize;
        }
    } else if (ySpeed < 0) {
        cumulativeDeltaY += ySpeed;  // ySpeed is negative, so this is subtraction
        while (cumulativeDeltaY <= -chunkTileSize) {
            setWorldCoordY(worldCoords.y - 1);
            setPlayerChunkCoordY(playerChunkCoords.y - 1);
            cumulativeDeltaY += chunkTileSize;
        }
    }

    checkPlayerChunk();
    redrawCoordinates();
}