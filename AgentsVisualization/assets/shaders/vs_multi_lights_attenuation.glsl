#version 300 es
in vec4 a_position;
in vec3 a_normal;
in vec2 a_texCoord;

const int NUM_LIGHTS = 3;

uniform vec3 u_lightWorldPosition[NUM_LIGHTS];
uniform vec3 u_viewWorldPosition;

uniform mat4 u_world;
uniform mat4 u_worldInverseTransform;
uniform mat4 u_worldViewProjection;

out vec4 v_position;
out vec3 v_normal;
out vec3 v_surfaceToLight[NUM_LIGHTS];
out vec3 v_surfaceToView;
out vec2 v_texCoord;

void main() {
    // Pass along the texture coordinates
    v_texCoord = a_texCoord;

    v_position = u_worldViewProjection * a_position;
    // Transform the position of the vertices
    gl_Position = v_position;

    //v_normal = u_world * vec4(a_normal.xyz, 0);
    v_normal = mat3(u_worldInverseTransform) * a_normal;

    // Get world position of the surface
    vec3 surfaceWorldPosition = (u_world * a_position).xyz;

    // Direction from the surface to the lights
    for (int i=0; i<NUM_LIGHTS; i++) {
        v_surfaceToLight[i] = u_lightWorldPosition[i] - surfaceWorldPosition;
    }

    // Direction from the surface to the view
    v_surfaceToView = u_viewWorldPosition - surfaceWorldPosition;
}
