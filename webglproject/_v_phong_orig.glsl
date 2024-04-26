#version 300 es

// vertex shader
in  vec3 aPosition;
in  vec3 aNormal;
out vec3 vN, vL, vE;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform vec3 lightPosition; // in camera coordinates
uniform mat4 x_transforms; 

void main()
{
    vec3 pos = (modelViewMatrix * x_transforms * vec4(aPosition, 1.0)).xyz ;
    vL = normalize( lightPosition - pos );
    vE = normalize( -pos );
    vN = normalize( (modelViewMatrix*vec4(aNormal, 0.0)).xyz);
    // gl_Position = projectionMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix  * vec4(pos, 1.0) ;

}