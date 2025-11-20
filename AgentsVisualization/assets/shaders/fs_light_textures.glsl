#version 300 es
precision highp float;

in vec3 v_normal;
in vec3 v_surfaceToLight;
in vec3 v_surfaceToView;
in vec2 v_texCoord;

uniform vec4 u_color;
uniform float u_shininess;
uniform vec4 u_diffuseLight;
uniform vec4 u_specularLight;
uniform sampler2D u_texture;

out vec4 outColor;

void main() {
    // v_normal must be normalized because the shader will interpolate
    // it for each pixel
    vec3 normal = normalize(v_normal);

    vec3 surfToLigthDirection = normalize(v_surfaceToLight);
    vec3 surfToViewDirection = normalize(v_surfaceToView);
    vec3 halfVector = normalize(surfToLigthDirection + surfToViewDirection);

    float light = dot(normal, surfToLigthDirection);
    float specular = 0.0;
    if (light > 0.0) {
        specular = pow(dot(normal, halfVector), u_shininess);
    }

    // Use the color of the texture on the object
    outColor = texture(u_texture, v_texCoord);

    // Multiply the color by the direction of the light
    // Keep only the rgb part of the color
    outColor.rgb *= light * normalize(u_diffuseLight.rgb);

    // Add the specular
    // Keep only the rgb part of the color
    outColor.rgb += specular * normalize(u_specularLight.rgb);
}
