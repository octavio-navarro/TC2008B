#version 300 es
in vec4 a_position;
in vec3 a_normal;

// Scene uniforms
uniform vec3 u_lightWorldPosition;
uniform vec3 u_viewWorldPosition;

// Model uniforms
uniform mat4 u_world;
uniform mat4 u_worldInverseTransform;
uniform mat4 u_worldViewProjection;

// Transformed normals
out vec3 v_normal;
out vec3 v_surfaceToLight;
out vec3 v_surfaceToView;

void main() {
    // Transform the position of the vertices
    gl_Position = vec4(0, 0, 0, 1);

    // Transform the normal vector along with the object
    v_normal = a_normal;

    // Get world position of the surface
    vec3 surfaceWoldPosition = vec3(0, 0, 0);


    // Direction from the surface to the light
    v_surfaceToLight = vec3(0, 0, 0);

    // Direction from the surface to the view
    v_surfaceToView = vec3(0, 0, 0);
}
