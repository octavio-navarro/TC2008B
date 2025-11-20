#version 300 es
precision highp float;

/*
Shader to simply copy the color of a texture, without any effect from the light.
Used for skyboxes.
*/

in vec4 a_position;
in vec2 a_texCoord;

uniform mat4 u_worldViewProjection;

out vec2 v_texCoord;

void main() {
    // Pass along the texture coordinates
    v_texCoord = a_texCoord;

    // Transform the position of the vertices
    gl_Position = u_worldViewProjection * a_position;
}
