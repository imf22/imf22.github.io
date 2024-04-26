"use strict";

// Run the command "python3 -m http.server", which starts a local web server.
// Open Firefox and go to "http://localhost:8000/" to display your application.
// 8000 is the default port. You should see the port number on your terminal output. 

var canvas;
var gl;
var cam;

var positions = [];
var colors = [];

// App components
var normalLoc;
var positionLoc;

var uvLoc;

// a6 Stuff

var currentModel = 0;

var prog1;
var prog2;
var currentProg = 0;

var material0, mat_ground;
var currentMat;
var spotlight

// A8 stuff
var texture;
var imgURL = "./images/kh2img.jpg";
var imgURL = "./images/PLEZ.jpg";

// A10 Stuff
var currentArm;
var allParts;
var arm0, arm1, arm2, arm3, floor;
var base, a0T, a1T, a2T, a3T, floorT;


window.onload = function init() {
    setUpCanvas();

    material0 = new Material(
        vec3(0.8, 0.8, 0.8),
        vec3(0.5, 0.45, 0.75),
        vec3(0.4, 0.5, 0.7),
        10.0);
    
    mat_ground = new Material(
        vec3(0.8, 0.5, 0.5),
        vec3(0.5, 0.45, 0.75),
        vec3(0.1, 0.1, 0.7),
        10.0);

    currentMat = material0;

    cam = new Camera()

    setupRobotComponents();
    // allParts = [smfShape1]
    // allParts = [smfShape1, smfShape2]



    cam.setLookAt(base.shape);
    drawAllShapes();

    addArmMenuListener()
    addArmKeystrokeListener()

};



function drawAllShapes() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // console.log(allParts);
    allParts.forEach(shape => {
        initialize(shape.shape);

        gl.uniformMatrix4fv(gl.getUniformLocation(prog1, "x_transforms"), false, flatten(shape.xformMat));

        drawToProgram(shape);

    });
}

function readInSMFFile(fname) {
    var smf_file = loadFileAJAX(fname); //# in initShaders2.js
    var lines = smf_file.split('\n');

    var vertexList = [];
    var faceList = [];


    for (var line = 0; line < lines.length; line++) {
        var strings = lines[line].trimRight().split(' ');
        switch (strings[0]) {
            case ('v'):
                // # Process vertices
                vertexList.push(vec3(parseFloat(strings[1]), parseFloat(strings[2]), parseFloat(strings[3])))
                break;
            case ('f'):
                // # Process faces
                faceList.push([parseInt(strings[1]), parseInt(strings[2]), parseInt(strings[3])]);
                break;

        }
    }

    // cam = new Camera(calculateCentroid(vertexList), components);  
    var smfShape = new Shape3D(prog1, currentMat, vertexList, faceList);


    smfShape.initializeInputs();


    return smfShape
}

// function setUpCanvas() {
//     canvas = document.getElementById("gl-canvas");

//     gl = canvas.getContext('webgl2');

//     if (!gl) alert("WebGL 2.0 isn't available");

//     gl.viewport(0, 0, canvas.width, canvas.height);
//     gl.clearColor(1.0, 1.0, 1.0, 1.0);
//     gl.enable(gl.DEPTH_TEST);

//     // Initialize flat phong shaders
//     prog1 = initShaders(gl, "./_v_phong_orig.glsl", "./_f_phong_orig.glsl");
// }

async function setUpCanvas() {
    // Previous code
    canvas = document.getElementById("gl-canvas");

    gl = canvas.getContext('webgl2');

    if (!gl) alert("WebGL 2.0 isn't available");

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    gl.enable(gl.DEPTH_TEST);

    // Modified loading of shaderfiles
    try {
        prog1 = await initShaders(gl, "webglproject/_v_phong_orig.glsl", "webglproject/_f_phong_orig.glsl");
        // ... continue with the rest of your WebGL setup now that shaders are ready...
    } catch (err) {
        console.error(`Error initializing shaders: ${err.message}`);
    }
}
    


