// Adjust Xanchors to center the Blender camera renders.
// Globally set since all renders should use the same cameras.
export let textureXAnchors = {
    'U': -0.05,
    'UR': -0.03,
    'R': 0,
    'DR': 0.05,
    'D': 0.03,
    'DL': 0.03,
    'L': 0,
    'UL': -0.03,
}

export function changeTextureAnchor(texture, textureDirection) {
    texture.anchor.set(textureXAnchors[textureDirection], 0);
}

export function changeTextureAnchor_complex(texture, textureDirection, textureAnchors) {
    texture.anchor.set(textureAnchors[textureDirection].x, textureAnchors[textureDirection].y);
}