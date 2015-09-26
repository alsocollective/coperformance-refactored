#define PROCESSING_COLOR_SHADER

varying vec4 vertColor;

uniform float fogNear;
uniform float fogFar;
uniform float fogBrightness;

void main(){
    gl_FragColor = vertColor;
    
    vec3 fogColor = vec3(fogBrightness,fogBrightness,fogBrightness);
    float depth = gl_FragCoord.z / gl_FragCoord.w;
    float fogFactor = smoothstep(fogNear, fogFar, depth);
    gl_FragColor = mix(gl_FragColor, vec4(fogColor, gl_FragColor.w), fogFactor);
}