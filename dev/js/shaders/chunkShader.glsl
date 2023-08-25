precision highp float;

vec4 mod289(vec4 x)
{
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 permute(vec4 x)
{
  return mod289(((x*34.0)+1.0)*x);
}

vec4 taylorInvSqrt(vec4 r)
{
  return 1.79284291400159 - 0.85373472095314 * r;
}

vec2 fade(vec2 t) {
  return t*t*t*(t*(t*6.0-15.0)+10.0);
}

// Classic Perlin noise
float cnoise(vec2 P)
{
  vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);
  vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);
  Pi = mod289(Pi); // To avoid truncation effects in permutation
  vec4 ix = Pi.xzxz;
  vec4 iy = Pi.yyww;
  vec4 fx = Pf.xzxz;
  vec4 fy = Pf.yyww;

  vec4 i = permute(permute(ix) + iy);

  vec4 gx = fract(i * (1.0 / 41.0)) * 2.0 - 1.0 ;
  vec4 gy = abs(gx) - 0.5 ;
  vec4 tx = floor(gx + 0.5);
  gx = gx - tx;

  vec2 g00 = vec2(gx.x,gy.x);
  vec2 g10 = vec2(gx.y,gy.y);
  vec2 g01 = vec2(gx.z,gy.z);
  vec2 g11 = vec2(gx.w,gy.w);

  vec4 norm = taylorInvSqrt(vec4(dot(g00, g00), dot(g01, g01), dot(g10, g10), dot(g11, g11)));
  g00 *= norm.x;  
  g01 *= norm.y;  
  g10 *= norm.z;  
  g11 *= norm.w;  

  float n00 = dot(g00, vec2(fx.x, fy.x));
  float n10 = dot(g10, vec2(fx.y, fy.y));
  float n01 = dot(g01, vec2(fx.z, fy.z));
  float n11 = dot(g11, vec2(fx.w, fy.w));

  vec2 fade_xy = fade(Pf.xy);
  vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
  float n_xy = mix(n_x.x, n_x.y, fade_xy.y);
  return 2.3 * n_xy;
}

// Classic Perlin noise, periodic variant
float pnoise(vec2 P, vec2 rep)
{
  vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);
  vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);
  Pi = mod(Pi, rep.xyxy); // To create noise with explicit period
  Pi = mod289(Pi);        // To avoid truncation effects in permutation
  vec4 ix = Pi.xzxz;
  vec4 iy = Pi.yyww;
  vec4 fx = Pf.xzxz;
  vec4 fy = Pf.yyww;

  vec4 i = permute(permute(ix) + iy);

  vec4 gx = fract(i * (1.0 / 41.0)) * 2.0 - 1.0 ;
  vec4 gy = abs(gx) - 0.5 ;
  vec4 tx = floor(gx + 0.5);
  gx = gx - tx;

  vec2 g00 = vec2(gx.x,gy.x);
  vec2 g10 = vec2(gx.y,gy.y);
  vec2 g01 = vec2(gx.z,gy.z);
  vec2 g11 = vec2(gx.w,gy.w);

  vec4 norm = taylorInvSqrt(vec4(dot(g00, g00), dot(g01, g01), dot(g10, g10), dot(g11, g11)));
  g00 *= norm.x;  
  g01 *= norm.y;  
  g10 *= norm.z;  
  g11 *= norm.w;  

  float n00 = dot(g00, vec2(fx.x, fy.x));
  float n10 = dot(g10, vec2(fx.y, fy.y));
  float n01 = dot(g01, vec2(fx.z, fy.z));
  float n11 = dot(g11, vec2(fx.w, fy.w));

  vec2 fade_xy = fade(Pf.xy);
  vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
  float n_xy = mix(n_x.x, n_x.y, fade_xy.y);
  return 2.3 * n_xy;
}

// Imported cnoise...

uniform sampler2D macroTexture;
uniform float deviationFactor;
uniform vec2 seed;
uniform vec2 chunkCoord;
uniform float macroSize;
uniform float chunkSize;

float generateChunkNoise(vec2 position) {
    position = position;
    
    // Adjust the values for persistence, lacunarity, frequency, and amplitude as per your requirements
    float persistence = 0.6;
    float lacunarity = 2.0;
    float frequency = 0.05;
    float amplitude = 2.0;

    float total = 0.0;
    float maxValue = 0.0;
    float weight = 1.0;
    const int OCTAVES = 5;
    for (int i = 0; i < OCTAVES; i++) {
        total += cnoise(position * frequency + seed) * amplitude * weight;
        maxValue += amplitude * weight;
        weight *= persistence;
        frequency *= lacunarity;
    }
    return total / maxValue;
}