function initialize(shape) {
    // move stuff from shape3d initialize to here
    gl.useProgram(prog1);

    // pushControlPoints();

    var allVertex = shape.getOutVertex();
    var allNormals = shape.getOutNormals();

    // console.log(shape.getOutUVs());
    // var allUVs = shape.getOutUVs();


    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(allVertex), gl.STATIC_DRAW);
    // gl.bufferSubData(gl.ARRAY_BUFFER, , data);

    positionLoc = gl.getAttribLocation(prog1, "aPosition");
    gl.vertexAttribPointer(positionLoc, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionLoc);

    var nBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, nBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(allNormals), gl.STATIC_DRAW);

    normalLoc = gl.getAttribLocation(prog1, "aNormal");
    gl.vertexAttribPointer(normalLoc, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(normalLoc);


}

function drawToProgram(shapeBundle) {
    // gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    // console.log("current shape bundle:", shapeBundle)
    var shape = shapeBundle.shape;

    // gl.uniformMatrix4fv(gl.getUniformLocation(prog1, "x_transforms"), false, flatten(shapeBundle.xformMat));

    // // Update camera and set uniforms
    cam.updateCamera();

    gl.uniformMatrix4fv(gl.getUniformLocation(prog1, "modelViewMatrix"), false, flatten(cam.getModelViewMatrix()));
    gl.uniformMatrix4fv(gl.getUniformLocation(prog1, "projectionMatrix"), false, flatten(cam.getProjectionMatrix()));


    // Shader Program -----------------------------------------------
    var ambientProduct = mult(cam.pointLight.getAmbient(), material0.getAmbient());
    var diffuseProduct = mult(cam.pointLight.getDiffuse(), material0.getDiffuse());
    var specularProduct = mult(cam.pointLight.getSpecular(), material0.getSpecular());
    // var lightPosition = mult(this.camera.getModelViewMatrix())

    // gl.uniform1i(gl.getUniformLocation(prog1, "useColor"), 0);
    gl.uniform3fv(gl.getUniformLocation(prog1, "ambientProduct"), flatten(ambientProduct));
    gl.uniform3fv(gl.getUniformLocation(prog1, "diffuseProduct"), flatten(diffuseProduct));
    // gl.uniform3fv(gl.getUniformLocation(prog1, "diffuseColor"), flatten(cam.pointLight.getDiffuse()) );
    gl.uniform3fv(gl.getUniformLocation(prog1, "specularProduct"), flatten(specularProduct));
    gl.uniform3fv(gl.getUniformLocation(prog1, "lightPosition"), flatten(cam.pointLight.getLightPosInCamCoordinates(cam)));
    // gl.uniform3fv(gl.getUniformLocation(this.program, "lightPosition"), flatten(this.camera.pointLight.getPosition()));
    gl.uniform1f(gl.getUniformLocation(prog1, "shininess"), material0.getShininess());

    gl.drawArrays(gl.TRIANGLES, 0, shape.getOutVertex().length)
    gl.disableVertexAttribArray(positionLoc);
    gl.disableVertexAttribArray(normalLoc);


}


function newCube(prog, mat) {
    // var cubeData = CubeStatic.cubeFaces();
    var newCube = new Shape3D(prog1, mat, CubeStatic.VEXTEX_POSITIONS, CubeStatic.cubeFaces());
    newCube.initializeInputs();
    return newCube;
}

function newPlane(mat){
    var newPlane = new Shape3D(prog1, mat, PlaneStatic.VEXTEX_POSITIONS, PlaneStatic.getPlaneFace());
    newPlane.initializeInputs();
    return newPlane;
}

function setupRobotComponents() {

    base = setupBase();
    arm0 = setUpA0();
    arm1 = setUpA1();
    arm2 = setUpA2();
    arm3 = setUpA3();
    floor = setUpFloor();

    currentArm = arm1;

    allParts = [base, arm0, arm1, arm2, arm3, floor];
    // allParts = [base, arm0, arm1, arm2, arm3];
    updateRobotComponents();
}

