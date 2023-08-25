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

uniform vec2 seed;

// Start of unique code;
float generateNoise(vec2 position, float persistence, float lacunarity, float frequency, float amplitude) {
    float total = 0.0;
    float maxValue = 0.0;  // Used for normalizing result to 0.0 - 1.0
    float weight = 1.0;

    const int OCTAVES = 12;
    for (int i = 0; i < OCTAVES; i++) {
        total += cnoise(position * frequency + seed) * amplitude * weight;
        maxValue += amplitude * weight;
        weight *= persistence;
        frequency *= lacunarity;
    }
    
    // normalize the result between 0 and 1
    return (total / maxValue + 1.0) * 0.5;
}

vec3 getColorForValue(float value) {
    vec3 deepLake = vec3(0.0, 0.05, 0.62);
    vec3 lake = vec3(0.0, 0.53, 1.0);
    vec3 shallowLake = vec3(0.52, 0.68, 0.82);
    vec3 shoreLake = vec3(0.69, 0.88, 0.83);
    vec3 beach = vec3(0.9, 0.89, 0.83);
    vec3 landBeach = vec3(0.84, 0.88, 0.65);
    vec3 land = vec3(0.6, 0.76, 0.19);
    vec3 semiInland = vec3(0.46, 0.64, 0.13);
    vec3 inland = vec3(0.18, 0.47, 0.0);
    vec3 mountainousInland = vec3(0.3, 0.4, 0.23);
    vec3 mountainous = vec3(0.57, 0.6, 0.52);
    vec3 highMountainous = vec3(0.82, 0.82, 0.77);
    vec3 mountainPeaks = vec3(0.96, 0.94, 0.91);

    if (value < 0.3) return deepLake;
    else if (value < 0.35) return lake;
    else if (value < 0.38) return shallowLake;
    else if (value < 0.39) return shoreLake;
    else if (value < 0.4) return beach;
    else if (value < 0.413) return landBeach;
    else if (value < 0.54) return land;
    else if (value < 0.65) return semiInland;
    else if (value < 0.7) return inland;
    else if (value < 0.76) return mountainousInland;
    else if (value < 0.82) return mountainous;
    else if (value < 0.85) return highMountainous;
    else return mountainPeaks;
}

void main() {
    vec2 uv = gl_FragCoord.xy / vec2(320.0, 320.0);
    float noiseValue = generateNoise(uv, 0.3, 3.0, 3.0, 2.0);
    vec3 color = getColorForValue(noiseValue);
    gl_FragColor = vec4(color, 1.0);
}