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

uniform bool u_have_normal_map;
uniform sampler2D u_normal_map;

out vec3 v_normal;
out vec3 v_surfaceToLight[NUM_LIGHTS];
out vec3 v_surfaceToView;
out vec2 v_texCoord;

void main() {
    // Pass along the texture coordinates
    v_texCoord = a_texCoord;

    // Transform the position of the vertices
    gl_Position = u_worldViewProjection * a_position;

    if (u_have_normal_map) {
        // Using normals from texture
        // Adapting them according to the video at:
        //  https://www.youtube.com/watch?v=htr3vELCmnY
        // More information about computing Tangent Space at:
        // https://ogldev.org/www/tutorial26/tutorial26.html
        vec3 image_normal = texture(u_normal_map, v_texCoord).xyz;
        // Adjust for positive and negative values
        image_normal = normalize(image_normal * 2.0 - vec3(1.0));
        v_normal = mat3(u_worldInverseTransform) * image_normal;
        //v_normal = mat3(u_worldInverseTransform) * normalize(texture(u_normal_map, v_texCoord)).xyz;
    } else {
        v_normal = mat3(u_worldInverseTransform) * a_normal;
    }

    // Get world position of the surface
    vec3 surfaceWorldPosition = (u_world * a_position).xyz;

    // Direction from the surface to the lights
    for (int i=0; i<NUM_LIGHTS; i++) {
        v_surfaceToLight[i] = u_lightWorldPosition[i] - surfaceWorldPosition;
    }

    // Direction from the surface to the view
    v_surfaceToView = u_viewWorldPosition - surfaceWorldPosition;
}
