#version 300 es
in vec4 a_position;

uniform mat4 u_transforms;

void main() {
    gl_Position = u_transforms * a_position;
}
