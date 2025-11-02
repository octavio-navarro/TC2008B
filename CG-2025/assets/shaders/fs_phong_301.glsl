#version 300 es
precision highp float;

in vec3 v_normal;
in vec3 v_lightDirection;
in vec3 v_cameraDirection;

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
    // Normalize the received vectors, which are interpolated

    // Ambient lighting component
    vec4 ambient = u_ambientLight * u_ambientColor;

    // Diffuse light component
    vec4 diffuse = vec4(0, 0, 0, 1);

    // Specular light component
    vec4 specular = vec4(0, 0, 0, 1);

    // Final color
    outColor = ambient + diffuse + specular;
}
