#version 300 es
precision highp float;

in vec3 v_normal;
in vec3 v_cameraDirection;
in vec3 v_lightDirection;

// Light
uniform vec4 u_ambientLight;
uniform vec4 u_diffuseLight;
uniform vec4 u_specularLight;

// Object material
uniform vec4 u_ambientColor;
uniform vec4 u_diffuseColor;
uniform vec4 u_specularColor;
uniform float u_shininess;

out vec4 outColor;

void main() {
    vec4 ambient = u_ambientLight * u_ambientColor;    

    // Diffuse component
    // Normalize the vectors    
    vec3 normalVector = normalize(v_normal);
    vec3 lightVector = normalize(v_lightDirection);
    float lambert = dot(normalVector, lightVector);
    vec4 diffuse = vec4(0, 0, 0, 1);
    // Validate that the light is in front of the object
    if (lambert > 0.0) {
        diffuse = u_diffuseLight * u_diffuseColor * lambert;
    }

    outColor = ambient + diffuse;
}
