#version 300 es
precision highp float;

/*
Shader to simply copy the color of a texture, without any effect from the light.
Used for skyboxes.
*/

in vec2 v_texCoord;

uniform sampler2D u_texture;

out vec4 outColor;

void main() {
    // Use the color of the texture on the object
    outColor = texture(u_texture, v_texCoord);
}
