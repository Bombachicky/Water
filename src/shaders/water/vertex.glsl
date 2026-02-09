varying vec2 vUv;
varying vec4 vScreenPos;
varying float vWaterDepth;
varying vec2 vNoiseUV;
varying vec2 distortUv;
varying vec3 vViewNormal;

uniform vec2 uNoiseTiling;
uniform vec2 uNoiseOffset;

void main()
{
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    gl_Position = projectedPosition;

    vUv = uv;
    vScreenPos = projectedPosition;
    vWaterDepth = -viewPosition.z;
    vNoiseUV = uv * uNoiseTiling + uNoiseOffset;
    vViewNormal = normalize(normalMatrix * normal);
}
