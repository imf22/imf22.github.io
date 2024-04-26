#version 300 es

precision mediump float;
uniform vec3 ambientProduct;
uniform vec3 diffuseProduct;
uniform vec3 specularProduct;
uniform float shininess;

in  vec3 vN, vL, vE;
out vec4 fColor;

void main()
{
    vec3 N = normalize(vN);
    vec3 E = normalize(vE);
    vec3 L = normalize(vL);

    if (dot(E,N) < 0.0) N = vec3(-1,-1,-1) * N;


    vec3 color;
    vec3 H = normalize( L + E );
    vec3 ambient = ambientProduct;
    float diffuseTerm = max( dot(L, N), 0.0 );
    vec3 diffuse = diffuseTerm*diffuseProduct;
    float specularTerm = pow( max(dot(N, H), 0.0), shininess );
    vec3 specular = specularTerm * specularProduct;
    if ( dot(L, N) < 0.0 ) specular = vec3(0.0, 0.0, 0.0);
    color = ambient + diffuse + specular;
    fColor = vec4(min(color,1.0), 1.0);
}