#version 300 es
precision highp float;

in vec3 v_normal;
in vec3 v_surfaceToLight;
in vec3 v_surfaceToView;

// Scene uniforms
uniform vec4 u_ambientLight;
uniform vec4 u_diffuseLight;
uniform vec4 u_specularLight;

// Model uniforms
uniform vec4 u_ambientColor;
uniform vec4 u_diffuseColor;
uniform vec4 u_specularColor;
uniform float u_shininess;

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
        float specular_dot = dot(surfToViewDirection, reflectionVector);
        if (specular_dot > 0.0) {
            specular = pow(specular_dot, u_shininess);
        }
    }

    // Compute the three parts of the Phong lighting model
    vec4 ambientColor = u_ambientColor * u_ambientLight;
    vec4 diffuseColor = light * u_diffuseColor * u_diffuseLight;
    vec4 specularColor = specular * u_specularColor * u_specularLight;

    // Use the color of the texture on the object
    outColor = ambientColor + diffuseColor + specularColor;
}
