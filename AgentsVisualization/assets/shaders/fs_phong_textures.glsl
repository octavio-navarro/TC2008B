#version 300 es
precision highp float;

in vec3 v_normal;
in vec3 v_surfaceToLight;
in vec3 v_surfaceToView;
in vec2 v_texCoord;

uniform float u_shininess;

uniform sampler2D u_texture;

uniform vec4 u_ambientLight;
uniform vec4 u_diffuseLight;
uniform vec4 u_specularLight;

out vec4 outColor;

void main() {
    // v_normal must be normalized because the shader will interpolate
    // it for each pixel
    vec3 normal = normalize(v_normal);

    vec3 surfToLigthDirection = normalize(v_surfaceToLight);
    vec3 surfToViewDirection = normalize(v_surfaceToView);

    // Finding the reflection vector
    // https://en.wikipedia.org/wiki/Phong_reflection_model
    vec3 reflectionVector = (2.0 * dot(surfToLigthDirection, normal)
        * normal - surfToLigthDirection);

    float light = max(dot(normal, surfToLigthDirection), 0.0);
    float specular = 0.0;
    if (light > 0.0) {
        specular = pow(max(dot(surfToViewDirection, reflectionVector), 0.0), u_shininess);
    }

    // Set the color of the fragment from the texture
    vec4 color = texture(u_texture, v_texCoord);

    // Compute the three parts of the Phong lighting model
    vec4 ambientColor = color * u_ambientLight;
    vec4 diffuseColor = light * color * u_diffuseLight;
    vec4 specularColor = specular * color * u_specularLight;

    // Use the color of the texture on the object
    outColor = ambientColor + diffuseColor + specularColor;
}
