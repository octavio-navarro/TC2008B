#version 300 es
in vec4 a_position;
in vec3 a_normal;
in vec2 a_texCoord;

uniform vec3 u_lightWorldPosition;
uniform vec3 u_viewWorldPosition;

uniform mat4 u_world;
uniform mat4 u_worldInverseTransform;
uniform mat4 u_worldViewProjection;

out vec3 v_normal;
out vec3 v_surfaceToLight;
out vec3 v_surfaceToView;
out vec2 v_texCoord;

void main() {
    // Pass along the texture coordinates
    v_texCoord = a_texCoord;

    // Transform the position of the vertices
    gl_Position = u_worldViewProjection * a_position;

    //v_normal = u_world * vec4(a_normal.xyz, 0);
    v_normal = mat3(u_worldInverseTransform) * a_normal;

    // Get world position of the surface
    vec3 surfaceWorldPosition = (u_world * a_position).xyz;

    // Direction from the surface to the light
    v_surfaceToLight = u_lightWorldPosition - surfaceWorldPosition;

    // Direction from the surface to the view
    v_surfaceToView = u_viewWorldPosition - surfaceWorldPosition;
}
