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
    vec3 v_n_n = normalize(v_normal);
    vec3 v_l_n = normalize(v_lightDirection);
    vec3 v_c_n = normalize(v_cameraDirection);

    // Ambient lighting component
    vec4 ambient = u_ambientLight * u_ambientColor;

    // Diffuse light component
    vec4 diffuse = vec4(0, 0, 0, 1);
    float lambert = dot(v_n_n, v_l_n);
    if (lambert > 0.0) {
       diffuse = u_diffuseLight * u_diffuseColor * lambert;
    }

    vec4 specular = vec4(0, 0, 0, 1);

    outColor = ambient + diffuse + specular;
}