function updateRobotComponents() {
    // console.log("updating");

    updateArm(arm0)
    updateArm(arm1)
    // updateArm(arm1, arm0)
    updateArm(arm2, arm1)
    updateArm(arm3, arm2)

}

function setUpFloor(){
    floorT = new ShapeTransforms(
        [1, 1, 1],
        [0.0, 45.0, 0.0],
        [0.4, 0.4, 0.0]
    )

    return new ShapeContainer(newPlane(mat_ground), floorT);
    
}
function setUpA3() {
    // S, R, T
    a3T = new ShapeTransforms(
        [0.05, 0.5, 0.05],
        [0.0, 0.0, 0.0],
        [0.4, 0.0, 0.0]
    );

    return new ShapeContainer(newCube(), a3T);
}
function setUpA2() {
    a2T = new ShapeTransforms(
        [0.5, 0.1, 0.1],
        [0.0, 0, 0.0],
        [0.5, 0.1, 0.0]
    );

    return new ShapeContainer(newCube(), a2T);

}
function setUpA1() {
    a1T = new ShapeTransforms(
        [0.5, 0.1, 0.1],
        [0.0, 0.0, 0.0],
        [0.0, 0.55, 0.0]
    );

    return new ShapeContainer(newCube(), a1T);

}
function setUpA0() {
    // S, R, T
    a0T = new ShapeTransforms(
        [0.1, 1.0, 0.1],
        [0.0, 0.0, 0.0],
        [-0.05, 0.0, 0.0]
    );

    return new ShapeContainer(newCube(), a0T);

}
function setupBase() {
    var bT = new ShapeTransforms([0.5, 0.1, 0.5],
        null,
        [-0.25, -0.5, 0.0]
    );

    var base = new ShapeContainer(newCube(), bT);
    // Does not change
    var xform0 = mat4();
    var s = scale(base.transform.getScale()[0], base.transform.getScale()[1], base.transform.getScale()[2]);
    xform0 = mult(s, xform0);

    var t = translate(base.transform.getOffset()[0], base.transform.getOffset()[1], base.transform.getOffset()[2]);
    xform0 = mult(t, xform0);

    base.xformMat = xform0;

    return base;
}

function updateArm(arm, M = null) {
    var xform = mat4();
    var newParentT = mat4();

    var s = scale(arm.transform.getScale()[0], arm.transform.getScale()[1], arm.transform.getScale()[2]);
    xform = mult(s, xform);

    var r = mult(rotateZ(arm.transform.getTheta()[2]), mult(rotateY(arm.transform.getTheta()[1]), rotateX(arm.transform.getTheta()[0])));
    xform = mult(r, xform)
    newParentT = mult(r, newParentT);

    var t = translate(arm.transform.getOffset()[0], arm.transform.getOffset()[1], arm.transform.getOffset()[2]);
    xform = mult(t, xform);
    newParentT = mult(t, newParentT);







    if (M) {
        // console.log("Before:", xform)
        // console.log("MparentT:", newParentT)

        xform = mult(M.parentT, xform);

        // console.log("After:", xform)

        newParentT = mult(M.parentT, newParentT);
    }
    arm.parentT = newParentT

    arm.xformMat = xform;
}



class ShapeTransforms {
    constructor(s = null, r = null, t = null) {
        this.scale = (s === null) ? [1.0, 1.0, 1.0] : s;
        this.theta = (r === null) ? [0, 0, 0] : r;
        this.offset = (t === null) ? [0.0, 0.0, 0.0] : t;
    }

    getScale() {
        return this.scale;
    }

    set(newS) {
        this.scale = newS;
    }

    getTheta() {
        return this.theta;
    }

    setTheta(newT) {
        this.theta = newT;
    }
    getOffset() {
        return this.offset;
    }

    setOffset(newO) {
        this.offset = newO;
    }

}
class ShapeContainer {
    constructor(shape, transform, M = null) {
        this.shape = shape;
        this.transform = transform;
        this.xformMat = mat4();
        this.parentT = M;
    }
}