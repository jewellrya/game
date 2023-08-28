precision mediump float;

uniform sampler2D uSampler;
varying vec2 vTextureCoord;

const float blurSize = 0.002;  // Adjust this for the amount of glow
const float glowIntensity = 0.2;  // Adjust this for the strength of the glow

void main() {
    vec4 sum = vec4(0.0);
    vec2 texCoord = vTextureCoord;

    // Sample the central pixel
    sum += texture2D(uSampler, texCoord);

    // Sample the surrounding pixels and blur
    for (float i = -4.0; i <= 4.0; i++) {
        for (float j = -4.0; j <= 4.0; j++) {
            vec2 offset = vec2(i, j) * blurSize;
            sum += texture2D(uSampler, texCoord + offset);
        }
    }

    // Combine central pixel and blurred pixels
    vec4 finalColor = sum / 81.0;

    // Calculate a luminance value (brightness) of the pixel
    float luminance = dot(finalColor.rgb, vec3(0.299, 0.587, 0.114));

    // Enhance glow for brighter areas (sunlight effect)
    vec4 enhancedGlow = finalColor + vec4(1.0, 0.5, 0.0, 0.0) * luminance;

    // Add the enhanced glow color to the original color
    vec4 originalColor = texture2D(uSampler, texCoord);
    vec4 glowColor = originalColor + enhancedGlow * glowIntensity;

    gl_FragColor = glowColor;
}