vec3 getColorForValue(float value) {
    if (value < 0.0) return vec3(0.0, 0.0, 0.0);

    if (value < 0.28) return vec3(0.0, 0.051, 0.620);
    if (value < 0.3) return vec3(0.0, 0.149, 0.694);
    if (value < 0.32) return vec3(0.0, 0.231, 0.764);
    if (value < 0.33) return vec3(0.0, 0.325, 0.838);
    if (value < 0.34) return vec3(0.0, 0.431, 0.920);
    if (value < 0.35) return vec3(0.0, 0.533, 1.0);
    if (value < 0.36) return vec3(0.109, 0.565, 0.960);
    if (value < 0.365) return vec3(0.208, 0.592, 0.925);

    if (value < 0.37) return vec3(0.298, 0.616, 0.894);
    if (value < 0.375) return vec3(0.404, 0.647, 0.859);
    if (value < 0.38) return vec3(0.518, 0.678, 0.820);
    if (value < 0.382) return vec3(0.549, 0.716, 0.820);
    if (value < 0.384) return vec3(0.580, 0.749, 0.820);

    if (value < 0.386) return vec3(0.612, 0.792, 0.824);
    if (value < 0.388) return vec3(0.655, 0.843, 0.827);
    if (value < 0.39) return vec3(0.686, 0.878, 0.827);
    if (value < 0.392) return vec3(0.733, 0.882, 0.827);
    if (value < 0.394) return vec3(0.776, 0.886, 0.827);

    if (value < 0.396) return vec3(0.816, 0.886, 0.827);
    if (value < 0.398) return vec3(0.859, 0.890, 0.827);
    if (value < 0.4) return vec3(0.902, 0.894, 0.827);
    if (value < 0.404) return vec3(0.886, 0.890, 0.792);
    if (value < 0.408) return vec3(0.875, 0.886, 0.757);

    if (value < 0.41) return vec3(0.855, 0.878, 0.716);
    if (value < 0.413) return vec3(0.843, 0.878, 0.682);
    if (value < 0.42) return vec3(0.831, 0.874, 0.647);
    if (value < 0.44) return vec3(0.804, 0.859, 0.600);

    if (value < 0.45) return vec3(0.722, 0.816, 0.439);
    if (value < 0.46) return vec3(0.651, 0.780, 0.188);
    if (value < 0.54) return vec3(0.600, 0.753, 0.188);
    if (value < 0.61) return vec3(0.576, 0.733, 0.176);
    if (value < 0.62) return vec3(0.545, 0.706, 0.165);

    if (value < 0.63) return vec3(0.522, 0.686, 0.153);
    if (value < 0.64) return vec3(0.486, 0.655, 0.137);
    if (value < 0.65) return vec3(0.463, 0.639, 0.129);
    if (value < 0.66) return vec3(0.447, 0.608, 0.137);
    if (value < 0.67) return vec3(0.408, 0.557, 0.125);

    if (value < 0.68) return vec3(0.345, 0.529, 0.086);
    if (value < 0.69) return vec3(0.278, 0.482, 0.043);
    if (value < 0.7) return vec3(0.188, 0.467, 0.0);
    if (value < 0.73) return vec3(0.208, 0.451, 0.047);
    if (value < 0.74) return vec3(0.231, 0.439, 0.090);

    if (value < 0.745) return vec3(0.251, 0.427, 0.129);
    if (value < 0.75) return vec3(0.275, 0.416, 0.173);
    if (value < 0.76) return vec3(0.298, 0.400, 0.227);
    if (value < 0.77) return vec3(0.357, 0.443, 0.294);
    if (value < 0.775) return vec3(0.408, 0.482, 0.349);

    if (value < 0.78) return vec3(0.455, 0.514, 0.396);
    if (value < 0.79) return vec3(0.510, 0.557, 0.455);
    if (value < 0.82) return vec3(0.569, 0.600, 0.518);
    if (value < 0.825) return vec3(0.627, 0.651, 0.576);
    if (value < 0.83) return vec3(0.675, 0.694, 0.627);

    if (value < 0.84) return vec3(0.729, 0.737, 0.675);
    if (value < 0.845) return vec3(0.788, 0.792, 0.733);
    if (value < 0.85) return vec3(0.835, 0.827, 0.776);
    if (value < 0.86) return vec3(0.890, 0.867, 0.827);
    if (value < 0.87) return vec3(0.914, 0.878, 0.839);

    if (value < 0.88) return vec3(0.933, 0.894, 0.855);
    if (value < 0.89) return vec3(0.949, 0.906, 0.871);

    return vec3(0.957, 0.941, 0.912); // Mountain Peaks
}


void main() {
    // Compute UV for the chunk based on fragment coordinates.
    vec2 chunkUv = gl_FragCoord.xy / vec2(chunkSize, chunkSize);

    // Translate the chunk's UV to the corresponding UV on the macro texture.
    vec2 macroStartUv = chunkCoord * (vec2(4.0) / macroSize);
    vec2 macroUv = macroStartUv + chunkUv * (vec2(4.0) / macroSize);

    // Scale down the UV coordinates to upscale the resolution.
    vec2 upscaledUv = floor(macroUv * chunkSize) / chunkSize;

    // Directly sample the grayscale color from the macro texture using upscaled UV.
    vec4 colorFromMacro = texture2D(macroTexture, upscaledUv);
    
    // Compute the luminance of the sampled color.
    float luminance = 0.299 * colorFromMacro.r + 0.587 * colorFromMacro.g + 0.114 * colorFromMacro.b;
    
    // Generate the chunk noise for the current fragment using the original chunkUv (not the upscaled one).
    vec2 adjustedUv = vec2(chunkUv.x, chunkUv.y * 1.5);
    float noise = generateChunkNoise(adjustedUv * 256.0); // Multiplied by 256 to ensure the noise is at 1024x1024 resolution.

    // Use the luminance as the median for the noise.
    float lowerBound = luminance - deviationFactor;
    float upperBound = luminance + deviationFactor;

    // Adjust the noise so it's within the range of 0 to 1, then scale it to the deviation range.
    noise = mix(lowerBound, upperBound, 0.5 * (noise + 1.0));

    vec3 finalColor = getColorForValue(noise);

    // Set the final color using the adjusted noise value.
    gl_FragColor = vec4(finalColor, 1.0);
}
