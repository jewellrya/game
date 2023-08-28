precision mediump float;

uniform sampler2D uSampler;
varying vec2 vTextureCoord;

const float shadowIntensity = 0.5;  // Adjust this for the strength of the shadows

void main() {
    // Sample the original color
    vec4 originalColor = texture2D(uSampler, vTextureCoord);
    
    // Calculate the shadow intensity based on pixel position
    float shadowValue = (1.0 - vTextureCoord.y) * shadowIntensity;
    
    // Darken the original color based on the shadow intensity
    vec4 shadowedColor = originalColor * (1.0 - shadowValue);
    
    gl_FragColor = shadowedColor;
}