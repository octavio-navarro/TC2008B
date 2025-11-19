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
    vec3 normal = normalize(v_normal);

    // Normalize the other incoming vectors
    vec3 surfToLigthDirection = normalize(v_surfaceToLight);
    vec3 surfToViewDirection = normalize(v_surfaceToView);

    // CALCULATIONS FOR THE AMBIENT, DIFFUSE and SPECULAR COMPONENTS
    float diffuse = dot(normal, surfToLigthDirection);

    // Compute the three parts of the Phong lighting model
    vec4 ambientColor = u_ambientLight * u_ambientColor;
    vec4 diffuseColor = u_diffuseLight * u_diffuseColor * diffuse;
    vec4 specularColor = vec4(0, 0, 0, 1);

    // Use the color of the texture on the object
    outColor = ambientColor + diffuseColor + specularColor;
}
