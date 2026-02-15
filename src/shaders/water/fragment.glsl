uniform vec3 uDepthGradientShallow;
uniform vec3 uDepthGradientDeep;
uniform float uDepthMaxDistance;
uniform sampler2D uDepthTexture;
uniform float uCameraNear;
uniform float uCameraFar;
uniform sampler2D uSurfaceNoise;
uniform float uSurfaceNoiseCutoff;
uniform float uFoamMaxDistance;
uniform float uFoamMinDistance;
uniform vec2 uSurfaceNoiseScroll;
uniform float uTime;
uniform sampler2D uSurfaceDistortion;
uniform float uSurfaceDistortionAmount;
uniform sampler2D uNormalsTexture;
uniform sampler2D uRippleTexture;

varying vec2 vUv;
varying vec4 vScreenPos;
varying float vWaterDepth;
varying vec2 vNoiseUV;
varying vec3 vViewNormal;

#define SMOOTHSTEP_AA 0.01

// Converts screen coord to depth relative to camera
float getLinearDepth(vec2 coord) {
    // Converts [-1, 1] to [0, 1]
    coord = coord * 0.5 + 0.5;
    float depth = texture2D(uDepthTexture, coord).r;
    return (uCameraNear * uCameraFar) / (uCameraFar - depth * (uCameraFar - uCameraNear));
}

void main() {
    vec2 screenUV = vScreenPos.xy / vScreenPos.w;

    // Compare differences between the depth of water and the objects behind it
    float sceneDepth = getLinearDepth(screenUV);
    float depthDifference = sceneDepth - vWaterDepth;
    float waterDepthFactor = clamp(depthDifference / uDepthMaxDistance, 0.0, 1.0);
    vec3 waterColor = mix(uDepthGradientShallow, uDepthGradientDeep, waterDepthFactor);

    // Compare the normals of the water and the objects overlapping it to apply foam
    vec2 normalUV = screenUV * 0.5 + 0.5;
    vec3 normalSample = texture2D(uNormalsTexture, normalUV).rgb * 2.0 - 1.0;
    float normalDot = clamp(dot(normalSample, vViewNormal), 0.0, 1.0);
    float foamDistance = mix(uFoamMaxDistance, uFoamMinDistance, normalDot);
    float foamDepthDifference = clamp(depthDifference / foamDistance, 0.0, 1.0);
    float surfaceNoiseCutoff = foamDepthDifference * uSurfaceNoiseCutoff;

    vec2 rippleUV = screenUV * 0.5 + 0.5;
    float ripples = texture2D(uRippleTexture, rippleUV).b;
    ripples = step(0.99, ripples * 1.9);

    // Apply noise, distortion, and animation
    vec2 distortSample = (texture2D(uSurfaceDistortion, vUv) * 2.0 - 1.0).xy * uSurfaceDistortionAmount;
    vec2 noiseUV = vNoiseUV + uTime * uSurfaceNoiseScroll + distortSample + ripples * 0.1;
    float surfaceNoiseSample = texture2D(uSurfaceNoise, noiseUV).r;
    float surfaceNoise = smoothstep(surfaceNoiseCutoff - SMOOTHSTEP_AA, surfaceNoiseCutoff + SMOOTHSTEP_AA, surfaceNoiseSample);

    gl_FragColor = vec4(waterColor + surfaceNoise + ripples, 1.0);
}