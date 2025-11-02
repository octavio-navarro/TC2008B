#version 300 es
in vec4 a_position;
in vec3 a_normal;

// Scene uniforms
uniform vec3 u_viewWorldPosition;
uniform vec3 u_lightWorldPosition;

// Model uniforms
uniform mat4 u_world;
uniform mat4 u_worldInverseTransform;
uniform mat4 u_worldViewProjection;

// Pass the transformed vectors to the fragment shader
out vec3 v_normal;
out vec3 v_lightDirection;
out vec3 v_cameraDirection;

void main() {
    gl_Position = vec4(0, 0, 0, 1);

    // Apply the object transformations to the normal vector
    v_normal = a_normal;

    // Get vectors to the light and to the camera
    v_lightDirection = vec3(0, 0, 0);
    v_cameraDirection = vec3(0, 0, 0);
}
