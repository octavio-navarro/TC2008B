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
    // it for each fragment
    vec3 normal = vec3(0, 0, 0);

    // Normalize the other incoming vectors
    vec3 surfToLigthDirection = vec3(0, 0, 0);
    vec3 surfToViewDirection = vec3(0, 0, 0);

    // CALCULATIONS FOR THE AMBIENT, DIFFUSE and SPECULAR COMPONENTS


    // Compute the three parts of the Phong lighting model
    vec4 ambientColor = vec4(0, 0, 0, 1);
    vec4 diffuseColor = vec4(0, 0, 0, 1);
    vec4 specularColor = vec4(0, 0, 0, 1);

    // Use the color of the texture on the object
    outColor = ambientColor + diffuseColor + specularColor;
}
