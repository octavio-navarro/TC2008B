#version 300 es
in vec4 a_position;
in vec4 a_color;

uniform mat4 u_transforms;

out vec4 v_color;

void main() {
    gl_Position = u_transforms * a_position;
    v_color = a_color;
}
